'use client';

import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from "@/lib/superbase/client";
import { JSX, useState } from 'react';
import Overview from '@/components/admin/Overview';
import Content from '@/components/admin/Content/Content';
import Post from '@/components/admin/Post';
import Language from '@/components/admin/Language';
import ModifyPost from '@/components/admin/Post/ModifyPost';
import ViewPost from '@/components/admin/Post/ViewPost';
import {BasePost} from "@/components/intefaces"
import { 
  LayoutDashboard, 
  LogOut,
  BookOpen,
  ImagePlus,
  CodeXml,
  Menu,    // Added for mobile menu
  X,        // Added for mobile menu
  Pencil,
  Eye
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile state
  const [selectedPost,setSelectedPosts] = useState<BasePost>();

  // Use a function to change the tab AND the post at the same time
  const handleViewPost = (postData: BasePost,name: string) => {
    setSelectedPosts(postData);
    setActiveTab(name);
  };

  // Turn VIEWS into a function so it can access 'selectedPost'
  const renderView = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onNavigate={setActiveTab} onViewPost={handleViewPost} />;
      case 'view':
        return <ViewPost Post={selectedPost} onNavigate={setActiveTab} />;
      case 'modify':
        return <ModifyPost Post={selectedPost} onNavigate={setActiveTab} />;
      case 'post':
        return <Post onNavigate={setActiveTab}/>;
      case 'content':
        return <Content onNavigate={setActiveTab}/>;
      case 'language':
        return <Language onNavigate={setActiveTab}/>;
    }
  };

  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'post', label: 'New Post', icon: BookOpen},
    { id: 'content', label: 'Content', icon: ImagePlus },
    { id: 'language', label: 'Language', icon: CodeXml},
    { id: 'view' , label: 'View Post', icon: Eye},
    { id: 'modify', label: 'Modify Post', icon: Pencil}
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#050505] overflow-hidden">
      
      {/* MOBILE HEADER - Only visible on small screens */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white dark:bg-black border-b border-gray-800 p-4 z-50 flex justify-between items-center">
        <h2 className="text-blue-600 font-black tracking-tighter text-lg uppercase">
          Repo<span className="text-gray-900 dark:text-white">Flux</span>
        </h2>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 
        transform transition-transform duration-300 ease-in-out flex flex-col
        lg:relative lg:translate-x-0 
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 hidden lg:block">
          <h2 className="text-blue-600 font-black tracking-tighter text-xl uppercase">
            Repo<span className="text-gray-900 dark:text-white">Flux</span>
          </h2>
        </div>

        {/* Padding for mobile header spacing */}
        <div className="h-16 lg:hidden" />

        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => {
           
            const isDisabled = item.id === 'view' || item.id === 'modify';

            return (
              <button 
                key={item.id}
                disabled={isDisabled} 
                onClick={() => {
                if (isDisabled) return; // Safety check
                  setActiveTab(item.id);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-3 ${isDisabled ? "cursor-not-allowed": ""} w-full p-3 rounded-xl font-bold text-sm transition-all border ${
                   activeTab === item.id 
                      ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20 cursor-pointer" 
                      : "text-zinc-400 border-transparent hover:bg-zinc-900 hover:text-zinc-100 cursor-pointer"
                }`}
              >
                <item.icon size={18} className={isDisabled ? "text-zinc-700" : ""} /> 
                {item.label}
              </button>
            );
            
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={handleSignOut}
            className="cursor-pointer flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl font-bold text-sm transition-all active:scale-95"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* OVERLAY for mobile */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
         {renderView()} {/* Call the function here */}
        </div>
      </main>
    </div>
  );
}