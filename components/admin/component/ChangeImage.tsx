import { Image } from "lucide-react";
import { useState } from "react";
import { Gallery,Block,Item } from "@/components/intefaces";
import LoadImage from "@/components/admin/component/AddImages";
import { Dispatch, SetStateAction } from 'react';

export default function ChangeImage({ onClose, indexBlock , indexImage, blocks, setBlocks }: { onClose: () => void, indexBlock:number, indexImage: number,blocks: Block[], setBlocks: Dispatch<SetStateAction<Block[]>>}){

    const [ChangeImage,setChangeImage] = useState(false);

    const changeImage = async (Item: Gallery[]) => {
      if (Item.length > 0) {
        setBlocks((prev) => {
          // 1. ADD 'return' HERE! This sends the NEW array to React.
          return prev.map((block, i) => {

            let updatedContent;
            let itemContent: Item[];

            if( i === indexBlock ){
                switch(block.type){
                    case "image":
                        updatedContent = Array.isArray(block.content) 
                          ? block.content.map((item, cont) => cont === indexImage ? Item[0] : item)
                          : block.content;
                        break;
                    case "link":
                        itemContent = [{name: "",icon: Item[0],link: ""}];
                        updatedContent = Array.isArray(block.content) 
                          ? block.content.map((item, cont) => cont === indexImage ? itemContent[0] : item)
                          : block.content;
                        break;
                    case "list":
                        itemContent = [{name: "",icon: Item[0]}];
                        updatedContent = Array.isArray(block.content) 
                          ? block.content.map((item, cont) => cont === indexImage ? itemContent[0] : item)
                          : block.content;
                        break;
                    default: 
                        break;
                }

                return {
                  ...block,
                  content: updatedContent
                }; 
            }

            // 2. IMPORTANT: You must return the original block if the 'if' fails
            return block; 
          }) as Block[];
          // 3. REMOVE 'return prev;' from here!
        }); 
      }
    };

    return(
        <div className="fixed w-full inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800  rounded-3xl max-w-4xl max-h-[85vh] shadow-2xl scale-in-center">      
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Image size={25}/>
                My Images
              </h2>
              <button onClick={() => onClose()} className="cursor-pointer hover:text-white text-zinc-500">Close</button>
            </div>
            <LoadImage onClose={() => onClose()} onSave={changeImage} isItem={true}/>
          </div>
        </div>
    );
}