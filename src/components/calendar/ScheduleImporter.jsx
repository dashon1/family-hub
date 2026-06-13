import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  X, 
  Upload, 
  FileText, 
  Calendar, 
  Loader2,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from '@/api/integrations';
import { CalendarEvent } from '@/api/entities';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ScheduleImporter({ onClose, onSuccess, user }) {
  const [scheduleText, setScheduleText] = useState('');
  const [scheduleType, setScheduleType] = useState('work');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // Upload file
      const { file_url } = await UploadFile({ file });
      setUploadedFile(file_url);

      // Extract schedule data using AI
      const extractionResult = await ExtractDataFromUploadedFile({
        file_url: file_url,
        json_schema: {
          type: "object",
          properties: {
            events: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  start_date: { type: "string" },
                  end_date: { type: "string" },
                  start_time: { type: "string" },
                  end_time: { type: "string" },
                  location: { type: "string" },
                  description: { type: "string" },
                  recurring: { type: "string" }
                }
              }
            }
          }
        }
      });

      if (extractionResult.status === 'success' && extractionResult.output?.events) {
        setResults(extractionResult.output.events);
      } else {
        alert('Could not extract schedule data. Please try copy/paste method.');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process file. Please try the copy/paste method.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextParse = async () => {
    if (!scheduleText.trim()) {
      alert('Please enter schedule information');
      return;
    }

    setIsProcessing(true);
    try {
      const prompt = `Parse this ${scheduleType} schedule and extract all events. Return a JSON array of events with the following structure:
{
  "events": [
    {
      "title": "Event name",
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD (optional)",
      "start_time": "HH:MM (24-hour format)",
      "end_time": "HH:MM (24-hour format)",
      "location": "Location (if mentioned)",
      "description": "Any additional details",
      "recurring": "none, daily, weekly, or monthly (if it repeats)"
    }
  ]
}

Schedule text:
${scheduleText}

Important:
- Extract ALL events/classes/shifts mentioned
- Convert all dates to YYYY-MM-DD format
- Convert times to 24-hour format (HH:MM)
- If recurring pattern is mentioned (e.g., "every Monday"), set recurring to "weekly"
- If it's a regular shift schedule, mark as recurring
- Use "${scheduleType}" as the category`;

      const response = await InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            events: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  start_date: { type: "string" },
                  end_date: { type: "string" },
                  start_time: { type: "string" },
                  end_time: { type: "string" },
                  location: { type: "string" },
                  description: { type: "string" },
                  recurring: { type: "string" }
                }
              }
            }
          }
        }
      });

      if (response?.events && response.events.length > 0) {
        setResults(response.events);
      } else {
        alert('Could not parse schedule. Please check the format and try again.');
      }
    } catch (error) {
      console.error('Error parsing schedule:', error);
      alert('Failed to parse schedule. Please try reformatting your text.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportEvents = async () => {
    if (!results || results.length === 0) return;

    setIsProcessing(true);
    try {
      // Create all events in bulk
      const createPromises = results.map(event => 
        CalendarEvent.create({
          title: event.title || 'Untitled Event',
          start_date: event.start_date,
          end_date: event.end_date || event.start_date,
          start_time: event.start_time || '',
          end_time: event.end_time || '',
          location: event.location || '',
          description: event.description || '',
          category: scheduleType,
          recurring: event.recurring || 'none',
          household_id: user?.household_id,
          visibility: 'household'
        })
      );

      await Promise.all(createPromises);
      
      alert(`Successfully imported ${results.length} events to your calendar!`);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error importing events:', error);
      alert('Some events failed to import. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl my-8"
      >
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI Schedule Import
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Upload a file or paste your work/school schedule. AI will automatically create calendar events!
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Schedule Type */}
            <div className="space-y-2">
              <Label>Schedule Type</Label>
              <Select value={scheduleType} onValueChange={setScheduleType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work Schedule</SelectItem>
                  <SelectItem value="school">School Schedule</SelectItem>
                  <SelectItem value="activity">Activity Schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Upload Schedule File</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-3">
                  Upload PDF, image, or CSV file with your schedule
                </p>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="schedule-upload"
                  disabled={isProcessing}
                />
                <label htmlFor="schedule-upload">
                  <Button variant="outline" disabled={isProcessing} asChild>
                    <span>
                      {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                      Choose File
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
              </div>
            </div>

            {/* Text Input */}
            <div className="space-y-2">
              <Label>Copy & Paste Schedule</Label>
              <Textarea
                placeholder={`Paste your ${scheduleType} schedule here... 

Examples:
"Monday 9:00 AM - 5:00 PM at Office"
"Biology class every Tuesday and Thursday 10:30-11:45 in Room 204"
"Night shift Jan 15-20, 11pm-7am"`}
                value={scheduleText}
                onChange={(e) => setScheduleText(e.target.value)}
                rows={8}
                disabled={isProcessing}
              />
              <Button 
                onClick={handleTextParse}
                disabled={!scheduleText.trim() || isProcessing}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Parse Schedule with AI
                  </>
                )}
              </Button>
            </div>

            {/* Results Preview */}
            {results && results.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Found {results.length} Events
                  </Label>
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-4 bg-gray-50">
                  {results.map((event, idx) => (
                    <div key={idx} className="p-3 bg-white rounded border">
                      <div className="font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        📅 {event.start_date}
                        {event.start_time && ` • ⏰ ${event.start_time}`}
                        {event.end_time && ` - ${event.end_time}`}
                        {event.location && ` • 📍 ${event.location}`}
                        {event.recurring && event.recurring !== 'none' && ` • 🔄 ${event.recurring}`}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleImportEvents}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5 mr-2" />
                      Import {results.length} Events to Calendar
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Tips for best results:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>Include dates, times, and locations when available</li>
                    <li>Mention if events repeat (e.g., "every Monday")</li>
                    <li>Use clear formatting with line breaks between events</li>
                    <li>For images, ensure text is clear and readable</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}