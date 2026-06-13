import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign, PieChart } from 'lucide-react';

export default function BudgetStats({ totalThisMonth, totalAllTime, expenses }) {
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">${totalThisMonth.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-100">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">All Time</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">${totalAllTime.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-100">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Top Category</p>
              <p className="text-xl font-bold text-gray-900 mt-1 capitalize">
                {topCategory ? topCategory[0] : 'None'}
              </p>
              {topCategory && (
                <p className="text-sm text-gray-600">${topCategory[1].toFixed(2)}</p>
              )}
            </div>
            <div className="p-3 rounded-xl bg-purple-100">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}