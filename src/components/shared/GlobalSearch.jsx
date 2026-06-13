import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Calendar, CheckSquare, FileText, DollarSign, Camera, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length >= 2) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const searchTerm = query.toLowerCase();
      const allResults = [];

      // Search events
      const events = await base44.entities.CalendarEvent.list();
      events.forEach(item => {
        if (item.title?.toLowerCase().includes(searchTerm) || 
            item.description?.toLowerCase().includes(searchTerm) ||
            item.location?.toLowerCase().includes(searchTerm)) {
          allResults.push({ ...item, _type: 'event', _icon: Calendar, _page: 'FamilyCalendar' });
        }
      });

      // Search tasks
      const tasks = await base44.entities.TodoItem.list();
      tasks.forEach(item => {
        if (item.title?.toLowerCase().includes(searchTerm) || 
            item.description?.toLowerCase().includes(searchTerm)) {
          allResults.push({ ...item, _type: 'task', _icon: CheckSquare, _page: 'FamilyTasks' });
        }
      });

      // Search notes
      const notes = await base44.entities.Note.list();
      notes.forEach(item => {
        if (item.title?.toLowerCase().includes(searchTerm) || 
            item.content?.toLowerCase().includes(searchTerm)) {
          allResults.push({ ...item, _type: 'note', _icon: FileText, _page: 'FamilyNotes' });
        }
      });

      // Search expenses
      const expenses = await base44.entities.Expense.list();
      expenses.forEach(item => {
        if (item.title?.toLowerCase().includes(searchTerm) || 
            item.notes?.toLowerCase().includes(searchTerm)) {
          allResults.push({ ...item, _type: 'expense', _icon: DollarSign, _page: 'BudgetTracker' });
        }
      });

      // Search grocery items
      const groceries = await base44.entities.GroceryItem.list();
      groceries.forEach(item => {
        if (item.name?.toLowerCase().includes(searchTerm)) {
          allResults.push({ ...item, _type: 'grocery', _icon: ShoppingCart, _page: 'GroceryLists' });
        }
      });

      setResults(allResults.slice(0, 10));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result) => {
    navigate(createPageUrl(result._page));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[150] flex items-start justify-center pt-20" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl mx-4"
      >
        <Card className="shadow-2xl border-2 border-orange-300">
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search everything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 text-lg"
                autoFocus
              />
            </div>

            <AnimatePresence>
              {results.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result, index) => {
                    const Icon = result._icon;
                    return (
                      <motion.div
                        key={`${result._type}-${result.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleResultClick(result)}
                        className="p-3 bg-gray-50 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-orange-600" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {result.title || result.name}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">{result._type}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>

            {query.length >= 2 && results.length === 0 && !isSearching && (
              <p className="text-center text-gray-500 py-8">No results found</p>
            )}

            {query.length < 2 && (
              <p className="text-center text-gray-500 py-8">Type at least 2 characters to search</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}