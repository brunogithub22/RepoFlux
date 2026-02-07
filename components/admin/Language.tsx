'use client';

import { useState, useEffect, useCallback} from 'react';
import { Search, Loader2, Code2, Trash2 } from 'lucide-react';

interface Language {
  id: string;
  language: string;
}

export default function Language() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [myLanguages,setMyLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");


  const fetchLanguage = useCallback(async ()=>{
    const actionName = "getLanguages"; // The "function name" your API expects

      try {  
        const response = await fetch('/api/drizzle/helper/admin', { // Use the path to your route.ts
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            actionName: actionName,
            payload: {  } // Passing the parameter
          }),
        });
  
        const result = await response.json();
      
        if (!response.ok) {
          throw new Error(result.error || "Failed to add language");
        }
        console.log(result.result);
        setMyLanguages(result.result);
      } catch (error) {
        console.error("Error calling API:", error);
      }
  },[]); 
    

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

  useEffect(()=>{
    fetchLanguage();
  }, [fetchLanguage]);

  async function closeList(){
    if(search){
      setSearch("");
    }
  }

  async function addLanguage(lang: string) {
    setSearch(lang);
    const actionName = "newLanguage"; // The "function name" your API expects

    try {  
      const response = await fetch('/api/drizzle/helper/admin', { // Use the path to your route.ts
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionName: actionName,
          payload: { language: lang } // Passing the parameter
        }),
      });
  
      const result = await response.json();
    
      if (!response.ok) {
        throw new Error(result.error || "Failed to add language");
      }

      console.log("Success:", result);
      await fetchLanguage();
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  async function deleteLanguages(id:string) {
    const actionName = "removeLanguage"; // The "function name" your API expects

    try {  
      const response = await fetch('/api/drizzle/helper/admin', { // Use the path to your route.ts
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionName: actionName,
          payload: { id:  id} // Passing the parameter
        }),
      });
  
      const result = await response.json();
    
      if (!response.ok) {
        throw new Error(result.error || "Failed to add language");
      }

      console.log("Success:", result);
      await fetchLanguage();
    } catch (error) {
      console.error("Error calling API:", error);
    }
  }

  // 2. Filter the list as the user types
  const filtered = languages.filter(lang => lang.toLowerCase().startsWith(search.toLowerCase()));
  

  return (
    <div onClick={() => closeList()} className="p-4 h-full w-full">
      <div className="relative w-max">
        <input
          type="text"
          id='language'
          className="w-full p-2 pl-10 border rounded-xl dark:bg-zinc-900 dark:border-zinc-800"
          placeholder="Research language..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>

      {loading && <div className="flex items-center gap-2 p-2"><Loader2 className="animate-spin" size={16}/> Loading...</div>}

      {search && filtered.length > 0 && (
       <ul className="absolute z-10 mt-2 max-h-80 w-fit overflow-y-auto border rounded-xl overflow-hidden shadow-lg bg-white dark:bg-zinc-950">
         {filtered.map(lang => (
          <li
            key={lang}
            className="p-2 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-2"
            onClick={async ()=> await addLanguage(lang)}
          >
          <Code2 size={14} />
          {lang}
        </li>
        ))}
       </ul>
      )}
      <div className="mt-3">
        <h5 className=" font-medium text-gray-500 dark:text-gray-400">Languages</h5>
        <ul className="  mt-2 max-h-80 w-full overflow-y-auto bg-white dark:bg-zinc-950">
         {myLanguages.map(lang => (
          <li
            key={lang.id}
            className="p-2 flex items-center gap-2"
          >
          <button className='cursor-pointer' onClick={ async ()=> await deleteLanguages(lang.id)}>
            <Trash2 size={20}/>
          </button>  
          <span> - {lang.language}</span>
        </li>
        ))}
       </ul>
      </div>

    </div>
  );
}