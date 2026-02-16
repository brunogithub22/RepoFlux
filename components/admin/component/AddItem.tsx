import { useState } from "react";
import {Item,CloudinaryUploadInfo} from "@/components/intefaces"
import { CldUploadWidget } from 'next-cloudinary';
import { X, Save} from "lucide-react";


// Child component (ShowItem.tsx)
export default function ShowItem({ onClose, onSave }: { onClose: () => void, onSave: (item: Item) => void }) {
 
  const [name,setName] = useState<string>("");
  const [isImageSet,setIsImageSet] = useState(false);
  const [icon,setIcon] = useState<string>("");
  const [link,setLink] = useState<string | null>(null);  

  const handleClick = async () =>{
    onSave({name: name,icon: icon, link: link});
    onClose();
  }

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header with Close Icon */}
        <div className="flex justify-between items-center p-8 pb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Add New Item</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 pt-0 space-y-6">
          {/* Image Upload Area */}
          <div className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-3xl transition-all cursor-pointer overflow-hidden">
            {isImageSet ? (
              <div></div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-500 group-hover:text-blue-400">
              </div>
            )}
            
          </div>

          {/* Text Inputs */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Item Name</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
              placeholder="e.g. Vintage Camera" 
            />
          </div>

          {/* Action Button */}
          <button 
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-900/30 active:scale-[0.98]"
          >
            <Save size={20} />
            Save Item
          </button>
        </div>
      </div>
    </div>
  );
}