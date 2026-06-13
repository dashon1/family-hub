import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, DollarSign, TrendingUp, TrendingDown, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth } from 'date-fns';

import ExpenseForm from '../components/budget/ExpenseForm';
import ExpenseList from '../components/budget/ExpenseList';
import BudgetStats from '../components/budget/BudgetStats';

export default function BudgetTracker() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [user, setUser] = useState(null);
  const [currentMonth] = useState(new Date());

  useEffect(() => {
    loadUser();
    loadExpenses();
  }, []);

  const loadUser = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);
  };

  const loadExpenses = async () => {
    const data = await base44.entities.Expense.list('-date');
    setExpenses(data);
  };

  const handleSubmit = async (expenseData) => {
    if (editingExpense) {
      await base44.entities.Expense.update(editingExpense.id, expenseData);
    } else {
      await base44.entities.Expense.create({
        ...expenseData,
        paid_by: user?.email,
        household_id: user?.household_id
      });
    }
    setShowForm(false);
    setEditingExpense(null);
    loadExpenses();
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await base44.entities.Expense.delete(id);
    loadExpenses();
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate >= monthStart && expDate <= monthEnd;
  });

  const totalThisMonth = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalAllTime = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Budget Tracker
            </h1>
            <p className="text-gray-600 mt-2">Track family expenses together</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </Button>
        </div>

        <BudgetStats 
          totalThisMonth={totalThisMonth}
          totalAllTime={totalAllTime}
          expenses={monthExpenses}
        />

        <ExpenseList
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <AnimatePresence>
          {showForm && (
            <ExpenseForm
              expense={editingExpense}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingExpense(null);
              }}
              user={user}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}