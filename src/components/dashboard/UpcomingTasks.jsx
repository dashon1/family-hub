import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Calendar, AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isPast } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function UpcomingTasks({ tasks, isLoading }) {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800"
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

  const displayTasks = tasks.slice(0, 5);

  return (
    <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Upcoming Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No pending tasks</p>
            <Link to={createPageUrl("FamilyTasks")}>
              <button className="text-orange-600 hover:text-orange-700 text-sm mt-2">
                Create a Task →
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {displayTasks.map(task => {
              const taskDate = new Date(task.due_date);
              const isOverdue = isPast(taskDate) && !isToday(taskDate);
              const isDueToday = isToday(taskDate);

              return (
                <div key={task.id} className={`p-4 bg-white rounded-lg border hover:shadow-md transition-shadow ${isOverdue ? 'ring-2 ring-red-200' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      {task.title}
                      {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </h4>
                    <Badge className={priorityColors[task.priority]}>
                      {task.priority}
                    </Badge>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${isOverdue ? 'text-red-600' : isDueToday ? 'text-orange-600' : 'text-gray-600'}`}>
                    <Calendar className="w-4 h-4" />
                    {isDueToday ? 'Due Today' : isOverdue ? `Overdue (${format(taskDate, 'MMM d')})` : `Due ${format(taskDate, 'MMM d')}`}
                  </div>
                </div>
              );
            })}
            {tasks.length > 5 && (
              <p className="text-sm text-gray-500 text-center">
                +{tasks.length - 5} more tasks
              </p>
            )}
            <Link to={createPageUrl("FamilyTasks")}>
              <button className="w-full py-2 text-center text-orange-600 hover:text-orange-700 text-sm font-medium">
                View All Tasks →
              </button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}