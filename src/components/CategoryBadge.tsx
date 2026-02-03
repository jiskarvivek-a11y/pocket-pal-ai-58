import { Category, categoryConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
  className?: string;
}

export const CategoryBadge = ({ category, size = 'md', className }: CategoryBadgeProps) => {
  const config = categoryConfig[category];
  
  return (
    <span
      className={cn(
        'category-badge',
        config.color,
        size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5',
        className
      )}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
};
