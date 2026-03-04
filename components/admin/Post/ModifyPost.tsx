import { useState,useEffect } from "react";
import { BasePost,post,LanguageType,Block } from "@/components/intefaces";
import { Calendar, Save } from "lucide-react";

export default function ModifyPost({Post, onNavigate }: {Post?: BasePost, onNavigate?: (tab: string) => void;}){
    
    const [post,setPost] = useState<post>();
    const [lang,setLang] = useState<LanguageType[]>([]);
    const [content,setContent] = useState<Block[]>([]);
    const [isLoading, setIsLoading] = useState(true); 
    const options = ["Software", "Project"];
    const [category, setCategory] = useState<string>("empty");  
    const [selectedIdx, setSelectedIdx] = useState<number>(0);
    
    const nextImage = async (length: number) => {
      setSelectedIdx((prev) => {
        const nextIdx = (prev + 1) % length;
        return nextIdx;
      });
    };

    // Helper to handle the "Previous" logic
    const prevImage = async (length: number) => {
      setSelectedIdx((prev) => {
        const nextIdx = (prev - 1 + length) % length;
        return nextIdx;
      });
    };
    
    useEffect(() => {
        const getPost = async () => {
          const actionName = "getPost";
          try {
            const response = await fetch('/api/drizzle/helper/admin', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              // Use the ID from your initial source (e.g., props or URL params)
              body: JSON.stringify({ actionName, payload: { id: Post?.id } }),
            });
    
            const result = await response.json();
    
            if (response.ok && result.result && result.result.length > 0) {
              const data: post = result.result[0];
              
              // 1. Update the state for the UI
              setPost(data);
    
              if (!data) {
                console.log("Error: Data is empty");
                return;
              }
    
              // Set other states using the fresh 'data' object
              setLang(data.languages || []);
              setContent(data.content || []);
            
              console.log("Post data loaded successfully:", data);
            } else {
              console.error("Post not found or API error");
            }
          } catch (error) {
            console.error("Error fetching post:", error);
          }
          finally{
            setIsLoading(false);
          }
        };
    
        // Only run if Post?.id exists to avoid unnecessary empty API calls
        if (Post?.id) {
          getPost();
        }
    }, []); // Added dependency to re-run if the ID changes
    
    const updatePost = async ()=>{}

    if (!Post) return <div>No post selected. Please go back to Overview.</div>;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-black">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
         <p className="ml-4 text-white">Loading your post...</p>
        </div>
      ); 
    }

    return(
        <div className="max-w-4xl mx-auto py-10 px-6 bg-zinc-950 text-zinc-100 min-h-screen">
            {/* 2. Header Section */}
            <header className="space-y-6 mb-12">
              <div className="flex items-center gap-3">
                <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 w-fit">
                 {options.map((option) => (
                   <label key={option} className="relative cursor-pointer">
                     <input
                       type="radio"
                       name="blockType"
                       value={option}
                       checked={category === option}
                       onChange={(e) => setCategory(e.target.value)}
                       className="sr-only" 
                     />
        
                    <div className={`
                       px-4 py-2 rounded-lg text-xs font-bold transition-all
                       ${category === option 
                       ? "bg-blue-500 text-white shadow-lg" 
                       : "text-zinc-500 hover:text-zinc-300"}
              `     }>
                       {option}
                    </div>
                   </label>
                 ))}
                </div>
                <div className="h-1 w-1 rounded-full bg-zinc-700" />
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                  <Calendar size={14} />
                  {post?.date}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className={Post?.published ? "text-emerald-400" : "text-amber-400"}>
                  ● {Post?.published ? "Published" : "Draft"}
                  </span>
                </div>

                <button
                  onClick={updatePost} 
                  className="
                    group relative flex items-center justify-center p-3 
                  bg-zinc-900/50 backdrop-blur-md 
                    border border-zinc-800 hover:border-blue-500/50 
                    rounded-2xl text-zinc-400 hover:text-white 
                    transition-all duration-300 ease-out
                    hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]
                    active:scale-90 cursor-pointer
                   ">
                       <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
                       <Save size={24} className="relative z-10 group-hover:rotate-6 transition-transform duration-300" />
                    </button>
              </div>

              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">  
                <input value={post?.title} 
                       onChange={(e)=>{
                         setPost(prev => prev ? ({ ...prev, title: e.target.value }) : prev);
                       }}
                />
              </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                       <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Description</h3>
                       <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap">
                           <input 
                             value={post?.description}
                             onChange={(e)=>{
                              setPost(prev => prev ? ({ ...prev, description: e.target.value }) : prev);
                             }} />
                       </p>
                    </section>
                </div>
            </div>
            
        </div>
    );   
}