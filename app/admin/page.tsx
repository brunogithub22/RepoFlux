'use client';

import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from "@/lib/superbase/client";
import { useStore } from "@/store/useStore";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  User,
  Activity
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const { isLoggedIn, Login } = useStore();

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
          <button className="flex items-center gap-3 w-full p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl font-bold text-sm">
            <LayoutDashboard size={18} /> Overview
          </button>
          <button className="flex items-center gap-3 w-full p-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl font-bold text-sm transition-colors">
            <Settings size={18} /> Settings
          </button>
        </nav>

        {/* SIGN OUT SECTION */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <User size={16} className="text-gray-500" />
            </div>
            
          </div>

          <button 
            onClick={handleSignOut}
            className="cursor-pointer flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl font-bold text-sm transition-all active:scale-95"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">System Overview</h1>
          <p className="text-gray-500">Welcome back to the command center.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm">
            <Activity className="text-blue-600 mb-4" />
            <div className="text-2xl font-black">99.9%</div>
            <div className="text-xs text-gray-400 uppercase font-bold tracking-widest">Uptime</div>
          </div>
          {/* Add more stats here */}
        </div>
      </main>
    </div>
  );
}