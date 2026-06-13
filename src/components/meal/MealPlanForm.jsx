
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, UtensilsCrossed, Plus, Trash2 } from 'lucide-react';
import VoiceInput from "../shared/VoiceInput";

export default function MealPlanForm({ meal, selectedDate, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(meal || {
    date: selectedDate || new Date().toISOString().split('T')[0],
    meal_type: 'dinner',
    meal_name: '',
    recipe_url: '',
    ingredients: [],
    notes: ''
  });

  const [newIngredient, setNewIngredient] = useState('');

  useEffect(() => {
    if (selectedDate && !meal?.date) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate, meal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), newIngredient.trim()]
      }));
      setNewIngredient('');
    }
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  // Modified handlers to append text from voice input
  const handleMealNameVoice = (transcript) => {
    setFormData(prev => ({
      ...prev,
      meal_name: prev.meal_name ? prev.meal_name + ' ' + transcript : transcript
    }));
  };

  const handleIngredientVoice = (transcript) => {
    setNewIngredient(prev => prev ? prev + ' ' + transcript : transcript);
  };

  const handleNotesVoice = (transcript) => {
    handleChange('notes', formData.notes ? formData.notes + ' ' + transcript : transcript);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5" />
                {meal?.id ? 'Edit Meal' : 'Add Meal'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meal_name">Meal Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="meal_name"
                      placeholder="e.g., Spaghetti Bolognese"
                      value={formData.meal_name}
                      onChange={(e) => handleChange('meal_name', e.target.value)}
                      required
                      className="flex-1"
                    />
                    <VoiceInput
                      onTranscript={handleMealNameVoice}
                      currentText={formData.meal_name} // Added currentText prop
                      buttonSize="icon"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meal_type">Meal Type</Label>
                  <Select
                    value={formData.meal_type}
                    onValueChange={(value) => handleChange('meal_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="recipe_url">Recipe Link (optional)</Label>
                  <Input
                    id="recipe_url"
                    type="url"
                    placeholder="https://..."
                    value={formData.recipe_url}
                    onChange={(e) => handleChange('recipe_url', e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Ingredients</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add ingredient..."
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                      className="flex-1"
                    />
                    <VoiceInput
                      onTranscript={handleIngredientVoice}
                      currentText={newIngredient} // Added currentText prop
                      buttonSize="icon"
                    />
                    <Button type="button" onClick={addIngredient} size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.ingredients && formData.ingredients.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">{ingredient}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeIngredient(index)}
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <div className="space-y-2">
                    <Textarea
                      id="notes"
                      placeholder="Any additional notes..."
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      rows={2}
                    />
                    <VoiceInput
                      onTranscript={handleNotesVoice}
                      currentText={formData.notes} // Added currentText prop
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                  {meal?.id ? 'Update Meal' : 'Add Meal'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
