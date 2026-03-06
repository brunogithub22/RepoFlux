import { Gallery } from "@/components/intefaces";
import {Check} from "lucide-react";
import { useEffect, useState } from "react";
import { CldImage } from 'next-cloudinary';

export default function LoadImage({ onClose, onSave, isItem }: { onClose: () => void, onSave: (images: Gallery[]) => void ,isItem: boolean}){

    useEffect(()=>{
        fetchImage();
    },[])

    const [selectedImages, setSelectedImages] = useState<Gallery[]>([]);  
    const [IMAGES, setIMAGES] = useState<Gallery[]>([]);
    const [loading, setLoading] = useState(false);  
    
    const toggleSelection = async (img: Gallery) => {
      if(isItem === true && selectedImages.length>0){
        setSelectedImages(prev => 
         prev.includes(img) ? [] : [img]
        );
      }else{
        setSelectedImages(prev => 
         prev.includes(img) ? prev.filter(item => item !== img) : [...prev, img]
        );
      }
      
    };

    const fetchImage = async () =>{
      const actionName = "getImages"; // The "function name" your API expects
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

    return(
        <div className="flex-1 p-6">
          {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-video bg-zinc-800 animate-pulse rounded-xl" />)}
                </div>
            ) : (
                <div>
                    {IMAGES.length === 0 ? (
                      <div className="group cursor-pointer relative w-full rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-12 transition-all hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-500/5">
                        <div className="flex flex-col items-center justify-center text-center">
    
                          {/* Animated Icon Layer */}
                          <div className="relative mb-4">
                            <div className="absolute -inset-1 rounded-full bg-blue-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="relative p-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 text-zinc-400 group-hover:text-blue-500 transition-colors">
                                <svg 
                                  className="w-8 h-8" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor" 
                                  strokeWidth={1.5}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                              </div>
                            </div>

                            {/* Typography */} 
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                              No images yet
                            </h3>

                          </div>
                        </div>
                    ): (
                        <div>
                          <div className="overflow-y-auto max-h-[40vh] p-6 custom-scrollbar grid grid-cols-2 md:grid-cols-3 gap-4">
                            {IMAGES.map((img, index) =>{
                                const isSelected = selectedImages.includes(img);
                                return(                 
                                  <div 
                                   key={img.id} 
                                   className="cursor-pointer group relative flex flex-col items-center" 
                                   onClick={() => toggleSelection(img)}
                                  >
                                    {/* THE SELECTOR CIRCLE */}
                                    <div className={` absolute top-2 right-2 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                      ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-black/20 border-white/50 backdrop-blur-md'}`}
                                    >
                                      {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                                    </div>
                                    <CldImage
                                      src={img.link} 
                                      alt ={img.link}
                                      width={400} 
                                      height={400}
                                      crop="fit"
                                      className=" object-cover transition-transform duration-300 group-hover:scale-101" 
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                  </div>
                                )
                              })}  
                            </div>  
                            <div className={`p-6 border-t border-zinc-800 flex ${isItem ? 'justify-center' : 'justify-between'}  items-center bg-zinc-900/50`}>
                              {!isItem && (
                                <p className="text-sm text-zinc-400">
                                  {selectedImages.length} assets selected
                                </p>
                              )}
                              <div className="flex gap-3">
                                {!isItem &&(
                                  <button 
                                    onClick={() => setSelectedImages([])} 
                                    className="cursor-pointer text-sm text-zinc-500 hover:text-white"
                                  >
                                    Clear
                                  </button>
                                )}
                                
                               <button 
                                 disabled={selectedImages.length === 0}
                                 onClick={() => {
                                   console.log("Selected Images:", selectedImages);
                                   onSave(selectedImages);
                                   onClose();
                                   setSelectedImages([]);
                                 }}
                                 className="cursor-pointer px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl font-bold text-sm transition-colors"
                               >
                                 Add Assets
                              </button>
                             </div>
                            </div>
                          </div>
                          
                        )}
                  </div>
             )}
        </div>
        
    );
}