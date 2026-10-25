import React from 'react';
import { UserRole } from '../types';
import { ROLE_MODULES } from './Sidebar';

interface BottomBarProps {
  activeRole: UserRole;
  currentTab: string;
  onSelectTab: (tabId: string) => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  activeRole,
  currentTab,
  onSelectTab,
}) => {
  const modules = ROLE_MODULES[activeRole] || [];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1 shadow-lg select-none pb-safe">
      <div className="flex items-center justify-around gap-1">
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = currentTab === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectTab(m.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-[#FD363D]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-red-50 text-[#FD363D]' : 'text-gray-500'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`text-[10px] font-semibold mt-0.5 tracking-tight truncate max-w-[64px] text-center ${
                  isActive ? 'text-[#FD363D] font-bold' : 'text-gray-600'
                }`}
              >
                {m.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
