
import React, { useState, useEffect } from 'react';
import { CalendarEvent, TodoItem, GroceryItem, User } from '@/api/entities';
import { isToday, isPast, isFuture, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, AlertCircle, HelpCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import VoiceInput from '../components/shared/VoiceInput';
import AIChatbot from '../components/help/AIChatbot';
import { motion } from 'framer-motion';

import TodaysEvents from '../components/dashboard/TodaysEvents';
import UpcomingTasks from '../components/dashboard/UpcomingTasks';
import QuickGroceryList from '../components/dashboard/QuickGroceryList';
import WelcomeModal from '../components/tutorial/WelcomeModal';
import TutorialOverlay from '../components/tutorial/TutorialOverlay';
import HelpTooltip from '../components/tutorial/HelpTooltip';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [groceryItems, setGroceryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [quickAddText, setQuickAddText] = useState('');
  const [quickAddType, setQuickAddType] = useState('grocery');
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        // Show welcome modal for new users
        if (!currentUser.tutorial_completed) {
          setShowWelcome(true);
        }

        if (!currentUser.household_id) {
          setIsLoading(false);
          return;
        }

        const [events, tasks, groceries] = await Promise.all([
          CalendarEvent.list(),
          TodoItem.list(),
          GroceryItem.list(),
        ]);

        const householdEvents = events.filter(e => 
          !e.household_id || e.household_id === currentUser.household_id
        );
        setTodaysEvents(householdEvents.filter(e => e.start_date && isToday(parseISO(e.start_date))));

        const householdTasks = tasks.filter(t =>
          !t.household_id || t.household_id === currentUser.household_id
        );
        setUpcomingTasks(householdTasks.filter(t =>
          t.status !== 'completed' && t.due_date &&
          (isToday(parseISO(t.due_date)) || isFuture(parseISO(t.due_date)) || isPast(parseISO(t.due_date)))
        ).sort((a, b) => new Date(a.due_date) - new Date(b.due_date)));

        const householdGroceries = groceries.filter(g =>
          !g.household_id || g.household_id === currentUser.household_id
        );
        setGroceryItems(householdGroceries.filter(g => !g.completed));

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleStartTutorial = () => {
    setShowWelcome(false);
    setShowTutorial(true);
  };

  const handleSkipTutorial = async () => {
    setShowWelcome(false);
    if (user) {
      await User.updateMyUserData({ tutorial_completed: true });
    }
  };

  const handleCompleteTutorial = async () => {
    setShowTutorial(false);
    if (user) {
      await User.updateMyUserData({ tutorial_completed: true });
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickAddText.trim()) return;

    try {
      if (quickAddType === 'grocery') {
        await GroceryItem.create({
          name: quickAddText,
          added_by: user?.email,
          household_id: user?.household_id
        });
      } else if (quickAddType === 'task') {
        await TodoItem.create({
          title: quickAddText,
          household_id: user?.household_id,
          due_date: new Date().toISOString().split('T')[0]
        });
      }
      setQuickAddText('');
      // Refresh data
      const fetchData = async () => {
        const [tasks, groceries] = await Promise.all([
          TodoItem.list(),
          GroceryItem.list(),
        ]);
        const householdTasks = tasks.filter(t => !t.household_id || t.household_id === user.household_id);
        setUpcomingTasks(householdTasks.filter(t => t.status !== 'completed').sort((a, b) => new Date(a.due_date) - new Date(b.due_date)));
        const householdGroceries = groceries.filter(g => !g.household_id || g.household_id === user.household_id);
        setGroceryItems(householdGroceries.filter(g => !g.completed));
      };
      fetchData();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleVoiceInput = (newText) => {
    setQuickAddText((prevText) => (prevText ? prevText + ' ' : '') + newText);
  };

  const dashboardTutorialSteps = [
    {
      title: "Welcome to Your Dashboard",
      description: "This is your command center! Here you'll see today's events, upcoming tasks, and your grocery list at a glance.",
      tips: "The dashboard updates in real-time as you and your family add items throughout the day.",
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      title: "Today's Schedule",
      description: "See all events happening today. Click 'View All Events' to open the full calendar where you can add, edit, or manage events.",
      target: "[data-tutorial='todays-events']",
      tips: "Events are color-coded by category to help you quickly identify different types of activities.",
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      title: "Tasks & To-Dos",
      description: "Keep track of pending tasks with due dates. Overdue tasks are highlighted in red so nothing slips through the cracks.",
      target: "[data-tutorial='upcoming-tasks']",
      tips: "Assign tasks to family members and set priorities to stay organized!",
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      title: "Grocery List Preview",
      description: "Your active grocery items appear here. Check off items as you shop or add new ones quickly.",
      target: "[data-tutorial='grocery-list']",
      tips: "Use the microphone icon throughout the app to add items by voice - super handy while cooking!",
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ];

  if (!user?.household_id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Welcome to FamilyHub!</h2>
              <p className="text-gray-600 mb-6">
                To get started, you need to create or join a household first.
              </p>
              <Link to={createPageUrl("HouseholdManagement")}>
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  Set Up Household
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Family'}!
              <HelpTooltip
                title="Dashboard Overview"
                content="Your dashboard shows a quick summary of today's activities. Use the sidebar to navigate to detailed views of your calendar, tasks, grocery lists, and more."
              />
            </h1>
            <p className="text-gray-600 mt-2">Here's what's happening in your family's world today.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Show Tutorial
          </Button>
        </div>

        {/* Quick Add Widget */}
        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              ⚡ Quick Add
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleQuickAdd} className="space-y-3">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={quickAddType === 'grocery' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setQuickAddType('grocery')}
                  className={quickAddType === 'grocery' ? 'bg-gradient-to-r from-orange-500 to-pink-500' : ''}
                >
                  🛒 Grocery
                </Button>
                <Button
                  type="button"
                  variant={quickAddType === 'task' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setQuickAddType('task')}
                  className={quickAddType === 'task' ? 'bg-gradient-to-r from-orange-500 to-pink-500' : ''}
                >
                  ✅ Task
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={quickAddType === 'grocery' ? 'Add grocery item...' : 'Add task...'}
                  value={quickAddText}
                  onChange={(e) => setQuickAddText(e.target.value)}
                  className="flex-1"
                />
                <VoiceInput 
                  onTranscript={handleVoiceInput} 
                  currentText={quickAddText}
                  buttonSize="icon" 
                />
                <Button type="submit" disabled={!quickAddText.trim()}>
                  Add
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div data-tutorial="todays-events">
              <TodaysEvents events={todaysEvents} isLoading={isLoading} />
            </div>
            <div data-tutorial="upcoming-tasks">
              <UpcomingTasks tasks={upcomingTasks} isLoading={isLoading} />
            </div>
          </div>
          <div className="lg:col-span-1" data-tutorial="grocery-list">
            <QuickGroceryList items={groceryItems} isLoading={isLoading} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-6">
            <Link to={createPageUrl("FamilyCalendar")} className="block group">
                <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all border border-transparent hover:border-orange-200 h-full">
                    <h3 className="font-bold text-xl text-gray-800">View Full Calendar</h3>
                    <p className="text-gray-600 mt-1">See the big picture for the week and month.</p>
                    <div className="mt-4 font-semibold text-orange-600 flex items-center gap-2">
                        Go to Calendar <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>
             <Link to={createPageUrl("FamilyTasks")} className="block group">
                <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all border border-transparent hover:border-orange-200 h-full">
                    <h3 className="font-bold text-xl text-gray-800">Manage All Tasks</h3>
                    <p className="text-gray-600 mt-1">Organize, assign, and track all family to-dos.</p>
                    <div className="mt-4 font-semibold text-orange-600 flex items-center gap-2">
                        Go to Tasks <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>
        </div>
      </div>

      {/* Floating Chatbot Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all z-50"
        title="Ask AI Assistant"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {showWelcome && (
        <WelcomeModal
          onStartTutorial={handleStartTutorial}
          onSkip={handleSkipTutorial}
        />
      )}

      {showTutorial && (
        <TutorialOverlay
          steps={dashboardTutorialSteps}
          onComplete={handleCompleteTutorial}
          onSkip={handleCompleteTutorial}
        />
      )}

      {showChatbot && (
        <AIChatbot onClose={() => setShowChatbot(false)} />
      )}
    </div>
  );
}
