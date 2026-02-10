"use client";
import { useState } from "react";
import Link from "next/link";
import { CldImage } from 'next-cloudinary';
import { Plus, Type, ImageIcon, Video,Trash2,Youtube,ExternalLink,ArrowUpRight,Image} from "lucide-react";

interface LinkYoutube{
  id: string,
  title: string,
  thumbnail: string,
  videoUrl: string,
  embedUrl: string
}

interface Block{
  type: string
  content: string
}

interface GalleryImage {
  id: string;
  link: string;
  public_id: string;
}

export default function Post() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [content, setContent] = useState("");
  const [mediaImage, setMediaImage] = useState(false);
  const [IMAGES, setIMAGES] = useState<GalleryImage[]>([]);
  const [mediaVideo, setMediaVideo] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoYoutube,setVideoYoutube] = useState<LinkYoutube[]>();

  const fetchVideos = async () => {
    setMediaVideo(true);
    setLoading(true);
    const res = await fetch('/api/youtube');
    const data = await res.json();
    setVideoYoutube(data);
    setLoading(false);
  };

  const fetchImage = async () =>{
    const actionName = "getImages"; // The "function name" your API expects
    setMediaImage(true);
    setLoading(true);
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
      console.log("Success:", result);
      setIMAGES(result.result);
    } catch (error) {
      console.error("Error calling API:", error);
    }
    setLoading(false);
  }

  
  // Add a Text Block
  const addTextBlock = () => {
    setBlocks([...blocks, { type: "textBlock", content: "" }]);
  };

  // Add a Text Block
  const addTextAreaBlock = () => {
    setBlocks([...blocks, { type: "textAreaBlock", content: "" }]);
  };

  const closeDropdown = () => {
    if(open){
      setOpen(false);
    }
  }


  return (
    <div onClick={closeDropdown} className=" mx-auto p-10 space-y-10 bg-zinc-950 text-zinc-200 min-h-screen font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-end border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight" >{title=="" ? "Project Title": title}</h1>
          <p className="text-zinc-500 text-sm">{description == "" ? "Describe the high-level process..." : description}.</p>
        </div>
        <button className="cursor-pointer px-5 py-2 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition text-sm">
          Publish
        </button>
      </header>

      {/* SCROLLABLE CONTENT AREA */}
      <div className="overflow-y-auto max-h-[60vh] pr-4 space-y-5 custom-scrollbar">
        {/* METADATA SECTION */}
        <section className="space-y-4">
          <input
            type="text"
            placeholder="Project Title"
            onChange={(e)=>setTitle(e.target.value)}
            className="w-full bg-transparent text-4xl font-bold placeholder:text-zinc-800 outline-none border-none focus:ring-0"
          />
          <textarea
            onChange={(e)=>setDescription(e.target.value)}
            placeholder="Describe the high-level process..."
            className="w-full bg-transparent text-zinc-400 placeholder:text-zinc-800 outline-none border-none focus:ring-0 resize-none"
            rows={2}
          />
        </section>

        {/* DYNAMIC BLOCKS */}
        <div className="space-y-2">
          {blocks.map((block, index) => (
            <div key={index} className="group relative p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all">
              <div className="absolute -left-10 top-6 text-xs font-mono text-zinc-700">0{index + 1}</div>
              
              {/* DELETE BUTTON (Visible on Hover) */}
              <button onClick={()=>setBlocks(blocks.filter((_, i) => i !== index))} className="cursor-pointer absolute -right-3 -top-3 p-2 bg-red-900/20 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-900/40">
                <Trash2 size={14} />
              </button>

              {block.type === "textBlock" && (
                <input
                  className="w-full bg-transparent outline-none text-zinc-300 leading-relaxed resize-none"
                  placeholder="Enter text content..."
                  value={block.content}
                  onChange={(e) => {
                    const newBlocks = [...blocks];
                    newBlocks[index].content = e.target.value;
                    setBlocks(newBlocks);
                  }}
                />
              )}

              {block.type === "textAreaBlock" && (
                <textarea
                  className="w-full bg-transparent outline-none text-zinc-300 leading-relaxed resize-none"
                  placeholder="Enter text area content..."
                  rows={5}
                  value={block.content}
                  onChange={(e) => {
                    const newBlocks = [...blocks];
                    newBlocks[index].content = e.target.value;
                    setBlocks(newBlocks);
                  }}
                />
              )}

              {block.type === "youtube" && (
                <div className="rounded-xl overflow-hidden border border-zinc-800">
                   <iframe 
                     src={block.content} 
                     className="w-full aspect-video rounded-xl"
                    />
                </div>
              )}

              {block.type === "image" && (
                <div className="rounded-xl overflow-hidden border border-zinc-800">
                   <img src={block.content} className="w-full object-cover" alt="Asset" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING TOOLBAR */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center pt-1.5">
        <button 
          onClick={() => setOpen(!open)} 
          className={`
            cursor-pointer flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all shadow-xl
            ${open ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}
          `}
        >
          <Plus size={18} className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
          Add Content
        </button>

        {/* BEAUTIFUL DROPDOWN */}
        {open && (
          <div className="absolute bottom-full mb-4 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
            <p className="text-[10px] font-bold text-zinc-500 px-3 py-2 uppercase tracking-widest">Components</p>
            <div className="grid grid-cols-1 gap-1">
              <MenuButton icon={<Type size={16}/>} label="Text Block" onClick={() => {addTextBlock(); setOpen(false);}} />
              <MenuButton icon={<Type size={16}/>} label="Text Area Block" onClick={() => {addTextAreaBlock(); setOpen(false);}} />              
              <MenuButton icon={<ImageIcon size={16}/>} label="Cloudinary Media" onClick={() => {fetchImage(); setOpen(false);}} />
              <MenuButton icon={<Video size={16}/>} label="YouTube Video" onClick={() => {fetchVideos(); setOpen(false);}} />
            </div>
          </div>
        )}
      </div>

      {/* CUSTOM SUCCESS MODAL */}
      {mediaImage && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full shadow-2xl scale-in-center">
          
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Image size={25}/>
              My Images
            </h2>
            <button onClick={() => setMediaImage(false)} className="cursor-pointer hover:text-white text-zinc-500">Close</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-video bg-zinc-800 animate-pulse rounded-xl" />)}
              </div>
            ) : (
              <div>
                {IMAGES.length === 0 ? (
                  <div>
                    <span className="text-sm font-medium border-b border-zinc-800 group-hover:border-zinc-400 transition-all">
                      Empty, go to Content Upload 
                    </span>     
                  </div>
                ): (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {IMAGES.map((img, index) => (
                      <div 
                       key={img.public_id} 
                       className="group relative flex flex-col items-center" 
                      >
                        <CldImage
                         src={img.link} 
                         alt ={img.link}
                         width={400} 
                         height={400}
                         crop="fit"
                         className="object-cover transition-transform duration-300 group-hover:scale-101" 
                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
              </div>
            )}
          </div>

          </div>
        </div>
      )}

      {/* CUSTOM SUCCESS MODAL */}
      {mediaVideo && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col">
      
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">▶</span>
              RepoFlux Channel
            </h2>
            <button onClick={() => setMediaVideo(false)} className="cursor-pointer hover:text-white text-zinc-500">Close</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
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
                          setMediaVideo(false); 
                          setBlocks([...blocks, { type: "youtube", content: video.embedUrl }]);
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
        </div>
      </div>
    )}
    </div>
  );
}

// Helper Sub-component
function MenuButton({ icon, label, onClick }: { icon: any, label: string, onClick: any }) {
  return (
    <button 
      onClick={onClick}
      className="cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition"
    >
      <span className="text-zinc-600">{icon}</span>
      {label}
    </button>
  );
}


