import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const categoryColors = {
    groceries: 'bg-green-100 text-green-800',
    utilities: 'bg-blue-100 text-blue-800',
    transportation: 'bg-purple-100 text-purple-800',
    entertainment: 'bg-pink-100 text-pink-800',
    healthcare: 'bg-red-100 text-red-800',
    education: 'bg-yellow-100 text-yellow-800',
    housing: 'bg-indigo-100 text-indigo-800',
    other: 'bg-gray-100 text-gray-800'
  };

  if (expenses.length === 0) {
    return (
      <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <p className="text-gray-600">No expenses yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {expenses.map(expense => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{expense.title}</h3>
                      <Badge className={categoryColors[expense.category]}>
                        {expense.category}
                      </Badge>
                      {expense.receipt_url && (
                        <a href={expense.receipt_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Receipt className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">${expense.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(new Date(expense.date), 'MMM d, yyyy')} • Paid by {expense.paid_by || expense.created_by}
                    </p>
                    {expense.notes && (
                      <p className="text-sm text-gray-600 mt-2">{expense.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(expense)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(expense.id)} className="text-red-500">
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