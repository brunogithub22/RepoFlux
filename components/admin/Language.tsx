"use client";

import { useState, useEffect } from 'react';
import { Search, Loader2, Code2 } from 'lucide-react';

export default function LanguagePicker() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 1. Fetch from your own local API route
  useEffect(() => {
    async function loadLanguages() {
      try {
        const response = await fetch('/api/languages'); // Calls your route.ts
        const data = await response.json();
        setLanguages(data);
      } catch (error) {
        console.error("Failed to load languages", error);
      } finally {
        setLoading(false);
      }
    }
    loadLanguages();
  }, []);

  // 2. Filter the list as the user types
  const filtered = languages
    .filter(l => l.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 8);

  return (
    <div className="p-4 max-w-sm">
      <div className="relative">
        <input
          className="w-full p-2 pl-10 border rounded-xl dark:bg-zinc-900 dark:border-zinc-800"
          placeholder="Research language..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>

      {loading && <div className="flex items-center gap-2 p-2"><Loader2 className="animate-spin" size={16}/> Loading...</div>}

      <ul className="mt-2 border rounded-xl overflow-hidden shadow-lg bg-white dark:bg-zinc-950">
        {search && filtered.map(lang => (
          <li 
            key={lang} 
            className="p-2 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-2"
            onClick={() => {
                setSearch(lang);
                console.log("Selected:", lang);
            }}
          >
            <Code2 size={14} />
            {lang}
          </li>
        ))}
      </ul>
    </div>
  );
}