import { Category, categoryConfig } from '@/lib/types';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  onSelect: (category: Category | 'custom') => void;
  className?: string;
}

const defaultCategories: Category[] = ['food', 'daily', 'medical', 'shopping'];

export const CategorySelector = ({ onSelect, className }: CategorySelectorProps) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {defaultCategories.map((category) => {
        const config = categoryConfig[category];
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={cn(
              'category-badge transition-all hover:scale-105 active:scale-95 cursor-pointer',
              config.color
            )}
          >
            <span>{config.emoji}</span>
            <span>{config.label}</span>
          </button>
        );
      })}
      <button
        onClick={() => onSelect('custom')}
        className="category-badge bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Custom</span>
      </button>
    </div>
  );
};
