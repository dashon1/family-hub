
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Calendar, Clock, MapPin, User, Tag, Eye, Users, Check } from "lucide-react"; // Added Check import
import VoiceInput from "../shared/VoiceInput";

export default function EventForm({ event, onSubmit, onCancel, user, selectedDate }) {
  const [formData, setFormData] = useState(() => {
    const initialState = event || {
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      category: "personal",
      location: "",
      assigned_to: user?.email || "",
      all_day: false,
      recurring: "none",
      visibility: "household",
      shared_with_emails: [], // Added shared_with_emails
      household_id: user?.household_id || "",
      enable_invites: false
    };

    // Ensure shared_with_emails is an array if it's undefined for existing events
    if (event && !initialState.shared_with_emails) {
      initialState.shared_with_emails = [];
    }

    return initialState;
  });

  const [connections, setConnections] = useState([]);
  const [showPeopleSelector, setShowPeopleSelector] = useState(
    (event && event.visibility === 'selected_people') || false
  );

  useEffect(() => {
    if (!event && selectedDate) {
      setFormData(prev => ({
        ...prev,
        start_date: selectedDate,
        household_id: user?.household_id || ""
      }));
    }

    // Load connections for "Selected People" option
    if (user) { // Only load connections if user data is available
      loadConnections();
    }
  }, [event, selectedDate, user]);

  const loadConnections = async () => {
    try {
      const { Connection } = await import('@/api/entities');
      // Ensure user is defined before accessing user.email
      if (user && user.email) {
        const allConnections = await Connection.list();
        const myConnections = allConnections.filter(
          conn => (conn.user_email === user.email || conn.connected_email === user.email) &&
                  conn.can_see_calendar
        );
        setConnections(myConnections);
      }
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Show people selector when "Selected People" is chosen
    if (field === 'visibility') {
      if (value === 'selected_people') {
        setShowPeopleSelector(true);
      } else {
        setShowPeopleSelector(false);
        // Clear shared_with_emails if visibility changes from 'selected_people'
        if (formData.visibility === 'selected_people' && value !== 'selected_people') {
          setFormData(prev => ({ ...prev, shared_with_emails: [] }));
        }
      }
    }
  };

  const togglePersonSelection = (email) => {
    setFormData(prev => ({
      ...prev,
      shared_with_emails: prev.shared_with_emails.includes(email)
        ? prev.shared_with_emails.filter(e => e !== email)
        : [...prev.shared_with_emails, email]
    }));
  };

  const getConnectionEmail = (conn) => {
    return conn.user_email === user?.email ? conn.connected_email : conn.user_email;
  };

  // Voice input handlers are updated to expect the VoiceInput component to handle appending
  // and pass back the full, potentially appended, text.
  const handleVoiceInput = (newText) => {
    setFormData(prev => ({ ...prev, title: newText }));
  };

  const handleDescriptionVoice = (newText) => {
    setFormData(prev => ({ ...prev, description: newText }));
  };

  const handleLocationVoice = (newText) => {
    setFormData(prev => ({ ...prev, location: newText }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl my-8"
      >
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {event ? 'Edit Event' : 'New Event'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Event Title
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="title"
                      placeholder="What's happening?"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="text-lg flex-1"
                      required
                    />
                    <VoiceInput 
                      onTranscript={handleVoiceInput} 
                      currentText={formData.title}
                      buttonSize="icon" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleChange('start_date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleChange('end_date', e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2 md:col-span-2">
                  <Checkbox
                    id="all_day"
                    checked={formData.all_day}
                    onCheckedChange={(checked) => handleChange('all_day', checked)}
                  />
                  <Label htmlFor="all_day">All day event</Label>
                </div>

                {!formData.all_day && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="start_time" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Start Time
                      </Label>
                      <Input
                        id="start_time"
                        type="time"
                        value={formData.start_time}
                        onChange={(e) => handleChange('start_time', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_time">End Time</Label>
                      <Input
                        id="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={(e) => handleChange('end_time', e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="activity">Activity</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recurring">Repeat</Label>
                  <Select
                    value={formData.recurring}
                    onValueChange={(value) => handleChange('recurring', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Don't repeat</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibility" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Who Can See This
                  </Label>
                  <Select
                    value={formData.visibility}
                    onValueChange={(value) => handleChange('visibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="household">My Household Only</SelectItem>
                      <SelectItem value="shared">All My Households</SelectItem>
                      <SelectItem value="selected_people">Selected People</SelectItem> {/* New option */}
                      <SelectItem value="private">Private (Just Me)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {formData.visibility === 'household' && 'Only members of your current household can see this'}
                    {formData.visibility === 'shared' && 'Visible across all households you belong to'}
                    {formData.visibility === 'selected_people' && 'Choose specific people who can see this'} {/* New description */}
                    {formData.visibility === 'private' && 'Only you can see this event'}
                  </p>
                </div>

                {showPeopleSelector && connections.length > 0 && (
                  <div className="space-y-2 md:col-span-2">
                    <Label>Select People to Share With</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 border rounded-lg bg-gray-50">
                      {connections.map(conn => {
                        const email = getConnectionEmail(conn);
                        const isSelected = formData.shared_with_emails.includes(email);
                        return (
                          <button
                            key={conn.id}
                            type="button"
                            onClick={() => togglePersonSelection(email)}
                            className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                              isSelected
                                ? 'bg-orange-100 border-orange-300'
                                : 'bg-white border-gray-200 hover:border-orange-200'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm truncate">{conn.nickname || email}</span>
                          </button>
                        );
                      })}
                    </div>
                    {formData.shared_with_emails.length > 0 && (
                      <p className="text-xs text-green-600">
                        ✓ Shared with {formData.shared_with_emails.length} {formData.shared_with_emails.length === 1 ? 'person' : 'people'}
                      </p>
                    )}
                  </div>
                )}

                {showPeopleSelector && connections.length === 0 && (
                  <div className="md:col-span-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      You don't have any connections with calendar sharing enabled yet. Go to "My Connections" to add people you want to share with.
                    </p>
                  </div>
                )}

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="Where is this happening?"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="flex-1"
                    />
                    <VoiceInput 
                      onTranscript={handleLocationVoice} 
                      currentText={formData.location}
                      buttonSize="icon" 
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <div className="space-y-2">
                    <Textarea
                      id="description"
                      placeholder="Add any additional details..."
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={3}
                    />
                    <VoiceInput 
                      onTranscript={handleDescriptionVoice} 
                      currentText={formData.description}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <Checkbox
                  id="enable_invites"
                  checked={formData.enable_invites}
                  onCheckedChange={(checked) => handleChange('enable_invites', checked)}
                />
                <Label htmlFor="enable_invites" className="flex items-center gap-2 cursor-pointer">
                  <Users className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Enable Invites & RSVPs</p>
                    <p className="text-xs text-blue-700">Allow others to RSVP to this event</p>
                  </div>
                </Label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                  {event ? 'Update Event' : 'Create Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
