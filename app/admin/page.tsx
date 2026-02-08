'use client';

import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from "@/lib/superbase/client";
import { JSX, useState } from 'react';
import Overview from '@/components/admin/Overview';
import Content from '@/components/admin/Content/Content';
import Post from '@/components/admin/Post';
import Language from '@/components/admin/Language';
import { 
  LayoutDashboard, 
  LogOut,
  BookOpen,
  ImagePlus,
  CodeXml
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [activeTab, setActiveTab] = useState('overview');

  // 2. The Power Move: The Component Map
  const VIEWS: Record<string, JSX.Element> = {
    overview: <Overview/>,
    post: <Post/>,
    content: <Content/>,
    language: <Language/>
  };

  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'post', label: 'Post',icon: BookOpen},
    { id: 'content', label: 'Content', icon: ImagePlus },
    { id: 'language', label: 'Language', icon: CodeXml}
  ];

  const handleSignOut = async () => {
    // 1. Sign out from Supabase
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#050505]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-6">
          <h2 className="text-blue-600 font-black tracking-tighter text-xl uppercase">
            Repo<span className="text-gray-900 dark:text-white">Flux</span>
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === item.id 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" 
                  : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900"
              }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        {/* SIGN OUT SECTION */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={handleSignOut}
            className="cursor-pointer flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl font-bold text-sm transition-all active:scale-95"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        {VIEWS[activeTab]}
      </main>
    </div>
  );
}