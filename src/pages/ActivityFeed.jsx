import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Calendar, CheckSquare, FileText, DollarSign, Camera, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadActivities = async () => {
    const data = await base44.entities.Activity.list('-created_date', 50);
    setActivities(data);
  };

  const getIcon = (entityType) => {
    const icons = {
      event: Calendar,
      task: CheckSquare,
      note: FileText,
      expense: DollarSign,
      photo: Camera,
      grocery: ShoppingCart,
      meal: UtensilsCrossed
    };
    return icons[entityType] || Activity;
  };

  const getActionText = (action) => {
    const actions = {
      created: 'created',
      updated: 'updated',
      deleted: 'deleted',
      completed: 'completed',
      commented: 'commented on',
      invited: 'invited to',
      joined: 'joined'
    };
    return actions[action] || action;
  };

  const getColorClass = (entityType) => {
    const colors = {
      event: 'from-blue-500 to-blue-600',
      task: 'from-green-500 to-green-600',
      note: 'from-purple-500 to-purple-600',
      expense: 'from-pink-500 to-pink-600',
      photo: 'from-orange-500 to-orange-600',
      grocery: 'from-teal-500 to-teal-600',
      meal: 'from-red-500 to-red-600'
    };
    return colors[entityType] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Activity Feed
          </h1>
          <p className="text-gray-600 mt-2">See what's happening in your household</p>
        </div>

        <div className="space-y-4">
          {activities.length === 0 ? (
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent activity</p>
              </CardContent>
            </Card>
          ) : (
            activities.map((activity, index) => {
              const Icon = getIcon(activity.entity_type);
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getColorClass(activity.entity_type)} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900">
                            <span className="font-semibold">{activity.user_name || activity.user_email}</span>
                            {' '}{getActionText(activity.action_type)}{' '}
                            <span className="font-medium">{activity.entity_title}</span>
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(new Date(activity.created_date), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}