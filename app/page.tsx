'use client';

import Link from "next/link";
import { Code2, ArrowRight, ShieldCheck, Cpu } from "lucide-react";

export default function WelcomePage() {
  // No auth hooks, no loading states. Purely lightweight.

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col items-center justify-center px-6 transition-colors">
      
      {/* 1. BRANDING */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black tracking-tighter uppercase mb-4">
          Repo<span className="text-blue-600">Flux</span>
        </h1>
        <p className="text-gray-500 font-mono text-xs tracking-[0.3em] uppercase">
          Bridging Bits & Atoms
        </p>
      </div>

      {/* 2. MAIN CARDS */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl w-full">
        
        {/* PUBLIC PORTFOLIO CARD */}
        <div className="p-10 bg-gray-50 dark:bg-gray-900/40 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group hover:border-blue-500/30 transition-all">
          <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6">
            <Code2 className="text-blue-600 w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Public Portfolio</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-[240px]">
            Explore software systems and hardware engineering projects.
          </p>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-sm hover:scale-105 transition-transform"
          >
            Explore Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ACCESS PORTAL CARD */}
        <div className="p-10 bg-white dark:bg-black rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center text-center group hover:border-blue-600 transition-all">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600/10 transition-colors">
            <ShieldCheck className="text-gray-400 w-6 h-6 group-hover:text-blue-600 transition-colors" />
          </div>

          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Member Access</h2>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-[240px]">
            Restricted area for authorized personnel and system administrators.
          </p>

          <Link 
            href="/login" 
            className="flex items-center gap-2 px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* 3. SUBTLE FOOTER */}
      <footer className="mt-20 text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] flex flex-col items-center gap-4">
        <div className="flex gap-4 items-center">
          <span>© {new Date().getFullYear()}</span>
          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3" /> Bits & Atoms
          </span>
        </div>
        <p className="opacity-50">RepoFlux Systems v1.0.2</p>
      </footer>
    </div>
  );
}