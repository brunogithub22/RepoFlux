'use client';

import {useState, JSX} from 'react';
import { LayoutDashboard,UploadCloud } from 'lucide-react';
import UploadContent from './UploadContent';
import ViewContent from './ViewContent';
import { NavigationProps } from '@/components/intefaces';

export default function Content({ onNavigate }: NavigationProps){

  const [activeSubTab, setActiveSubTab] = useState("view");

  const NAV_ITEMS = [
    { id: 'view', label: 'View', icon: LayoutDashboard },
    { id:'uploads', label: 'Uploads', icon: UploadCloud}
  ];

  const SUBVIEWS: Record<string, JSX.Element> = {
    view: <ViewContent/>,
    uploads: <UploadContent/>,
  };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
        {/* Header/Nav Wrapper */}
          <header className="sticky top-0 z-10 border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
            <nav className="flex items-center gap-1 p-2 max-w-screen-2xl mx-auto">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSubTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSubTab(item.id)}
                      className={`
                       relative flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${isActive 
                          ? "text-blue-600 dark:text-blue-400" 
                          : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-900"
                        }
                     `}
                    >
                     <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                     <span>{item.label}</span>
            
                     {/* Active Indicator Line */}
                     {isActive && (
                       <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                     )}
                    </button>
                  );
                })}
              </nav>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6 overflow-auto">
              <div className="max-w-screen-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                {SUBVIEWS[activeSubTab]}
              </div>
            </main>
          </div>
    );
}