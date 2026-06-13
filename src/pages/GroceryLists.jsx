
import React, { useState, useEffect } from "react";
import { GroceryItem, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ShoppingCart, Check, X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import GroceryItemForm from "../components/grocery/GroceryItemForm";
import ShoppingList from "../components/grocery/ShoppingList";
import CategoryFilter from "../components/grocery/CategoryFilter";
import VoiceInput from "../components/shared/VoiceInput";

export default function GroceryLists() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quickAddItem, setQuickAddItem] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadItems();
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

  const loadItems = async () => {
    const fetchedItems = await GroceryItem.list("-created_date");
    setItems(fetchedItems);
  };

  const handleItemSubmit = async (itemData) => {
    await GroceryItem.create({
      ...itemData,
      added_by: user?.email,
      household_id: user?.household_id
    });
    setShowForm(false);
    loadItems();
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickAddItem.trim()) return;

    await GroceryItem.create({
      name: quickAddItem,
      added_by: user?.email,
      household_id: user?.household_id
    });
    setQuickAddItem("");
    loadItems();
  };

  const toggleItemComplete = async (item) => {
    await GroceryItem.update(item.id, {
      ...item,
      completed: !item.completed
    });
    loadItems();
  };

  const deleteItem = async (itemId) => {
    await GroceryItem.delete(itemId);
    loadItems();
  };

  const clearCompleted = async () => {
    const completedItems = items.filter(item => item.completed);
    for (const item of completedItems) {
      await GroceryItem.delete(item.id);
    }
    loadItems();
  };

  const handleVoiceInput = (newText) => {
    setQuickAddItem(prevText => prevText ? `${prevText} ${newText}` : newText);
  };

  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter(item => item.category === selectedCategory);

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Grocery Lists
            </h1>
            <p className="text-gray-600 mt-2">
              {completedCount} of {totalCount} items completed
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Item
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Quick Add
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleQuickAdd} className="flex gap-3">
              <Input
                placeholder="Add item quickly..."
                value={quickAddItem}
                onChange={(e) => setQuickAddItem(e.target.value)}
                className="flex-1"
              />
              <VoiceInput
                onTranscript={handleVoiceInput}
                currentText={quickAddItem}
                buttonSize="icon"
              />
              <Button type="submit" disabled={!quickAddItem.trim()}>
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            items={items}
          />
          {completedCount > 0 && (
             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Clear Completed
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {completedCount} completed item(s).
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={clearCompleted}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Clear
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          )}
        </div>

        <ShoppingList
          items={filteredItems}
          onToggleComplete={toggleItemComplete}
          onDeleteItem={deleteItem}
        />

        <AnimatePresence>
          {showForm && (
            <GroceryItemForm
              onSubmit={handleItemSubmit}
              onCancel={() => setShowForm(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
