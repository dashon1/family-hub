
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  Search, 
  Calendar, 
  CheckSquare, 
  ShoppingCart, 
  Users, 
  Home,
  Mic,
  Eye,
  FileText,
  Camera,
  UtensilsCrossed,
  BookOpen,
  Video,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AIChatbot from '../components/help/AIChatbot';
import UserGuideRenderer from '../components/help/UserGuideContent';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState('quickStart');
  const [showVideos, setShowVideos] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const categories = [
    {
      title: "Getting Started",
      icon: <Home className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-600",
      faqs: [
        {
          question: "How do I create my first household?",
          answer: "Navigate to 'Household Management' from the sidebar. Click 'Create New Household', enter a name (like 'Smith Family'), and you're done! You'll get an invite code to share with family members."
        },
        {
          question: "How do I invite family members?",
          answer: "In Household Management, find your household card and copy the invite code. Share this code with family members. They can click 'Join a Household' and enter the code to join your family hub."
        },
        {
          question: "Can I belong to multiple households?",
          answer: "Yes! You can create or join multiple households (perfect for divorced parents, extended family, etc.). Switch between them using the 'Switch to This' button on each household card."
        },
        {
          question: "What's the difference between households?",
          answer: "Each household has its own calendar, tasks, grocery lists, and notes. When you create an item, you can choose whether to share it across all your households, keep it private, or limit it to one household."
        }
      ]
    },
    {
      title: "Calendar & Events",
      icon: <Calendar className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600",
      faqs: [
        {
          question: "How do I create an event?",
          answer: "Click the 'Add Event' button on the calendar page. Fill in the title, date, time, and other details. You can use the microphone icon for voice input! Choose visibility settings to control who sees the event."
        },
        {
          question: "Can I create recurring events?",
          answer: "Yes! When creating an event, select from options like Daily, Weekly, Biweekly, or Monthly. You can also set an end date for recurring events."
        },
        {
          question: "What do the event visibility options mean?",
          answer: "'My Household Only' = only your current household sees it. 'All My Households' = visible across all households you belong to. 'Private' = only you can see it."
        },
        {
          question: "How do I see who's available for an event?",
          answer: "When viewing the calendar, you can see all events for the day by clicking on a date. Events from different family members are color-coded based on their display color (set in Settings)."
        }
      ]
    },
    {
      title: "Tasks & To-Dos",
      icon: <CheckSquare className="w-5 h-5" />,
      color: "bg-green-100 text-green-600",
      faqs: [
        {
          question: "How do I assign a task to someone?",
          answer: "When creating a task, you'll see an 'Assigned To' field. Enter the family member's email address. They'll see it in their task list."
        },
        {
          question: "What do priority levels mean?",
          answer: "Low = can wait. Medium = normal priority. High = important, do soon. Urgent = needs immediate attention. Tasks are color-coded on the dashboard for quick identification."
        },
        {
          question: "Can I create recurring tasks?",
          answer: "Absolutely! Daily tasks (like 'make bed'), weekly tasks (like 'take out trash'), or monthly tasks (like 'pay bills') can all be set to repeat automatically."
        },
        {
          question: "How do I filter my tasks?",
          answer: "Use the filter buttons at the top of the Tasks page to view All, Pending, In Progress, or Completed tasks. You can also filter by category."
        }
      ]
    },
    {
      title: "Grocery Lists",
      icon: <ShoppingCart className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-600",
      faqs: [
        {
          question: "How do I quickly add items?",
          answer: "Use the Quick Add box on the Grocery Lists page! Type or use voice input (click the microphone icon) and hit Add. It's that simple!"
        },
        {
          question: "Can I organize items by aisle or category?",
          answer: "Yes! Items are automatically grouped by category (Produce, Dairy, Meat, etc.). Use the category filter to view specific sections when shopping."
        },
        {
          question: "How do I check off items as I shop?",
          answer: "Click the checkbox next to any item to mark it as purchased. Completed items move to the bottom of the list and are shown with a strikethrough."
        },
        {
          question: "Can I clear all completed items at once?",
          answer: "Yes! When you have completed items, a 'Clear Completed' button appears at the top. This removes all checked items in one click."
        }
      ]
    },
    {
      title: "Meal Planning",
      icon: <UtensilsCrossed className="w-5 h-5" />,
      color: "bg-pink-100 text-pink-600",
      faqs: [
        {
          question: "How do I plan meals for the week?",
          answer: "Go to Meal Planner to see a weekly grid. Click 'Add Meal' or click directly on a day/meal slot to add breakfast, lunch, dinner, or snacks. You can add recipe links and ingredients too!"
        },
        {
          question: "Can I add ingredients to my grocery list?",
          answer: "Yes! When viewing a meal, click the shopping cart icon to automatically add all ingredients to your grocery list. Super convenient for meal prep!"
        },
        {
          question: "How do I save favorite recipes?",
          answer: "When adding a meal, paste the recipe URL in the 'Recipe Link' field. Click on it later to open the recipe while cooking!"
        }
      ]
    },
    {
      title: "Voice Input",
      icon: <Mic className="w-5 h-5" />,
      color: "bg-red-100 text-red-600",
      faqs: [
        {
          question: "How do I use voice input?",
          answer: "Look for the microphone icon next to text fields throughout the app. Click it, speak your text, and it will automatically fill in. Perfect for hands-free operation!"
        },
        {
          question: "What can I use voice input for?",
          answer: "You can use voice input for: grocery items, event titles and descriptions, task titles and descriptions, note content, meal names and ingredients, and more!"
        },
        {
          question: "Why isn't voice input working?",
          answer: "Voice input requires microphone permissions. Check your browser settings to ensure FamilyHub has access to your microphone. It works best in Chrome, Edge, and Safari."
        },
        {
          question: "Can voice input understand different languages?",
          answer: "Currently, voice input is optimized for English. We're working on adding more language support in future updates!"
        }
      ]
    },
    {
      title: "Privacy & Sharing",
      icon: <Eye className="w-5 h-5" />,
      color: "bg-indigo-100 text-indigo-600",
      faqs: [
        {
          question: "Who can see my data?",
          answer: "Only members of your household(s) can see your data based on visibility settings. Private items are only visible to you. Household items are visible to that household only."
        },
        {
          question: "Can I make some events private?",
          answer: "Yes! When creating any event, task, or note, you can set visibility to 'Private (Just Me)' so only you can see it."
        },
        {
          question: "How do I remove someone from my household?",
          answer: "As the household admin, go to Household Management, find the household, and you can manage members. Non-admin members can leave households they're part of."
        }
      ]
    }
  ];

  const userGuideOptions = [
    { key: 'quickStart', title: 'Quick Start Guide', icon: Home, description: 'Get up and running in minutes' },
    { key: 'calendar', title: 'Calendar Management', icon: Calendar, description: 'Master event scheduling' },
    { key: 'tasks', title: 'Task Organization', icon: CheckSquare, description: 'Organize family tasks' },
    { key: 'shopping', title: 'Shopping & Meal Planning', icon: ShoppingCart, description: 'Grocery lists and meals' },
    { key: 'advanced', title: 'Advanced Features', icon: Eye, description: 'Power user tips' },
  ];

  const videoTutorials = [
    {
      title: "Getting Started with FamilyHub",
      duration: "5:32",
      thumbnail: "🏠",
      description: "Learn the basics of setting up your family hub",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Example URL
    },
    {
      title: "Managing Your Calendar",
      duration: "4:15",
      description: "Master family event scheduling",
      thumbnail: "📅",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Example URL
    },
    {
      title: "Task Management Tips",
      duration: "3:45",
      description: "Organize family tasks efficiently",
      thumbnail: "✅",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Example URL
    },
    {
      title: "Grocery List Hacks",
      duration: "2:50",
      description: "Shop smarter with voice input",
      thumbnail: "🛒",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Example URL
    },
    {
      title: "Meal Planning Made Easy",
      duration: "6:20",
      description: "Plan your weekly meals like a pro",
      thumbnail: "🍽️",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Example URL
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Help Center
          </h1>
          <p className="text-gray-600">Find answers to common questions and learn how to use FamilyHub</p>
        </div>

        {/* Search */}
        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card 
            className="shadow-lg border-0 bg-gradient-to-br from-orange-100 to-pink-100 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => {
              setSelectedGuide('quickStart');
              setShowUserGuide(true);
            }}
          >
            <CardContent className="p-6 text-center">
              <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">User Guide</h3>
              <p className="text-sm text-gray-600">Comprehensive documentation</p>
            </CardContent>
          </Card>

          <Card 
            className="shadow-lg border-0 bg-gradient-to-br from-blue-100 to-purple-100 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setShowVideos(true)}
          >
            <CardContent className="p-6 text-center">
              <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Video Tutorials</h3>
              <p className="text-sm text-gray-600">Watch step-by-step guides</p>
            </CardContent>
          </Card>

          <Card 
            className="shadow-lg border-0 bg-gradient-to-br from-green-100 to-teal-100 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setShowChatbot(true)}
          >
            <CardContent className="p-6 text-center">
              <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Contact Support</h3>
              <p className="text-sm text-gray-600">Get personalized help</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-4">
          {filteredCategories.length === 0 ? (
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No results found for "{searchQuery}"</p>
                <p className="text-sm text-gray-500 mt-2">Try a different search term</p>
              </CardContent>
            </Card>
          ) : (
            filteredCategories.map((category, idx) => (
              <Card key={idx} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      {category.icon}
                    </div>
                    {category.title}
                    <Badge variant="outline" className="ml-auto">
                      {category.faqs.length} articles
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, faqIdx) => (
                      <AccordionItem key={faqIdx} value={`item-${idx}-${faqIdx}`}>
                        <AccordionTrigger className="text-left hover:text-orange-600">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-700">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Need More Help */}
        <Card className="shadow-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-pink-50">
          <CardContent className="p-8 text-center">
            <HelpCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Still Need Help?</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our AI assistant is here to help!
            </p>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              onClick={() => setShowChatbot(true)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with AI Assistant
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* User Guide Dialog */}
      <Dialog open={showUserGuide} onOpenChange={setShowUserGuide}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-orange-600" />
              FamilyHub User Guide
            </DialogTitle>
            <DialogDescription>
              Complete documentation for all features
            </DialogDescription>
          </DialogHeader>
          
          {/* Guide Selector */}
          <div className="flex gap-2 py-3 border-b overflow-x-auto px-6 -mx-6"> {/* Added horizontal padding offset */}
            {userGuideOptions.map((guide) => (
              <Button
                key={guide.key}
                variant={selectedGuide === guide.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedGuide(guide.key)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  selectedGuide === guide.key 
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' 
                    : ''
                }`}
              >
                <guide.icon className="w-4 h-4" />
                {guide.title}
              </Button>
            ))}
          </div>

          {/* Guide Content */}
          <div className="flex-1 overflow-auto p-6 -mx-6"> {/* Added padding offset */}
            <UserGuideRenderer guide={selectedGuide} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Tutorials Dialog */}
      <Dialog open={showVideos} onOpenChange={setShowVideos}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Video className="w-6 h-6 text-blue-600" />
              Video Tutorials
            </DialogTitle>
            <DialogDescription>
              Step-by-step video guides for all features
            </DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {videoTutorials.map((video, idx) => (
              <Card key={idx} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="text-6xl text-center mb-3">{video.thumbnail}</div>
                  <h3 className="font-semibold mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{video.duration}</Badge>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={video.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Watch
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Chatbot */}
      {showChatbot && (
        <AIChatbot onClose={() => setShowChatbot(false)} />
      )}
    </div>
  );
}
