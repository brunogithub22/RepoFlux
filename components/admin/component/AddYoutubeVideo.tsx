import { Gallery,LinkYoutube } from "@/components/intefaces";
import {ArrowUpRight,Plus,Youtube,ExternalLink} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function YoutubeVideo({ onClose, onSave }: { onClose: () => void, onSave: (video: Gallery[]) => void }){

    useEffect(()=>{
        fetchYoutube();
    },[]);

    const [loading, setLoading] = useState(false); 
    const [videoYoutube,setVideoYoutube] = useState<LinkYoutube[]>(); 

    const fetchYoutube = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/youtube');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch YouTube videos");
        }

        console.log("Success:", data);
        setVideoYoutube(data);
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
      } finally {
        setLoading(false);  // 👈 always runs, even if an error occurs
      }
    };

    return(
        <div className="flex-1 overflow-y-auto max-h-[40vh] p-6 custom-scrollbar">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-video bg-zinc-800 animate-pulse rounded-xl" />)}
              </div>
                ) : (
                      <div >
                        {videoYoutube?.length === 0 ? (
                          <div>
                             <Link 
                                href={process.env.CHANNEL_YOUTUBE_LINK!} 
                                className="group inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors duration-200"
                              >
                                <span className="text-sm font-medium border-b border-zinc-800 group-hover:border-zinc-400 transition-all">
                                  Upload a video
                                </span>
                                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                              </Link>
                          </div>
                        ): (
        
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {videoYoutube?.map(video =>(
                            <div key={video.id}>
                              <button
                                onClick={() => {
                                  const contents: Gallery[] = [{id: video.id,link: video.embedUrl , text: ""}]; 
                                  onSave(contents);
                                  onClose();
                                }}
                                className="cursor-pointer group flex flex-col gap-3 text-left focus:outline-none"
                               >
                               {/* THUMBNAIL CONTAINER */}
                                <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group-hover:border-red-500 group-focus:ring-2 group-focus:ring-red-500 transition-all duration-300">
                                  <img 
                                    src={video.thumbnail} 
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                  />
                    
                                  {/* OVERLAY ON HOVER */}
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <div className="bg-red-600 text-white p-3 rounded-full shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                      <Plus size={24} />
                                    </div>
                                  </div>
                                </div>
                              </button>
                          
                              {/* VIDEO INFO */}
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-zinc-300 group-hover:text-white line-clamp-2 leading-snug">
                                  {video.title}
                                </h4>
                                <a 
                                  href={video.videoUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-medium hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all group"
                                >
                                  <Youtube size={16} className="text-zinc-500 group-hover:text-red-500 transition-colors" />
                                  <span>View on YouTube</span>
                                  <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
                                </a>
                              </div>
                            </div>    
                          ))}
                          </div>
                        )}  
                      </div>
                     )}
                    </div>
    );
}