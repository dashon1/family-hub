import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function QuickGroceryList({ items, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  const displayItems = items.slice(0, 8);

  return (
    <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Grocery List
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No items on your list</p>
            <Link to={createPageUrl("GroceryLists")}>
              <button className="text-orange-600 hover:text-orange-700 text-sm mt-2">
                Add Items →
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {displayItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                <span className="text-gray-900 flex-1">{item.name}</span>
                {item.quantity !== "1" && (
                  <span className="text-sm text-gray-500">({item.quantity})</span>
                )}
              </div>
            ))}
            {items.length > 8 && (
              <p className="text-sm text-gray-500 text-center pt-2">
                +{items.length - 8} more items
              </p>
            )}
            <Link to={createPageUrl("GroceryLists")}>
              <button className="w-full py-2 text-center text-orange-600 hover:text-orange-700 text-sm font-medium mt-3">
                View Full List →
              </button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}