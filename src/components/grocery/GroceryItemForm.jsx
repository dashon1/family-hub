
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, ShoppingCart } from "lucide-react";
import VoiceInput from "../shared/VoiceInput";

export default function GroceryItemForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "other",
    quantity: "1",
    notes: "",
    list_name: "Main List",
    estimated_cost: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (submitData.estimated_cost) {
      submitData.estimated_cost = parseFloat(submitData.estimated_cost);
    }
    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Modified to append new voice input to the existing name
  const handleVoiceInput = (newTranscript) => {
    handleChange('name', formData.name ? formData.name + ' ' + newTranscript : newTranscript);
  };

  // This function already appends, so no change needed to its logic
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
        className="w-full max-w-lg"
      >
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add Grocery Item
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    placeholder="What do you need to buy?"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    className="flex-1"
                  />
                  <VoiceInput
                    onTranscript={handleVoiceInput}
                    currentText={formData.name} // Added currentText prop
                    buttonSize="icon"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="produce">Produce</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="meat">Meat</SelectItem>
                      <SelectItem value="pantry">Pantry</SelectItem>
                      <SelectItem value="frozen">Frozen</SelectItem>
                      <SelectItem value="bakery">Bakery</SelectItem>
                      <SelectItem value="household">Household</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    placeholder="1"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_cost">Estimated Cost (optional)</Label>
                <Input
                  id="estimated_cost"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.estimated_cost}
                  onChange={(e) => handleChange('estimated_cost', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <div className="space-y-2">
                  <Textarea
                    id="notes"
                    placeholder="Any specific brand or details..."
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

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                  Add Item
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
