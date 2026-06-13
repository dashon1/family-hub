import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function TodaysEvents({ events, isLoading }) {
  const categoryColors = {
    work: "bg-blue-100 text-blue-800",
    school: "bg-green-100 text-green-800",
    activity: "bg-purple-100 text-purple-800",
    appointment: "bg-red-100 text-red-800",
    family: "bg-orange-100 text-orange-800",
    personal: "bg-pink-100 text-pink-800"
  };

  if (isLoading) {
    return (
      <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Today's Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No events scheduled for today</p>
            <Link to={createPageUrl("FamilyCalendar")}>
              <button className="text-orange-600 hover:text-orange-700 text-sm mt-2">
                View Calendar →
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map(event => (
              <div key={event.id} className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                  <Badge className={categoryColors[event.category]}>
                    {event.category}
                  </Badge>
                </div>
                {event.start_time && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {event.start_time}
                    {event.end_time && ` - ${event.end_time}`}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                )}
              </div>
            ))}
            <Link to={createPageUrl("FamilyCalendar")}>
              <button className="w-full py-2 text-center text-orange-600 hover:text-orange-700 text-sm font-medium">
                View All Events →
              </button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}