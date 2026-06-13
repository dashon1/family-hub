import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, ShoppingCart, User, DollarSign } from "lucide-react";

export default function ShoppingList({ items, onToggleComplete, onDeleteItem }) {
  const categoryColors = {
    produce: "bg-green-100 text-green-800 border-green-200",
    dairy: "bg-blue-100 text-blue-800 border-blue-200",
    meat: "bg-red-100 text-red-800 border-red-200",
    pantry: "bg-yellow-100 text-yellow-800 border-yellow-200",
    frozen: "bg-cyan-100 text-cyan-800 border-cyan-200",
    bakery: "bg-orange-100 text-orange-800 border-orange-200",
    household: "bg-purple-100 text-purple-800 border-purple-200",
    other: "bg-gray-100 text-gray-800 border-gray-200"
  };

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'other';
    if (!acc[category]) {
      acc[category] = { active: [], completed: [] };
    }
    if (item.completed) {
      acc[category].completed.push(item);
    } else {
      acc[category].active.push(item);
    }
    return acc;
  }, {});

  const categoryOrder = ["produce", "dairy", "meat", "bakery", "pantry", "frozen", "household", "other"];
  const sortedCategories = Object.keys(groupedItems).sort((a,b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b));

  const allActiveItems = items.filter(item => !item.completed);
  const allCompletedItems = items.filter(item => item.completed);

  const totalEstimatedCost = allActiveItems.reduce((sum, item) => sum + (item.estimated_cost || 0), 0);
  const totalActualCost = allCompletedItems.reduce((sum, item) => sum + (item.actual_cost || item.estimated_cost || 0), 0);

  if (items.length === 0) {
    return (
       <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">List is Empty</h3>
            <p className="text-gray-500">Add some items or select a different category.</p>
          </CardContent>
        </Card>
    )
  }

  return (
    <div className="space-y-6">
      {allActiveItems.length > 0 && (
        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Shopping List ({allActiveItems.length} items)
              </CardTitle>
              {totalEstimatedCost > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Est: ${totalEstimatedCost.toFixed(2)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {sortedCategories.map(category => {
              const { active } = groupedItems[category];
              if (active.length === 0) return null;
              return (
                <div key={category}>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Badge className={`${categoryColors[category]} capitalize`}>{category.replace('_', ' ')}</Badge>
                  </h3>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {active.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-4 pl-4"
                        >
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() => onToggleComplete(item)}
                            className="flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0 py-2 border-b">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              {item.quantity !== "1" && (
                                <span className="text-sm text-gray-500">({item.quantity})</span>
                              )}
                              {item.estimated_cost && (
                                <Badge variant="outline" className="text-xs">
                                  ${item.estimated_cost.toFixed(2)}
                                </Badge>
                              )}
                            </div>
                            {item.notes && (
                              <p className="text-sm text-gray-600">{item.notes}</p>
                            )}
                             {item.added_by && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <User className="w-3 h-3" />
                                {item.added_by.split('@')[0]}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteItem(item.id)}
                            className="text-gray-400 hover:text-red-500 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {allCompletedItems.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5" />
                Completed ({allCompletedItems.length} items)
              </CardTitle>
              {totalActualCost > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Spent: ${totalActualCost.toFixed(2)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              {allCompletedItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg opacity-60"
                >
                  <Checkbox
                    checked={true}
                    onCheckedChange={() => onToggleComplete(item)}
                    className="flex-shrink-0"
                  />
                  <div className="flex-1">
                    <span className="line-through text-gray-500">{item.name}</span>
                    {item.actual_cost && (
                      <span className="text-sm text-gray-500 ml-2">
                        (${item.actual_cost.toFixed(2)})
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteItem(item.id)}
                    className="text-gray-400 hover:text-red-500 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}