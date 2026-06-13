import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, PlayCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TaskStats({ pendingCount, inProgressCount, completedCount }) {
  const stats = [
    {
      title: 'Pending',
      value: pendingCount,
      icon: Clock,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      title: 'In Progress',
      value: inProgressCount,
      icon: PlayCircle,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Completed',
      value: completedCount,
      icon: CheckCircle2,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total',
      value: pendingCount + inProgressCount + completedCount,
      icon: AlertCircle,
      color: 'from-orange-500 to-pink-500',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}