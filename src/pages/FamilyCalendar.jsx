
import React, { useState, useEffect } from "react";
import { CalendarEvent, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar as CalendarIcon, Clock, MapPin, Sparkles } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import EventForm from "../components/calendar/EventForm";
import EventDetails from "../components/calendar/EventDetails";
import QuickStats from "../components/calendar/QuickStats";
import ScheduleImporter from "../components/calendar/ScheduleImporter";

export default function FamilyCalendar() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [showScheduleImporter, setShowScheduleImporter] = useState(false);

  useEffect(() => {
    loadUserAndEvents();
  }, []);

  const loadUserAndEvents = async () => {
    const currentUser = await loadUser();
    if (currentUser) {
      await loadEvents(currentUser);
    }
  };

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
      return null;
    }
  };

  const loadEvents = async (currentUser) => {
    if (!currentUser) {
      console.warn("Cannot load events: current user not available.");
      setEvents([]);
      return;
    }

    const fetchedEvents = await CalendarEvent.list("-start_date");
    
    const visibleEvents = fetchedEvents.filter(event => {
      if (!event.household_id || event.household_id === currentUser.household_id) {
        return true;
      }
      if (event.visibility === 'shared') {
        return true;
      }
      if (event.visibility === 'private' && event.created_by === currentUser.email) {
        return true;
      }
      return false;
    });
    
    setEvents(visibleEvents);
  };

  const handleEventSubmit = async (eventData) => {
    if (editingEvent) {
      await CalendarEvent.update(editingEvent.id, eventData);
    } else {
      await CalendarEvent.create(eventData);
    }
    setShowEventForm(false);
    setEditingEvent(null);
    await loadUserAndEvents();
  };

  const handleEventEdit = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async (eventId) => {
    await CalendarEvent.delete(eventId);
    setSelectedEvent(null);
    await loadUserAndEvents();
  };

  const categoryColors = {
    work: "bg-blue-100 text-blue-800 border-blue-200",
    school: "bg-green-100 text-green-800 border-green-200",
    activity: "bg-purple-100 text-purple-800 border-purple-200",
    appointment: "bg-red-100 text-red-800 border-red-200",
    family: "bg-orange-100 text-orange-800 border-orange-200",
    personal: "bg-pink-100 text-pink-800 border-pink-200"
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date) => {
    return events.filter(event => event.start_date && isSameDay(parseISO(event.start_date), date));
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Family Calendar
            </h1>
            <p className="text-gray-600 mt-2">Keep everyone on the same page</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowScheduleImporter(true)}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Import Schedule
            </Button>
            <Button 
              onClick={() => setShowEventForm(true)}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        <QuickStats events={events} />

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    {format(currentDate, "MMMM yyyy")}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigateMonth(-1)}
                      className="hover:bg-orange-50"
                    >
                      ←
                    </Button>
                     <Button 
                      variant="outline" 
                      size="sm"
                      onClick={goToToday}
                      className="hover:bg-orange-50"
                    >
                      Today
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigateMonth(1)}
                      className="hover:bg-orange-50"
                    >
                      →
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {monthDays.map(date => {
                    const dayEvents = getEventsForDate(date);
                    const isCurrentMonth = isSameMonth(date, currentDate);
                    const isSelected = isSameDay(date, selectedDate);
                    const isTodayDate = isToday(date);

                    return (
                      <motion.div
                        key={date.toISOString()}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          min-h-[80px] p-2 cursor-pointer rounded-lg transition-all duration-200 border
                          ${!isCurrentMonth ? 'bg-gray-50/50 opacity-50' : 'bg-white/50'}
                          ${isSelected ? 'ring-2 ring-orange-400 bg-orange-100/70' : 'hover:bg-orange-50/70'}
                          ${isTodayDate ? 'border-orange-300' : 'border-gray-200'}
                        `}
                      >
                        <div className={`
                          text-sm font-semibold mb-1 text-center md:text-left
                          ${isTodayDate ? 'text-orange-600' : isSelected ? 'text-orange-700' : 'text-gray-800'}
                        `}>
                          {format(date, 'd')}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                              }}
                              className={`
                                text-xs px-2 py-1 rounded cursor-pointer hover:shadow-sm
                                ${categoryColors[event.category]} border
                              `}
                            >
                              {event.title}
                            </motion.div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500 px-2">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  {format(selectedDate, "MMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-10 h-10 mx-auto text-gray-400" />
                      <p className="text-gray-500 text-sm mt-2">No events for this day.</p>
                    </div>
                  ) : (
                    getEventsForDate(selectedDate).map(event => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg border bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={categoryColors[event.category]}>
                            {event.category}
                          </Badge>
                        </div>
                        <h4 className="font-medium mb-1">{event.title}</h4>
                        {event.start_time && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-3 h-3" />
                            {event.start_time}
                            {event.end_time && ` - ${event.end_time}`}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <AnimatePresence>
          {showEventForm && (
            <EventForm
              event={editingEvent}
              onSubmit={handleEventSubmit}
              onCancel={() => {
                setShowEventForm(false);
                setEditingEvent(null);
              }}
              user={user}
              selectedDate={format(selectedDate, 'yyyy-MM-dd')}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showScheduleImporter && (
            <ScheduleImporter
              onClose={() => setShowScheduleImporter(false)}
              onSuccess={() => {
                setShowScheduleImporter(false);
                loadUserAndEvents();
              }}
              user={user}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedEvent && (
            <EventDetails
              event={selectedEvent}
              onEdit={handleEventEdit}
              onDelete={handleDeleteEvent}
              onClose={() => setSelectedEvent(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
