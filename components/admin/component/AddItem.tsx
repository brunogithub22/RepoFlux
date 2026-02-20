import {  useState } from "react";
import {Item,Gallery} from "@/components/intefaces"
import { X, Save,ImagePlus,Image,Trash2} from "lucide-react";
import LoadImage from "./AddImages";
import { CldImage } from 'next-cloudinary';


export default function ShowItem({isLink ,onClose, onSave }: {isLink: boolean, onClose: () => void, onSave: (item: Item) => void }) {
 
  const [name,setName] = useState<string>("");
  const [showDialogImage, setShowDialogImage] = useState(false);
  const [isImageSet,setIsImageSet] = useState(false);
  const [icon,setIcon] = useState<Gallery>({id: "",link: ""});
  const [link,setLink] = useState<string>();  

  const getIcon = async (Item: Gallery[]) => {
    setIcon(Item[0]);
    setIsImageSet(true);
  }

  const handleClick = async () =>{
    onSave({name: name,icon: icon, link: link,idImage: icon.id});
    onClose();
  }

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header with Close Icon */}
        <div className="flex justify-between items-center p-8 pb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">New Item</h2>
          <button onClick={onClose} className="cursor-pointer p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 pt-0 space-y-6">
          {/* Image Upload Area */}
          <div className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-3xl transition-all  overflow-hidden">
            {isImageSet ? (
              <div>
                <CldImage
                  src={icon.link}
                  alt ={icon.id}
                  width={400}
                  height={400}
                  crop="fit"
                  className="object-cover h-auto w-auto "
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="cursor-pointer absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIcon({ id: "", link: "" });
                      setIsImageSet(false);
                    }}
                    className="cursor-pointer absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg 
                                opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2.5 group-hover:translate-y-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="cursor-pointer flex flex-col items-center gap-2 text-zinc-500 group-hover:text-blue-400"
                onClick={() => {setShowDialogImage(true)}}
              >
                <ImagePlus size={30}/>
              </div>
            )}

            {showDialogImage && (
              <div className="fixed w-full inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-zinc-900 border border-zinc-800  rounded-3xl max-w-4xl max-h-[85vh] shadow-2xl scale-in-center">      
                  <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Image size={25}/>
                      My Images
                     </h2>
                    <button onClick={() => setShowDialogImage(false)} className="cursor-pointer hover:text-white text-zinc-500">Close</button>
                  </div>
                  <LoadImage onClose={() => setShowDialogImage(false)} onSave={getIcon} isItem={true}/>
                </div>
              </div>
            )}
          </div>

          {/* Text Inputs */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Item Name</label>
            <input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
              placeholder="e.g. Something" 
            />
          </div>

          {isLink && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Item Link</label>
              <textarea
                id="link"
                rows={2} 
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="resize-none w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                placeholder="e.g. https://......" 
              />
            </div>

          )}
          
          {/* Action Button */}
          <button 
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-900/30 active:scale-[0.98]"
            onClick={handleClick}
          >
            <Save size={20} />
            Save Item
          </button>
        </div>
      </div>
    </div>
  );
}