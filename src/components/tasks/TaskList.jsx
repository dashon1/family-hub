
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, User, Clock, AlertTriangle, CheckSquare } from "lucide-react";
import { format, isAfter, isToday } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TaskList({ tasks, onEdit, onStatusChange, onDelete }) {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    urgent: "bg-red-100 text-red-800 border-red-200"
  };

  const statusColors = {
    pending: "bg-gray-100 text-gray-800 border-gray-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200"
  };

  const categoryColors = {
    household: "bg-purple-100 text-purple-800",
    personal: "bg-pink-100 text-pink-800",
    work: "bg-indigo-100 text-indigo-800",
    school: "bg-green-100 text-green-800",
    errands: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800"
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return isAfter(new Date(), new Date(dueDate)) && !isToday(new Date(dueDate));
  };

  const isDueToday = (dueDate) => {
    if (!dueDate) return false;
    return isToday(new Date(dueDate));
  };

  if (tasks.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks found</h3>
          <p className="text-gray-500">Create your first task to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="group"
          >
            <Card className={`
              shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200
              ${task.status === 'completed' ? 'opacity-75' : ''}
              ${isOverdue(task.due_date) ? 'ring-2 ring-red-200' : ''}
              ${isDueToday(task.due_date) ? 'ring-2 ring-orange-200' : ''}
            `}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className={`
                        font-semibold text-lg
                        ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}
                      `}>
                        {task.title}
                      </h3>
                      {isOverdue(task.due_date) && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority} priority
                      </Badge>
                      <Badge className={statusColors[task.status]}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={categoryColors[task.category]}>
                        {task.category}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-gray-600 mb-3">{task.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {task.due_date && (
                        <div className={`
                          flex items-center gap-1
                          ${isOverdue(task.due_date) ? 'text-red-600' : ''}
                          ${isDueToday(task.due_date) ? 'text-orange-600' : ''}
                        `}>
                          <Calendar className="w-3 h-3" />
                          Due {format(new Date(task.due_date), "MMM d, yyyy")}
                          {isDueToday(task.due_date) && (
                            <span className="font-medium">(Today)</span>
                          )}
                          {isOverdue(task.due_date) && (
                            <span className="font-medium">(Overdue)</span>
                          )}
                        </div>
                      )}
                      {task.assigned_to && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {task.assigned_to}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(task.created_date), "MMM d")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Status
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onStatusChange(task, "pending")}>
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(task, "in_progress")}>
                          Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(task, "completed")}>
                          Mark as Completed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(task)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
