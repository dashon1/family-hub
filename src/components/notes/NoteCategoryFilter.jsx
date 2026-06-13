import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NoteCategoryFilter({ selectedCategory, onCategoryChange, notes }) {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'contacts', label: 'Contacts' },
    { value: 'household_info', label: 'Household Info' },
    { value: 'important_dates', label: 'Important Dates' },
    { value: 'passwords', label: 'Passwords' },
    { value: 'medical', label: 'Medical' },
    { value: 'school', label: 'School' },
    { value: 'other', label: 'Other' }
  ];

  const getCategoryCount = (category) => {
    if (category === 'all') return notes.length;
    return notes.filter(note => note.category === category).length;
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