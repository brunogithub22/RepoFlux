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


  const fetchLanguage = useCallback(async () => {
    const actionName = "getLanguages";
    try {
      const response = await fetch('/api/drizzle/helper/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionName, payload: {} }),
      });
      const result = await response.json();
      if (response.ok) {
        setMyLanguages(result.result);
      }
    } catch (error) {
      console.error("Error fetching user languages:", error);
    }
  }, []);

  // 2. Use ONE useEffect to handle the initial mount
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
      // We run both fetches in parallel to save time
      // This is faster than waiting for one, then the other.
        await Promise.all([
          fetch('/api/languages')
            .then(res => res.json())
            .then(data => setLanguages(data)),
          fetchLanguage()
        ]);
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
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

      switch (result.result.message) {
        case 'language added':
          alert('language successfully added to the database!');
          break;
        case 'language already exists':
          alert('This language already exists in the database.');
          break;
        default:
          alert('Unexpected response: ' + result.result.message);
      }

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
          payload: { Id:  id} // Passing the parameter
        }),
      });
  
      const result = await response.json();
    
      if (!response.ok) {
        throw new Error(result.error || "Failed to remove language");
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
        
        <div>

        </div>
        {myLanguages.length > 0 ? 
          (<div>
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
          </div>)
          : (
            <div className="mt-4 p-4 rounded-xl border border-dashed text-center text-sm text-gray-400 dark:border-zinc-800">
              <p className="font-medium mb-1">No languages added yet</p>
              <p>Search for a language above and click it to add</p>
            </div>
          )
        }
        
        
      </div>

    </div>
  );
}