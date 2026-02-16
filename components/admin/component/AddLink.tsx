import {Item} from "@/components/intefaces"
import { Trash2,Plus } from "lucide-react";
import ShowItem from '@/components/admin/component/AddItem';
import { useState } from "react";

export default function LoadLink({ onClose, onSave }: { onClose: () => void, onSave: (link: Item[]) => void }){

    const getData = async (newItem: Item) => {
        console.log(newItem);
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
                        <img src={item.icon} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    <div className="flex-1">
                       <p className="text-white font-medium">{item.name}</p>
                       <p className="text-zinc-500 text-xs truncate max-w-50">{item.link}</p>
                    </div>
                    <button className="text-zinc-600 hover:text-red-400 p-2">
                        <Trash2 size={18} />
                    </button>
                 </div>
                ))
               ) : (
                 <div className="text-center py-10 text-zinc-600">No links added yet.</div>
               )}
            </div>
                <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
                    <button 
                        onClick={() => setShowFormLink(true)} // This opens your input form
                        className="cursor-pointer w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                    >
                        <Plus size={20} />
                        Add New Link
                    </button>
                </div>
        
                {showFormLink && (
                    <ShowItem onClose={() => setShowFormLink(false)} onSave={getData}  />
                )}
        </div>
    );

}