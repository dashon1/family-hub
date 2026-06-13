import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CategoryFilter({ selectedCategory, onCategoryChange, items }) {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'produce', label: 'Produce' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'meat', label: 'Meat' },
    { value: 'pantry', label: 'Pantry' },
    { value: 'frozen', label: 'Frozen' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'household', label: 'Household' },
    { value: 'other', label: 'Other' }
  ];

  const getCategoryCount = (category) => {
    if (category === 'all') return items.length;
    return items.filter(item => item.category === category).length;
  };

  return (
    <Select value={selectedCategory} onValueChange={onCategoryChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map(category => (
          <SelectItem key={category.value} value={category.value}>
            {category.label} ({getCategoryCount(category.value)})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}