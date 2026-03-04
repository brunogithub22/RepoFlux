import { DriveFile } from "@/components/intefaces";
import { useState,useEffect } from "react";
import {Check,FileCode} from "lucide-react"

export default function LoadFile({ onClose, onSave}: { onClose: () => void, onSave: (file: DriveFile) => void}){
    
    useEffect(()=>{
        fetchVideos();
    },[]);
    
    const [loading, setLoading] = useState(false); 
    const [files,setFiles] = useState<DriveFile[]>([]); 
    const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);  
    
    const fetchVideos = async () => {
      setLoading(true);
      const res = await fetch('/api/drive');
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to view file");
      }
      const data = result.files;
      setFiles(data);
      setLoading(false);
    };

    const toggle = async (file:DriveFile) =>{
        if(file.id === selectedFile?.id){
            setSelectedFile(null)
        }else{
            setSelectedFile(file);
        }
    }
    
    return(
        <div className="flex-1 p-6">
          {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-video bg-zinc-800 animate-pulse rounded-xl" />)}
                </div>
            ) : (
                <div>
                    {files.length === 0 ? (
                      <div>
                        <span className="text-sm font-medium border-b border-zinc-800 group-hover:border-zinc-400 transition-all">
                          You don't have file uploaded
                        </span>     
                      </div>
                    ): (
                        <div>
                          <div className="overflow-y-auto max-h-[40vh] p-6 custom-scrollbar grid grid-cols-2 md:grid-cols-3 gap-4">
                            {files.map((file, index) =>{
                                const isSelected = file === selectedFile;
                                return(                 
                                  <div 
                                    key={file.id} 
                                    className="cursor-pointer group relative flex flex-col items-center" 
                                    onClick={() => {toggle(file)}}
                                  >
                                    {/* ICON CONTAINER — gives the absolute circle a reference */}
                                    <div className={`relative w-16 h-16 rounded-xl flex items-center justify-center transition-all
                                       ${isSelected ? 'bg-blue-500/20 ring-2 ring-blue-500' : 'bg-white/5 group-hover:bg-white/10'}`}
                                    >
                                       {/* THE SELECTOR CIRCLE */}
                                        <div className={`absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                           ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-black/20 border-white/50 backdrop-blur-md'}`}
                                        >
                                          {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                                        </div>
                                        <FileCode size={45} />
                                    </div>

                                    {/* FILE NAME */}
                                    <span className="text-xs text-white/70 max-w-[70px] truncate text-center">
                                      {file.name}
                                    </span>
                                  </div>
                                )
                              })}  
                            </div>  
                            <div className={`p-6 border-t border-zinc-800 flex 'justify-between'  items-center bg-zinc-900/50`}>
                              <div className="flex gap-3">
                                <button 
                                  disabled={selectedFile === null}
                                  onClick={() => setSelectedFile(null)} 
                                  className="cursor-pointer text-sm text-zinc-500 hover:text-white"
                                >
                                   Clear
                                </button>
                                
                                
                                <button
                                  disabled={selectedFile === null} 
                                  onClick={() => {
                                   console.log("Selected File:", selectedFile);
                                   onSave(selectedFile as DriveFile);
                                   onClose();
                                   setSelectedFile(null);
                                 }}
                                 className="cursor-pointer px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl font-bold text-sm transition-colors"
                               >
                                 Add File
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