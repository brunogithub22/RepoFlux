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

  {/* 2. MAIN CONTENT (Now centered and single-focus) */}
  <div className="max-w-xl w-full">
    {/* PUBLIC PORTFOLIO CARD - Now the main focus */}
    <div className="p-10 bg-gray-50 dark:bg-gray-900/40 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group hover:border-blue-500/30 transition-all shadow-xl shadow-blue-500/5">
      <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6">
        <Code2 className="text-blue-600 w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Public Portfolio</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-[280px]">
        Explore software systems, hardware engineering, and technical documentation.
      </p>
      <Link 
        href="/dashboard" 
        className="flex items-center gap-2 px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
      >
        Enter Workspace <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>

  {/* 3. SUBTLE FOOTER (With Hidden Admin Access) */}
  <footer className="mt-20 text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] flex flex-col items-center gap-4">
    <div className="flex gap-4 items-center">
      <span>© {new Date().getFullYear()}</span>
      <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
      <span className="flex items-center gap-1">
        <Cpu className="w-3 h-3" /> Bits & Atoms
      </span>
    </div>
    
    {/* THE HIDDEN LINK: Looks like version text, but is actually the login link */}
    <Link 
      href="/login" 
      className="opacity-30 hover:opacity-100 transition-opacity cursor-default hover:cursor-pointer"
    >
      RepoFlux Systems v1.0.2
    </Link>
  </footer>
</div>
  );
}