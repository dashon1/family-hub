
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Check,
  X,
  HelpCircle,
  Mail,
  PartyPopper,
  Users,
  MessageCircle,
  Plus
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { EventInvite } from '@/api/entities';
import { CalendarEvent, User as UserEntity } from '@/api/entities';
import { useParams, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import EventForm from '../components/calendar/EventForm';

export default function RSVP() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [invites, setInvites] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [responseData, setResponseData] = useState({
    status: '',
    message: '',
    plus_one: 0,
    dietary_restrictions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    try {
      const currentUser = await UserEntity.me();
      setUser(currentUser);

      // Load all invites for this user
      const allInvites = await EventInvite.list();
      const myInvites = allInvites.filter(inv => inv.invitee_email === currentUser.email);
      setInvites(myInvites);

      // Load corresponding events
      const allEvents = await CalendarEvent.list();
      const invitedEvents = allEvents.filter(event =>
        myInvites.some(inv => inv.event_id === event.id)
      );
      setEvents(invitedEvents);

      // If specific eventId in URL, select that invite
      if (eventId) {
        const specificInvite = myInvites.find(inv => inv.event_id === eventId);
        if (specificInvite) {
          setSelectedInvite(specificInvite);
          setResponseData({
            status: specificInvite.status || '',
            message: specificInvite.message || '',
            plus_one: specificInvite.plus_one || 0,
            dietary_restrictions: specificInvite.dietary_restrictions || ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading invites:', error);
    }
  };

  const handleResponse = async (status) => {
    if (!selectedInvite) return;

    setIsSubmitting(true);
    try {
      await EventInvite.update(selectedInvite.id, {
        ...selectedInvite,
        status: status,
        message: responseData.message,
        plus_one: responseData.plus_one,
        dietary_restrictions: responseData.dietary_restrictions,
        responded_at: new Date().toISOString()
      });

      alert(`Response sent! You've ${status === 'accepted' ? 'accepted' : status === 'declined' ? 'declined' : 'marked as maybe for'} the invitation.`);
      setSelectedInvite(null);
      setResponseData({ status: '', message: '', plus_one: 0, dietary_restrictions: '' });
      loadData();
    } catch (error) {
      console.error('Error responding to invite:', error);
      alert('Failed to send response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await CalendarEvent.create({
        ...eventData,
        enable_invites: true,
        household_id: user?.household_id
      });
      setShowEventForm(false);
      alert('Event created! Now you can add invites from the calendar.');
      navigate(createPageUrl('FamilyCalendar'));
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const getEventForInvite = (invite) => {
    return events.find(e => e.id === invite.event_id);
  };

  const pendingInvites = invites.filter(inv => inv.status === 'pending');
  const respondedInvites = invites.filter(inv => inv.status !== 'pending');

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    accepted: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800',
    maybe: 'bg-yellow-100 text-yellow-800'
  };

  const categoryColors = {
    work: "bg-blue-100 text-blue-800 border-blue-200",
    school: "bg-green-100 text-green-800 border-green-200",
    activity: "bg-purple-100 text-purple-800 border-purple-200",
    appointment: "bg-red-100 text-red-800 border-red-200",
    family: "bg-orange-100 text-orange-800 border-orange-200",
    personal: "bg-pink-100 text-pink-800 border-pink-200"
  };

  if (selectedInvite) {
    const event = getEventForInvite(selectedInvite);
    if (!event) return <div>Loading...</div>;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedInvite(null)}
            className="mb-4"
          >
            ← Back to Invites
          </Button>

          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PartyPopper className="w-8 h-8 text-orange-600" />
                  <div>
                    <CardTitle className="text-2xl">You're Invited!</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Invited by {selectedInvite.invited_by}</p>
                  </div>
                </div>
                <Badge className={categoryColors[event.category]}>
                  {event.category}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h2>
                {event.description && (
                  <p className="text-gray-700 text-lg">{event.description}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">{format(parseISO(event.start_date), 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                </div>

                {event.start_time && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold">{event.start_time}{event.end_time && ` - ${event.end_time}`}</p>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold">{event.location}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Your Response
                </h3>

                <div className="space-y-3">
                  <div>
                    <Label>Will you attend?</Label>
                    <div className="flex gap-3 mt-2">
                      <Button
                        variant={responseData.status === 'accepted' ? 'default' : 'outline'}
                        className={`flex-1 ${responseData.status === 'accepted' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={() => setResponseData({...responseData, status: 'accepted'})}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Yes, I'll be there!
                      </Button>
                      <Button
                        variant={responseData.status === 'maybe' ? 'default' : 'outline'}
                        className={`flex-1 ${responseData.status === 'maybe' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
                        onClick={() => setResponseData({...responseData, status: 'maybe'})}
                      >
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Maybe
                      </Button>
                      <Button
                        variant={responseData.status === 'declined' ? 'default' : 'outline'}
                        className={`flex-1 ${responseData.status === 'declined' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                        onClick={() => setResponseData({...responseData, status: 'declined'})}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Can't make it
                      </Button>
                    </div>
                  </div>

                  {(responseData.status === 'accepted' || responseData.status === 'maybe') && (
                    <>
                      <div>
                        <Label>Bringing guests? (Plus ones)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={responseData.plus_one}
                          onChange={(e) => setResponseData({...responseData, plus_one: parseInt(e.target.value) || 0})}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label>Dietary restrictions or special requests</Label>
                        <Input
                          value={responseData.dietary_restrictions}
                          onChange={(e) => setResponseData({...responseData, dietary_restrictions: e.target.value})}
                          placeholder="E.g., vegetarian, allergies, etc."
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label>Message (optional)</Label>
                    <Textarea
                      value={responseData.message}
                      onChange={(e) => setResponseData({...responseData, message: e.target.value})}
                      placeholder="Add a personal note to the host..."
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={() => handleResponse(responseData.status)}
                    disabled={!responseData.status || isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    size="lg"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Response'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <PartyPopper className="w-10 h-10 text-orange-600" />
              You're Invited!
            </h1>
            <p className="text-gray-600 mt-2">Respond to event invitations from friends and family</p>
          </div>
          <Button
            onClick={() => setShowEventForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create & Send Invites
          </Button>
        </div>


        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Pending Invites ({pendingInvites.length})
            </h2>
            <div className="grid gap-4">
              {pendingInvites.map((invite) => {
                const event = getEventForInvite(invite);
                if (!event) return null;

                return (
                  <motion.div
                    key={invite.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card
                      className="shadow-lg border-2 border-orange-200 bg-white/80 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-all"
                      onClick={() => setSelectedInvite(invite)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={categoryColors[event.category]}>
                                {event.category}
                              </Badge>
                              <Badge className="bg-orange-100 text-orange-800">New!</Badge>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{event.title}</h3>
                            <p className="text-gray-600 text-sm">Invited by {invite.invited_by}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{format(parseISO(event.start_date), 'MMM d, yyyy')}</span>
                          </div>
                          {event.start_time && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{event.start_time}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm truncate">{event.location}</span>
                            </div>
                          )}
                        </div>

                        <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                          Respond to Invitation →
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Responded Invites */}
        {respondedInvites.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Your Responses ({respondedInvites.length})
            </h2>
            <div className="grid gap-4">
              {respondedInvites.map((invite) => {
                const event = getEventForInvite(invite);
                if (!event) return null;

                return (
                  <Card
                    key={invite.id}
                    className="shadow-lg border-0 bg-white/70 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-all"
                    onClick={() => setSelectedInvite(invite)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={categoryColors[event.category]}>
                              {event.category}
                            </Badge>
                            <Badge className={statusColors[invite.status]}>
                              {invite.status === 'accepted' && '✓ Going'}
                              {invite.status === 'declined' && '✗ Not Going'}
                              {invite.status === 'maybe' && '? Maybe'}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(parseISO(event.start_date), 'MMM d')}
                        </div>
                        {event.start_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.start_time}
                          </div>
                        )}
                        {invite.plus_one > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            +{invite.plus_one} guest{invite.plus_one !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* No Invites */}
        {invites.length === 0 && (
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Invitations Yet</h3>
              <p className="text-gray-600 mb-6">
                When family or friends invite you to events, they'll appear here!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => setShowEventForm(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Event & Invite Others
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(createPageUrl('FamilyCalendar'))}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Go to Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Event Creation Form */}
        <AnimatePresence>
          {showEventForm && (
            <EventForm
              onSubmit={handleCreateEvent}
              onCancel={() => setShowEventForm(false)}
              user={user}
              selectedDate={format(new Date(), 'yyyy-MM-dd')}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
