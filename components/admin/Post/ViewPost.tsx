import { LanguageType, post,Block, Gallery } from "@/components/intefaces";
import { Calendar,Globe,ChevronLeft,ChevronRight } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { useState } from "react";

export default function ViewPost({Post, onNavigate }: {Post?: post, onNavigate?: (tab: string) => void;}){

    const lang: LanguageType[] = Array.isArray(Post?.languages) ? Post?.languages: [];
    const content: Block[] = Array.isArray(Post?.content) ? Post?.content : [];
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
        <div className="w-full flex flex-col justify-center py-5">
            {content.map((block, index) => {
              const blockKey = `block-${index}`;

              switch (block.type) {
                case 'image':
                  const listImage:Gallery[] = block.content as Gallery[]; 
                  const activeImage: string = listImage.length > 1 
                    ? listImage[selectedIdx].link.toString() 
                    : listImage[0].link.toString();
                  const currentIndex = listImage.findIndex(img => img.link === activeImage);
                  const currentCaption = listImage[currentIndex]?.text || "";
                  return (
                    <div key={blockKey} className="relative max-w-4xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-950 mb-2">
                      {listImage.length > 1 && (
                        <>
                          <div className="absolute inset-0 flex items-center justify-between p-4 z-20 pointer-events-none">
                            <button 
                              onClick={() => prevImage(listImage.length)} 
                              className="pointer-events-auto p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-all active:scale-90"
                            >
                              <ChevronLeft size={24} />
                            </button>

                            <button 
                              onClick={() => nextImage(listImage.length)} 
                              className="pointer-events-auto p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-all active:scale-90"
                            >
                              <ChevronRight size={24} />
                            </button>
                          </div>

                          <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-xl rounded-full border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                            {currentIndex + 1} / {listImage.length}
                          </div>
                        </>
                      )}

                      <div key={activeImage} className="relative flex flex-col items-center">
                        <CldImage
                          src={activeImage}
                          alt="Gallery Image"
                          width={800}
                          height={600}
                          crop={"fit"}
                          className="w-full h-auto object-contain max-h-[70vh]"
                          sizes="(max-width: 768px) 100vw, 800px"
                        />
    
                        <div className="w-full p-4 bg-zinc-900/50 border-t border-zinc-800">
                          <p className="text-sm text-zinc-400 text-center italic">
                            {currentCaption || "No description provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );

                default:
                  return <div key={blockKey} className="text-zinc-500 text-xs">Unsupported block type: {block.type}</div>;
              }
            })}
        </div>
        
      </div>
    );   

}