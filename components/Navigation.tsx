import { Activity, BarChart3, BookOpen, Clock, Plus } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: 'dashboard' | 'log' | 'analytics' | 'selfhelp' | 'history') => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'log', label: 'Log', icon: Plus },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'selfhelp', label: 'Self-Help', icon: BookOpen },
    { id: 'history', label: 'History', icon: Clock },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-[73px] z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as any)}
                className={`
                  flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap
                  ${isActive
                    ? 'border-primary-600 text-primary-600 font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
