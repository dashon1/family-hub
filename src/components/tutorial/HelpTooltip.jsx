import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function HelpTooltip({ title, content, icon }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full hover:bg-orange-100"
        >
          {icon || <HelpCircle className="w-4 h-4 text-orange-600" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-orange-600" />
            {title}
          </h4>
          <p className="text-sm text-gray-700">{content}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}