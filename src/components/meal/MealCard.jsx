import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ShoppingCart, ExternalLink } from 'lucide-react';
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

export default function MealCard({ meal, onEdit, onDelete, onAddToGrocery }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm text-gray-900">{meal.meal_name}</h4>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onEdit(meal)}
            >
              <Edit className="w-3 h-3" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Meal?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{meal.meal_name}"?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(meal.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {meal.recipe_url && (
          <a
            href={meal.recipe_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2"
          >
            <ExternalLink className="w-3 h-3" />
            Recipe
          </a>
        )}
        
        {meal.ingredients && meal.ingredients.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs mt-2"
            onClick={() => onAddToGrocery(meal)}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Add to Grocery List
          </Button>
        )}
        
        {meal.notes && (
          <p className="text-xs text-gray-600 mt-2">{meal.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}