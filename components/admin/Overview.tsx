'use client'
import { useState, useEffect } from 'react';
import { FileText, Eye, MessageSquare, Plus,
         LucideIcon,ShieldXIcon,ExternalLink,
         Edit3,Trash2,CheckCircle2,CircleAlert,Share,
         Unlink  } from 'lucide-react';
import { BasePost } from '@/components/intefaces';

// --- Main Component: Overview (Self-Fetching) ---
export default function Overview({ onNavigate, onViewPost }: {onNavigate?: (tab: string) => void; onViewPost: (post: BasePost,name: string) => void;}) {
  // 1. Initialize state inside the component
  const [posts, setPosts] = useState<BasePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [result,setResult] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "success" | "warning" | "error">("idle");
  const [numPublish,setNumPublish] = useState<number>(0);

  // 2. Fetch data on mount
  useEffect(() => {
    getPost();
  }, []); 

  const getPost = async () =>{
      const actionName = "getPosts";
      try {
        const response = await fetch('/api/drizzle/helper/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actionName, payload: {} }),
        });
        const result = await response.json();
        if (response.ok) {
          setPosts(result.result);
          const posts = Array.isArray(result.result) ? result.result: [];
          posts.map((post: BasePost)=>{
            if(post.published){
              setNumPublish((prev)=>{return prev+1;})
            }
          })
          console.log(result.result)
          setResult(true);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user languages:", error);
      }
    }

  const removePost = async (post: BasePost) =>{
    const actionName = "removePost";
      try {
        const response = await fetch('/api/drizzle/helper/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actionName, payload: { post: post } }),
        });
        const result = await response.json();
        if (response.ok) {
          if(result.result.success){
            await getPost();
            setMessage('Post successfully removed!');
            setState("success");
          }else{
            setMessage('Something went wrong!');
            setState("error");
          }
          setShowSuccess(true);
        }
      } catch (error) {
        console.error("Error fetching user languages:", error);
      }
  }

  const publish = async (publish: BasePost) =>{
    const data = !publish.published;
    const actionName = "publish";
      try {
        const response = await fetch('/api/drizzle/helper/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actionName, payload: { publish: publish } }),
        });
        const result = await response.json();
        if (response.ok) {
          if(result.result.message){
            setPosts((prev)=>prev.map((post)=>{
              if(post.id === publish.id){
                return {...post, published: !publish.published}
              }
              return post;
            }))
            if(!publish.published){
              setNumPublish((prev)=>{return prev+1;})
            }else{
              setNumPublish((prev)=>{return prev-1;})
            }
            console.log("Result: ", publish);
          }else{
            setMessage('Something went wrong!');
            setState("error");
            setShowSuccess(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user languages:", error);
      }
  }

  // 3. Loading State (Crucial for UX)
  if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-black">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
         <p className="ml-4 text-white">Loading your post...</p>
        </div>
      ); 
    }

  // Derived stats
  const totalPosts: number = posts.length;
  
  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-zinc-100 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* 1. Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Posts" value={posts.length} Icon={FileText} color="text-blue-400" />
        <StatCard title="Published"  value={numPublish} Icon={Eye} color="text-emerald-400" />
      </div>

      {result ? (
        <>
          {totalPosts !== 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-zinc-800/30 text-zinc-400 text-xs uppercase">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Status</th>
                    <th className='p-4'>View</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-zinc-800/40">
                      {/* Upgraded Status to a Badge */}
                      <td className="p-4 font-medium text-zinc-200">{post.title}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                post?.published 
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                  : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                              }`}>
                          { post?.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="p-4">
                        <button 
                          className="cursor-pointer flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors text-sm font-semibold group/btn"
                          onClick={()=>{onViewPost(post,"view");}}
                        >
                          <ExternalLink size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button  
                            onClick={()=>{publish(post)}}
                            title="Publish Post"
                            className="cursor-pointer p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all active:scale-90"
                          >
                            { post?.published ? (
                              <Unlink size={18} />
                            ): (
                              <Share size={18} />
                            )}
                            
                          </button>   
                          
                          <button  
                            onClick={()=>{onViewPost(post,"modify");}}
                            title="Edit Post"
                            className="cursor-pointer p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all active:scale-90"
                          >
                            <Edit3 size={18} />
                          </button>   
                          <button 
                            onClick={()=>{removePost(post)}}
                            title="Delete Post"
                            className="cursor-pointer p-2 hover:bg-zinc-800 text-zinc-500 hover:text-red-400 rounded-lg transition-all active:scale-90"
                          >
                            <Trash2 size={18} />
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ): (
            /* THE COMPLETED EMPTY STATE */ 
            <div className="flex flex-col items-center justify-center p-20 bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-3xl text-center">
              <div className="bg-zinc-800 p-4 rounded-2xl mb-4 text-zinc-500">
                <FileText size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3> 
              <p className="text-zinc-500 text-sm max-w-xs mb-8">
                Your dashboard is looking a bit lonely. Start by creating your very first technical post.
              </p>
              <button 
                onClick={() => onNavigate?.('post')}
                className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20"
              >
                <Plus size={18} /> Create First Post
              </button>
            </div>
          )}
        
        </>
      ): (
        <div className="flex flex-col items-center justify-center p-16 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl">
          <div className="bg-red-500/10 p-4 rounded-full mb-4">
            <ShieldXIcon size={40} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Data Unavailable</h3>
          <p className="text-zinc-400 text-sm mb-6 max-w-xs text-center">
            We couldn't retrieve the dashboard data. This might be due to a connection issue or a server error.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="cursor-pointer bg-zinc-100 text-zinc-950 px-6 py-2 rounded-xl font-bold hover:bg-white transition-all active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      )}
      
      {/* CUSTOM SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full shadow-2xl scale-in-center">
            <div className="flex flex-col items-center text-center">

              {state === "success"  ? (
                <div className="bg-green-500/10 p-4 rounded-full mb-4">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>
              ):(
                state === "warning" ?(
                  <div className="bg-yellow-500/10 p-4 rounded-full mb-4">
                    <CircleAlert size={48} className="text-yellow-500" />
                  </div>
                ):(
                  <div className="bg-red-500/10 p-4 rounded-full mb-4">
                    <ShieldXIcon size={48} className="text-red-500" />
                  </div>
                )
              )}
              
              <p className="text-zinc-400 mb-6">
                {message}
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

    
  );
}

// StatCard stays the same as before...
function StatCard({ title, value, Icon, color }: { title: string, value?: number, Icon: LucideIcon, color: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex items-center gap-4">
      <div className={`p-3 bg-zinc-800 rounded-lg ${color}`}><Icon size={24} /></div>
      <div>
        <p className="text-zinc-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}