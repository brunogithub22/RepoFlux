import { LanguageType, post } from "@/components/intefaces";
import {Calendar,Globe} from 'lucide-react';
import { useEffect } from "react";

export default function ViewPost({Post, onNavigate }: {Post?: post, onNavigate?: (tab: string) => void;}){

    const lang: LanguageType[] = Array.isArray(Post?.languages) ? Post?.languages: [];

    if (!Post) return <div>No post selected. Please go back to Overview.</div>;
    
    return(
      <div className="max-w-4xl mx-auto py-10 px-6 bg-zinc-950 text-zinc-100 min-h-screen">
          
          {/* 2. Header Section */}
          <header className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/20">
                {Post?.type}
              </span>
              <div className="h-1 w-1 rounded-full bg-zinc-700" />
              <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                <Calendar size={14} />
                {Post?.date}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className={Post?.published ? "text-emerald-400" : "text-amber-400"}>
                ● {Post?.published ? "Published" : "Draft"}
                </span>
              </div>
           </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">  
            {Post?.title}
          </h1>
        </header>

        {/* 3. Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Description</h3>
              <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap">
                {Post?.description}
              </p>
            </section>
          </div>

          {/* 4. Sidebar: Tech Stack / Languages */}
          <aside className="lg:col-span-1">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl sticky top-8">
              <div className="flex items-center gap-2 mb-6 text-white font-bold">
                <Globe size={18} className="text-blue-500" />
                <span>Languages Used</span>
              </div>
            
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                {lang.length > 0 ? (
                  lang.map((lang) => (
                    <span 
                      key={lang.id} 
                      className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 font-medium"
                    >
                      {lang.language}
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-600 text-sm italic">No languages linked.</span>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    );   

}