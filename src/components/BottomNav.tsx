import { MessageCircle, History } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'ask-ai' | 'history';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const navItems: { id: Tab; icon: React.ElementType; label: string }[] = [
  { id: 'ask-ai', icon: MessageCircle, label: 'Ask AI' },
  { id: 'history', icon: History, label: 'History' },
];

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="sticky bottom-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              'flex flex-col items-center gap-1 px-8 py-2 rounded-xl transition-all',
              activeTab === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div
              className={cn(
                'p-2 rounded-full transition-all',
                activeTab === id && 'bg-primary/10'
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
