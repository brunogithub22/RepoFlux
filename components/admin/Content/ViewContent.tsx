'use client';

import { useEffect, useState,useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Trash2,Loader2,CheckCircle2,CircleAlert,ShieldXIcon } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import {GalleryImage} from "@/components/intefaces"


export default function ViewContent() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [languages, setLanguages] = useState<string[]>([]);
  const [IMAGES, setIMAGES] = useState<GalleryImage[]>([]);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);  
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "warning" | "success" | "error">("idle");
    

  const fetchImages = useCallback(async () => {
    setLoading(true);   
    const actionName = "getImages"; // The "function name" your API expects
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
  }, []);

  async function handleDelete(id: string) {

    let test = false;
    let actionName = "checkImage";
    try {  
      const response = await fetch('/api/drizzle/helper/admin', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionName: actionName,
          payload: { image:  id} 
        }),
      });
  
      const result = await response.json();
    
      if (!response.ok) {
        throw new Error(result.error || "Failed to api ");
      }

      if(result.result.message){
        test = true;
      }else{
        setMessage("This image is used in a post");
        setState("warning");
        setShowSuccess(true);
      }
      
    } catch (error) {
      console.error("Error calling API:", error);
    }

    actionName = "removeImage"; // The "function name" your API expects
    if(test){
      try {  

        await Promise.all([
          fetch('/api/claudinary/removeImage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId: id }),
          }) 
          .then((res) => {
            if (!res.ok) throw new Error("Delete failed from claudinary"); 
              return res.json();
          }).then((data) => {
            console.log(data);
          })
          .catch((err) => console.error(err)),
        
          fetch('/api/drizzle/helper/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              payload: { publicId: id },
              actionName: actionName
            })
          }) 
          .then((res) => {
            if (!res.ok) throw new Error("Delete failed from database"); 
              return res.json();
          }).then((data) => {
            console.log(data);
          })
          .catch((err) => console.error(err))
        ]);

        await fetchImages();
      } catch (error) {
        console.error("Error calling API:", error);
      }
    }
  }

  useEffect(()=>{
    fetchImages();
  },[fetchImages]);

  const openImage = async (index: number) => setSelectedIdx(index);
  const closeImage = async () => setSelectedIdx(null);
  const nextImage = async () => setSelectedIdx((prev) => (prev !== null ? (prev + 1) % IMAGES.length : null));
  const prevImage = async () => setSelectedIdx((prev) => (prev !== null ? (prev - 1 + IMAGES.length) % IMAGES.length : null));

  return (
    
    <div className="p-6">
      {loading ? 
            (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-video bg-zinc-800 animate-pulse rounded-xl" />)}
                </div>
            ) : (
              <div>
                {IMAGES.length === 0 ? (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">No images found. Please upload some content to view it here.</p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">Media Gallery</h2>
                    {/* 1. THE GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {IMAGES.map((img, index) => (
                        <div 
                          key={img.id} 
                          className="group relative flex flex-col items-center"
                          onClick={() => openImage(index)}
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
                          {/* Overlay Layer */}
                          <div className="cursor-pointer absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-4">
                            {/* View Icon */}
                            <Maximize2 className=" text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                            {/* DELETE BUTTON */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageToDelete(img.id);
                              }}
                              className="cursor-pointer absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg 
                                opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2.5 group-hover:translate-y-0"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      )
                    )
                  }
            </div>

            {/* 2. THE MODAL (LIGHTBOX) */}
            {selectedIdx !== null && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
                <button onClick={closeImage} className="cursor-pointer absolute top-6 right-6 text-white hover:text-gray-300 z-50">
                 <X size={32} />
                </button>
          
                <button onClick={prevImage} className="cursor-pointer z-51 absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                 <ChevronLeft size={48} />
                </button>

                <div className="relative w-[90vw] h-[80vh] z-50">
                  <CldImage
                    src={IMAGES[selectedIdx].link}
                    alt={IMAGES[selectedIdx].link}
                    fill
                    preserveTransformations // Keeps original aspect ratio
                    className="object-contain"
                  />

                </div>

                <button onClick={nextImage} className="cursor-pointer z-51 absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                 <ChevronRight size={48} />
                </button>
              </div>
            )}

          </div>
          
        )
      }
              </div>
            )}
      
      
      {imageToDelete && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl scale-in-center">
             <div className="flex flex-col items-center text-center">
                <div className="bg-red-500/10 p-3 rounded-full mb-4">
                  <Trash2 size={32} className="text-red-500" />
                </div>
        
                <h3 className="text-xl font-bold text-white mb-2">Delete Image?</h3>
                <p className="text-zinc-400 mb-6 text-sm">
                  This action cannot be undone. This image will be permanently removed from your gallery.
                </p>
        
                <div className="flex gap-3 w-full">
                <button
                  disabled={isDeleting}
                  onClick={() => setImageToDelete(null)}
                  className="cursor-pointer flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={isDeleting}
                  onClick={async () => {
                    setIsDeleting(true);
                    await handleDelete(imageToDelete);
                    setIsDeleting(false);
                    setImageToDelete(null);
                  }}
                  className="cursor-pointer flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Delete"}
                </button>
              </div>
            </div>
          </div>
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
              
              <h3 className="text-xl font-bold text-white mb-2">{message}</h3>
              
              <button
                onClick={() => setShowSuccess(false)}
                className="cursor-pointer w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
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