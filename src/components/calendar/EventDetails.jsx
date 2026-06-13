
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Edit, Calendar, Clock, MapPin, User, Repeat, Trash2, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EventInvite } from '@/api/entities';
import InviteManager from './InviteManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EventDetails({ event, onEdit, onClose, onDelete }) {
  const [showInvites, setShowInvites] = useState(false); // This state isn't directly used to control visibility anymore due to Tabs, but is part of the outline.
  const [inviteCount, setInviteCount] = useState(0);

  useEffect(() => {
    loadInviteCount();
  }, [event]); // Depend on 'event' to reload count if the event object changes.

  const loadInviteCount = async () => {
    try {
      // Assuming EventInvite.list() fetches all invites for the current user/context
      // and we then filter them by event_id. Adjust if your API provides a direct way
      // to get invites for a specific event.
      const allInvites = await EventInvite.list();
      const eventInvites = allInvites.filter(inv => inv.event_id === event.id);
      setInviteCount(eventInvites.length);
    } catch (error) {
      console.error('Error loading invites:', error);
      // Optionally set inviteCount to 0 or handle error display
      setInviteCount(0);
    }
  };

  const categoryColors = {
    work: "bg-blue-100 text-blue-800 border-blue-200",
    school: "bg-green-100 text-green-800 border-green-200",
    activity: "bg-purple-100 text-purple-800 border-purple-200",
    appointment: "bg-red-100 text-red-800 border-red-200",
    family: "bg-orange-100 text-orange-800 border-orange-200",
    personal: "bg-pink-100 text-pink-800 border-pink-200"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto" // Added overflow-y-auto
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl my-8" // Changed max-w-lg to max-w-3xl and added my-8
      >
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className={categoryColors[event.category]}>
                  {event.category}
                </Badge>
                {event.recurring !== 'none' && (
                  <Badge variant="outline">
                    <Repeat className="w-3 h-3 mr-1" />
                    {event.recurring}
                  </Badge>
                )}
                {inviteCount > 0 && ( // New badge for invite count
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {inviteCount} invited
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(event)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-red-100 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the event "{event.title}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(event.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Event
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardTitle className="text-2xl pt-2">{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Event Details</TabsTrigger>
                <TabsTrigger value="invites">
                  Invites {inviteCount > 0 && `(${inviteCount})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(parseISO(event.start_date), "EEEE, MMMM d, yyyy")}
                    {event.end_date && event.end_date !== event.start_date && (
                      <> - {format(parseISO(event.end_date), "MMMM d, yyyy")}</>
                    )}
                  </span>
                </div>

                {!event.all_day && (event.start_time || event.end_time) && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {event.start_time}
                      {event.end_time && ` - ${event.end_time}`}
                      {event.all_day && "All day"}
                    </span>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}

                {event.assigned_to && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{event.assigned_to}</span>
                  </div>
                )}

                {event.description && (
                  <div className="pt-4 border-t">
                    <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="invites" className="mt-4">
                {/* InviteManager component to manage invites for this event */}
                <InviteManager event={event} onUpdate={loadInviteCount} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
