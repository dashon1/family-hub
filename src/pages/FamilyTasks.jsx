import React, { useState, useEffect } from "react";
import { TodoItem, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CheckSquare, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import TaskStats from "../components/tasks/TaskStats";

export default function FamilyTasks() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadTasks();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadTasks = async () => {
    const fetchedTasks = await TodoItem.list("-created_date");
    setTasks(fetchedTasks);
  };

  const handleTaskSubmit = async (taskData) => {
    if (editingTask) {
      await TodoItem.update(editingTask.id, taskData);
    } else {
      await TodoItem.create({
        ...taskData,
        household_id: user?.household_id
      });
    }
    setShowForm(false);
    setEditingTask(null);
    loadTasks();
  };

  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleStatusChange = async (task, newStatus) => {
    await TodoItem.update(task.id, { ...task, status: newStatus });
    loadTasks();
  };

  const deleteTask = async (taskId) => {
    await TodoItem.delete(taskId);
    loadTasks();
  };

  const filteredTasks = filterStatus === "all" 
    ? tasks 
    : tasks.filter(task => task.status === filterStatus);

  const pendingCount = tasks.filter(task => task.status === "pending").length;
  const inProgressCount = tasks.filter(task => task.status === "in_progress").length;
  const completedCount = tasks.filter(task => task.status === "completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Family Tasks
            </h1>
            <p className="text-gray-600 mt-2">Manage household and personal tasks together</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Task
          </Button>
        </div>

        <TaskStats 
          pendingCount={pendingCount}
          inProgressCount={inProgressCount}
          completedCount={completedCount}
        />

        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All Tasks", count: tasks.length },
            { key: "pending", label: "Pending", count: pendingCount },
            { key: "in_progress", label: "In Progress", count: inProgressCount },
            { key: "completed", label: "Completed", count: completedCount }
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={filterStatus === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(filter.key)}
              className={`
                flex items-center gap-2 transition-all duration-200
                ${filterStatus === filter.key 
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600' 
                  : 'hover:bg-orange-50'
                }
              `}
            >
              {filter.label}
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${filterStatus === filter.key 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {filter.count}
              </span>
            </Button>
          ))}
        </div>

        <TaskList 
          tasks={filteredTasks}
          onEdit={handleTaskEdit}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
        />

        <AnimatePresence>
          {showForm && (
            <TaskForm
              task={editingTask}
              onSubmit={handleTaskSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
              user={user}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}