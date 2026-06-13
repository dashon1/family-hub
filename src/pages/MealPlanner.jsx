import React, { useState, useEffect } from 'react';
import { MealPlan, GroceryItem, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, UtensilsCrossed, ShoppingCart } from 'lucide-react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, addWeeks, subWeeks, parseISO, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

import MealPlanForm from '../components/meal/MealPlanForm';
import MealCard from '../components/meal/MealCard';

export default function MealPlanner() {
  const [meals, setMeals] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadMeals();
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

  const loadMeals = async () => {
    const fetchedMeals = await MealPlan.list('-date');
    setMeals(fetchedMeals);
  };

  const handleMealSubmit = async (mealData) => {
    if (editingMeal) {
      await MealPlan.update(editingMeal.id, mealData);
    } else {
      await MealPlan.create({
        ...mealData,
        household_id: user?.household_id
      });
    }
    setShowForm(false);
    setEditingMeal(null);
    setSelectedDate(null);
    loadMeals();
  };

  const handleAddToGroceryList = async (meal) => {
    if (meal.ingredients && meal.ingredients.length > 0) {
      for (const ingredient of meal.ingredients) {
        await GroceryItem.create({
          name: ingredient,
          added_by: user?.email,
          household_id: user?.household_id,
          notes: `From meal: ${meal.meal_name}`
        });
      }
      alert(`Added ${meal.ingredients.length} ingredients to grocery list!`);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    await MealPlan.delete(mealId);
    loadMeals();
  };

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 0 })
  });

  const getMealsForDate = (date, mealType) => {
    return meals.filter(meal => 
      isSameDay(parseISO(meal.date), date) && meal.meal_type === mealType
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Meal Planner
            </h1>
            <p className="text-gray-600 mt-2">Plan your family's meals for the week</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Meal
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl flex items-center gap-2">
                <UtensilsCrossed className="w-6 h-6" />
                Week of {format(currentWeekStart, 'MMMM d, yyyy')}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}>
                  ← Previous
                </Button>
                <Button variant="outline" onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }))}>
                  This Week
                </Button>
                <Button variant="outline" onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}>
                  Next →
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-50 text-left font-semibold w-32">Meal</th>
                    {weekDays.map(day => (
                      <th key={day.toISOString()} className="border p-2 bg-gray-50 text-center">
                        <div className="font-semibold">{format(day, 'EEE')}</div>
                        <div className="text-sm text-gray-600">{format(day, 'MMM d')}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['breakfast', 'lunch', 'dinner'].map(mealType => (
                    <tr key={mealType}>
                      <td className="border p-2 bg-gray-50 font-medium capitalize">{mealType}</td>
                      {weekDays.map(day => (
                        <td key={day.toISOString()} className="border p-2 align-top">
                          <div className="min-h-[100px] space-y-2">
                            {getMealsForDate(day, mealType).map(meal => (
                              <MealCard
                                key={meal.id}
                                meal={meal}
                                onEdit={() => {
                                  setEditingMeal(meal);
                                  setShowForm(true);
                                }}
                                onDelete={handleDeleteMeal}
                                onAddToGrocery={handleAddToGroceryList}
                              />
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedDate(format(day, 'yyyy-MM-dd'));
                                setEditingMeal({ meal_type: mealType });
                                setShowForm(true);
                              }}
                              className="w-full text-xs text-gray-500 hover:text-gray-700"
                            >
                              + Add {mealType}
                            </Button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {showForm && (
            <MealPlanForm
              meal={editingMeal}
              selectedDate={selectedDate}
              onSubmit={handleMealSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingMeal(null);
                setSelectedDate(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}