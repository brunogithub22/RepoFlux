import { useState } from "react";

interface Item{
  category?: string;
  name: string;
  link?: string | null;
  icon: string;
}


// Child component (ShowItem.tsx)
export default function ShowItem({ onClose, onSave }: { onClose: () => void, onSave: (item: Item) => void }) {
 
  const [name,setName] = useState<string>("");
  const [icon,setIcon] = useState<string>("");
  const [link,setLink] = useState<string | null>(null);  


  const handleClick = async () =>{
    onSave({name: name, category: "",icon: icon, link: link});
    

    onClose();
  }
  
  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-md">
        <h2 className="text-white text-xl mb-4">Add New Item</h2>
        
        {/* Your Form Inputs would go here */}
        <input className="w-full bg-black p-3 rounded-lg mb-4" placeholder="Name..." />

        <button 
          onClick={handleClick}
          className="cursor-pointer w-full bg-blue-600 text-white p-3 rounded-xl font-bold"
        >
          Save and Close
        </button>
      </div>
    </div>
  );
}