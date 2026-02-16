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
                      <div>
                        <span className="text-sm font-medium border-b border-zinc-800 group-hover:border-zinc-400 transition-all">
                          Empty, go to Content Upload 
                        </span>     
                      </div>
                    ): (
                        <div>
                          <div className="overflow-y-auto max-h-[40vh] p-6 custom-scrollbar grid grid-cols-2 md:grid-cols-3 gap-4">
                            {IMAGES.map((img, index) =>{
                                const isSelected = selectedImages.includes(img);
                                return(                 
                                  <div 
                                   key={img.public_id} 
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