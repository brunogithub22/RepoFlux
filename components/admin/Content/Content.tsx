'use client';

import {useState, JSX} from 'react';
import { LayoutDashboard,UploadCloud } from 'lucide-react';
import UploadContent from './UploadContent';
import ViewContent from './ViewContent';

export default function Content(){

  const [activeSubTab, setActiveSubTab] = useState("projects");

  const NAV_ITEMS = [
    { id: 'view', label: 'View', icon: LayoutDashboard },
    { id:'uploads', label: 'Uploads', icon: UploadCloud}
  ];

  const SUBVIEWS: Record<string, JSX.Element> = {
    projects: <ViewContent/>,
    uploads: <UploadContent/>,
  };

    return (
        <div>
          <nav className="flex px-4  mb-2">
            {NAV_ITEMS.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
                  activeSubTab === item.id 
                     ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" 
                      : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>

          {/* MAIN CONTENT */}
          <main className="flex-1 overflow-auto">
            {SUBVIEWS[activeSubTab]}
          </main>
        </div>
    );
}