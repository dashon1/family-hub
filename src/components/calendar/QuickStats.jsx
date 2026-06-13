import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users, Zap } from "lucide-react";
import { isToday, isThisWeek, isThisMonth, parseISO } from "date-fns";

export default function QuickStats({ events }) {
  const todayEvents = events.filter(event => isToday(parseISO(event.start_date)));
  const weekEvents = events.filter(event => isThisWeek(parseISO(event.start_date)));
  const monthEvents = events.filter(event => isThisMonth(parseISO(event.start_date)));
  const upcomingEvents = events.filter(event => new Date(event.start_date) > new Date());

  const stats = [
    {
      title: "Today",
      value: todayEvents.length,
      icon: Calendar,
      color: "from-orange-500 to-pink-500"
    },
    {
      title: "This Week",
      value: weekEvents.length,
      icon: Clock,
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "This Month",
      value: monthEvents.length,
      icon: Users,
      color: "from-green-500 to-teal-500"
    },
    {
      title: "Upcoming",
      value: upcomingEvents.length,
      icon: Zap,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-full transform translate-x-6 -translate-y-6`} />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                <stat.icon className={`w-5 h-5 text-white`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}