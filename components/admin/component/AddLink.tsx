import {Item} from "@/components/intefaces"
import { Trash2,Plus,PenLine } from "lucide-react";
import ShowItem from '@/components/admin/component/AddItem';
import { useState } from "react";
import { CldImage } from 'next-cloudinary';

export default function LoadLink({ onClose, onSave }: { onClose: () => void, onSave: (link: Item[]) => void }){

    const getData = async (newItem: Item) => {
        setlinkItem(prev=> [...prev,newItem]);
    }

    const handleCreate = async ()=>{
        if(linkItem.length > 0){
            onSave(linkItem);
            onClose();
        }
    }

    const [linkItem, setlinkItem] = useState<Item[]>([]);
    const [showFormLink,setShowFormLink] = useState(false);

    return(
        <div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {linkItem.length > 0 ? (
                 linkItem.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-800/30 border border-zinc-800 hover:border-zinc-700 transition-all">
                      <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
                        <CldImage
                           src={item.icon.link}
                           alt ={item.name}
                           width={400}
                           height={400}
                           crop="fit"
                           className="object-cover h-auto w-auto "
                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      </div>
                    <div className="flex-1">
                       <p className="text-white font-medium">{item.name}</p>
                       <p className="text-zinc-500 text-xs truncate max-w-50">{item.link}</p>
                    </div>
                    <button 
                        className="text-zinc-600 hover:text-red-400 p-2 cursor-pointer"
                        onClick={() => setlinkItem(linkItem.filter((_, i) => i !== idx))}
                    >
                        <Trash2 size={18} />
                    </button>
                 </div>
                ))
               ) : (
                 <div className="text-center py-10 text-zinc-600">No link added yet.</div>
               )}
            </div>
            <div className="p-6 border-t border-zinc-800/50 bg-zinc-900/90 backdrop-blur-xl flex gap-3 items-center justify-center">
                {/* The '+' Square Button (Secondary) */}
                <button 
                  onClick={() => setShowFormLink(true)}
                  className="cursor-pointer h-14 w-14 flex items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700 hover:border-zinc-600 transition-all active:scale-90"
                  title="New Item"
                >
                  <Plus size={24} />
                </button>

                {/* The 'Create' Long Button (Primary) */}
                <button 
                    onClick={() => handleCreate()}
                    className="cursor-pointer w-14 h-14 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                    title="Create"
                >
                    <PenLine size={24} />
                </button>
            </div>
        
            {showFormLink && (
                <ShowItem isLink={true} onClose={() => setShowFormLink(false)} onSave={getData}  />
            )}
        </div>
    );

}