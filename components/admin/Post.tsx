"use client";
import { useState } from "react";
import {Item,Block,Gallery,ImageChange} from "@/components/intefaces"
import LoadImage  from "@/components/admin/component/AddImages";
import LoadLink from "@/components/admin/component/AddLink";
import YoutubeVideo from "@/components/admin/component/AddYoutubeVideo";
import LoadList from "@/components/admin/component/AddList";
import { Plus, Type, ImageIcon, Image,Video,Trash2,ChevronLeft,ChevronRight,ShoppingBag, LinkIcon, ShoppingCart, List,Pencil} from "lucide-react";
import { CldImage } from 'next-cloudinary';
import ChangeImageComponent from "./component/ChangeImage";

export default function Post() {
  
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [mediaVideo, setMediaVideo] = useState(false);
  const [mediaLink,setMediaLink] = useState(false);
  const [mediaList,setMediaList] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [mediaImage, setMediaImage] = useState(false);
  const [ChangeImage,setChangeImage] = useState<ImageChange | null>(null);

  
  // Add a Text Block
  const addTextBlock = async () => {
    setBlocks([...blocks, { type: "textBlock", content: "" }]);
  };

  // Add a Text Block
  const addTextAreaBlock = async () => {
    setBlocks([...blocks, { type: "textAreaBlock", content: "" }]);
  };

  const addVideo = async (contents: Gallery[])=>{
    setBlocks([...blocks, { type: "youtube", content: contents}]);
  }

  const addImages = async (Item: Gallery[]) =>{
    setBlocks([...blocks,{type:"image",content: Item}])
  }

  const addLink = async (Item: Item[]) =>{
    setBlocks([...blocks,{type:"link",content: Item}])
  }

  const addList = async (Item: Item[]) =>{
    setBlocks([...blocks,{type:"list",content: Item}])
  }

  const nextImage = async (length: number) => {
    setSelectedIdx((prev) => {
      const nextIdx = (prev + 1) % length;
      return nextIdx;
    });
  };

  // Helper to handle the "Previous" logic
  const prevImage = async (length: number) => {
    setSelectedIdx((prev) => {
      const nextIdx = (prev - 1 + length) % length;
      return nextIdx;
    });
  };

  const publish = async () =>{
    const response = await fetch('/api/post', { // Use the path to your route.ts
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blog: blocks
        }),
      });
  
      const result = await response.json();
    
      if (!response.ok) {
        throw new Error(result.error || "Failed to add language");
      }

      console.log("Success:", result);

  };

  return (
    <div onClick={() => {if(open){ setOpen(false);}}} className=" mx-auto p-10 space-y-10 bg-zinc-950 text-zinc-200 min-h-screen font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-end border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight" >{title=="" ? "Project Title": title}</h1>
          <p className="text-zinc-500 text-sm">{description == "" ? "Describe the high-level process..." : description}.</p>
        </div>
        <button onClick={publish} className="cursor-pointer px-5 py-2 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition text-sm">
          Publish
        </button>
      </header>

      {/* SCROLLABLE CONTENT AREA */}
      <div className="overflow-y-auto max-h-[65vh] pr-4 space-y-5 custom-scrollbar">
        {/* METADATA SECTION */}
        <section className="space-y-4">
          <input
            type="text"
            placeholder="Project Title"
            onChange={(e)=>setTitle(e.target.value)}
            className="w-full bg-transparent text-4xl font-bold placeholder:text-zinc-800 outline-none border-none focus:ring-0"
          />
          <textarea
            onChange={(e)=>setDescription(e.target.value)}
            placeholder="Describe the high-level process..."
            className="w-full bg-transparent text-zinc-400 placeholder:text-zinc-800 outline-none border-none focus:ring-0 resize-none"
            rows={2}
          />

        </section>

        {/* DYNAMIC BLOCKS */}
        <div className="space-y-2">
          {blocks.map((block, index) => (
            <div key={index} className="group relative p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all">
              <div className="absolute -left-10 top-6 text-xs font-mono text-zinc-700">0{index + 1}</div>
              
              <button onClick={()=>setBlocks(blocks.filter((_, i) => i !== index))} className="cursor-pointer absolute -right-3 -top-3 p-2 bg-red-900/20 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-900/40">
                <Trash2 size={14} />
              </button>

              {block.type === "textBlock" && (
                <input
                  className="w-full bg-transparent outline-none text-zinc-300 leading-relaxed resize-none"
                  placeholder="Enter text content..."
                  value={block.content as string}
                  onChange={(e) => {
                    const newBlocks = [...blocks];
                    newBlocks[index].content = e.target.value;
                    setBlocks(newBlocks);
                  }}
                />
              )}

              {block.type === "textAreaBlock" && (
                <textarea
                  className="w-full bg-transparent outline-none text-zinc-300 leading-relaxed resize-none"
                  placeholder="Enter text area content..."
                  rows={5}
                  value={block.content as string}
                  onChange={(e) => {
                    const newBlocks = [...blocks];
                    newBlocks[index].content = e.target.value;
                    setBlocks(newBlocks);
                  }}
                />
              )}

              {block.type === "youtube" && (()=>{
                const contents = block.content as Gallery[];
                return(
                  <div className="rounded-xl overflow-hidden border border-zinc-800">
                    <iframe 
                     src={contents[0].link}  
                     className="w-full aspect-video rounded-xl"
                    />
                    <textarea
                      className="w-full mt-2 bg-zinc-900/50 p-3 rounded-lg outline-none text-zinc-300 leading-relaxed resize-none border border-zinc-700 focus:border-blue-500 transition-colors"
                      placeholder="Write a caption for this video..."
                      rows={2}
                      onChange={(e)=>{
                        const newBlocks = [...blocks];
                        const targetImage = newBlocks[index].content[0] as Gallery;
                        targetImage.text = e.target.value;
                        setBlocks(newBlocks);
                      }}
                    />
                  </div>
                )
              })()}

              {block.type === "image" && (() => {
                const listImage:Gallery[] = block.content as Gallery[];
                // 1. Determine which image to show based on content length
                const activeImage: string = listImage.length > 1 
                  ? listImage[selectedIdx].link.toString() 
                  : listImage[0].link.toString();
                // 2. Fallback check (Expert advice: always ensure the object exists)
                if (!activeImage?.link) return null;                
                return (
                    
                    <div className="flex flex-col gap-4 w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 p-4">
                      
                      <div className="relative w-full justify-center items-center flex  aspect-video rounded-lg overflow-hidden">
                        {listImage.length > 1 && (
                          <> 
                          {/* Container positioned in the top-right corner */}
                          <div className="absolute top-2 right-2 flex gap-2 z-10">
                             {/* EDIT BUTTON */}
                              <button 
                                onClick={() => setChangeImage({indexBLock: index, indexImage: selectedIdx})} 
                                className="cursor-pointer p-2 bg-blue-900/20 text-blue-400 rounded-full hover:bg-blue-900/40 border border-blue-500/20 transition-all" 
                                title="Edit item"
                              >
                                <Pencil size={14} />
                              </button>

                              {/* DELETE BUTTON */}
                              <button 
                                onClick={() => { 
                                  const newImage = listImage.filter((_,i) => i !== selectedIdx );
                                  const newBlocks = [...blocks]
                                  newBlocks[index].content = newImage;
                                  setBlocks(newBlocks);
                                 }} 
                                className="cursor-pointer p-2 bg-red-900/20 text-red-500 rounded-full hover:bg-red-900/40 border border-red-500/20 transition-all"
                                title="Delete item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <button onClick={() => prevImage(listImage.length)} className="z-20 absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                              <ChevronLeft size={32} />
                            </button>

                            <button onClick={() => nextImage(listImage.length)} className="z-20 absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                              <ChevronRight size={32} />
                            </button>
                          </>
                        )}
                        <div>
                          <CldImage
                            src={activeImage}
                            alt ={activeImage}
                            width={400}
                            height={400}
                            crop="fit"
                            className="object-cover h-auto w-auto "
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        </div>
                        
                      </div>
                      {/* 2. Textarea is now physically below the image with a gap */}
                      <textarea
                        className="w-full bg-zinc-900/50 p-3 rounded-lg outline-none text-zinc-300 leading-relaxed resize-none border border-zinc-700 focus:border-blue-500 transition-colors"
                        placeholder="Write a caption for this image..."
                        value={
                          typeof blocks[index].content[selectedIdx] === 'object'  
                            ? (blocks[index].content[selectedIdx] as Gallery).text || "" 
                            : ""
                        }
                        rows={2}
                        onChange={(e) => {
                          const newBlocks = [...blocks];
                          const targetImage = newBlocks[index].content[selectedIdx] as Gallery;
                          targetImage.text = e.target.value;
                          setBlocks(newBlocks);
                        }}
                      />
                    </div>
                );
              })()}

              {block.type === "list" && (() => {
                
                const listOfItem = block.content as Item[];

                return(
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-black">
                    
                    {listOfItem.map((item,indexofItem) => (
                      <div 
                        key={item.name} 
                        className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-500 transition-all duration-300"
                      >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity" />
                        
                        <div className="absolute top-2 right-2 flex gap-2 z-10">
                             {/* EDIT BUTTON */}
                              <button 
                                onClick={() => setChangeImage({indexBLock: index, indexImage: indexofItem})} 
                                className="cursor-pointer p-2 bg-blue-900/20 text-blue-400 rounded-full hover:bg-blue-900/40 border border-blue-500/20 transition-all" 
                                title="Edit item"
                              >
                                <Pencil size={14} />
                              </button>

                              {listOfItem.length > 1 && ( 
                                <>
                                  {/* DELETE BUTTON */}
                                  <button 
                                    onClick={() => { /* your delete logic */ }} 
                                    className="cursor-pointer p-2 bg-red-900/20 text-red-500 rounded-full hover:bg-red-900/40 border border-red-500/20 transition-all"
                                    title="Delete item"
                                  >
                                    <Trash2 size={14} />
                                    </button>
                                </>
                              )}
                        </div>


                        <div className="mb-4">
                          <CldImage
                            src={item.icon.link}
                            alt={item.name}
                            width={200}
                            height={200}
                            crop="fit"
                            className="object-cover h-auto w-auto "
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        </div>
                        {/* Text Inputs */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Item Name</label>
                          <input 
                            value={item.name} 
                            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                            placeholder="e.g. Something" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                );  
              })()}

              {block.type === "link" && (() => {

                const listOfLink = block.content as Item[];

                return(
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {listOfLink.map((item,indexofItem) => (
                      <div
                        key={indexofItem}
                        className="group relative flex flex-col p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800/50 transition-all h-full"
                      >
                        <div className="absolute top-2 right-2 flex gap-2 z-10">
                             {/* EDIT BUTTON */}
                              <button 
                                onClick={() => setChangeImage({indexBLock: index, indexImage: indexofItem})} 
                                className="cursor-pointer p-2 bg-blue-900/20 text-blue-400 rounded-full hover:bg-blue-900/40 border border-blue-500/20 transition-all" 
                                title="Edit item"
                              >
                                <Pencil size={14} />
                              </button>

                              
                              {listOfLink.length > 1 &&(
                                <>
                                  {/* DELETE BUTTON */}
                                  <button 
                                    onClick={() => { /* your delete logic */ }} 
                                    className="cursor-pointer p-2 bg-red-900/20 text-red-500 rounded-full hover:bg-red-900/40 border border-red-500/20 transition-all"
                                    title="Delete item"
                                  >
                                    <Trash2 size={14} />
                                    </button>
                                </>
                              )}
                        </div>

                        <div className="relative flex justify-center  w-full mb-4 overflow-hidden rounded-xl bg-white/5">
                          <CldImage
                            src={item.icon.link}
                            alt={item.name}
                            width={400}
                            height={400}
                            crop="fit"
                            className="object-cover h-auto w-auto "
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        </div>
        
                        <div className="mt-auto flex justify-between items-start">
                          {/* Text Inputs */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Item Name</label>
                            <input 
                              value={item.name} 
                              onChange={(e) => {
                                const newName = e.target.value;
  
                                setBlocks(prevBlocks => 
                                  prevBlocks.map((block, i) => 
                                    i === index ? { ...block,  } : block
                                  )
                                );
                              }}
                              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                              placeholder="e.g. Something" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Item Link</label>
                            <textarea
                              rows={2} 
                              onChange={(e)=>{}}
                              value={item.link}
                              className="resize-none w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                              placeholder="e.g. https://......" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );  
              })() }
              
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING TOOLBAR */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center pt-1.5">
        <button 
          onClick={() => setOpen(!open)} 
          className={`
            cursor-pointer flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all shadow-xl
            ${open ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}
          `}
        >
          <Plus size={18} className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
        </button>

        {/* BEAUTIFUL DROPDOWN */}
        {open && (
          <div className="absolute bottom-full mb-4 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
            <p className="text-[10px] font-bold text-zinc-500 px-3 py-2 uppercase tracking-widest">Components</p>
            <div className="grid grid-cols-1 gap-1">
              <MenuButton icon={<Type size={16}/>} label="Text Block" onClick={() => {addTextBlock(); setOpen(false);}} />
              <MenuButton icon={<Type size={16}/>} label="Text Area Block" onClick={() => {addTextAreaBlock(); setOpen(false);}} />              
              <MenuButton icon={<ImageIcon size={16}/>} label="Cloudinary Media" onClick={() => {setMediaImage(true); setOpen(false);}} />
              <MenuButton icon={<Video size={16}/>} label="YouTube Video" onClick={() => {setMediaVideo(true); setOpen(false);}} />
              <MenuButton icon={<List size={16}/>} label="List Items" onClick={() => {setMediaList(true); setOpen(false);}} />
              <MenuButton icon={<ShoppingCart size={16}/>} label="Link Items" onClick={() => {setMediaLink(true); setOpen(false);}} />
            </div>
          </div>
        )}
      </div>

      
      {mediaImage && (
        <div className="fixed w-full inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800  rounded-3xl max-w-4xl max-h-[85vh] shadow-2xl scale-in-center">      
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Image size={25}/>
                My Images
              </h2>
              <button onClick={() => setMediaImage(false)} className="cursor-pointer hover:text-white text-zinc-500">Close</button>
            </div>
            <LoadImage onClose={() => setMediaImage(false)} onSave={addImages} isItem={false}/>
          </div>
        </div>
      )}


      {ChangeImage &&(
        <ChangeImageComponent indexBlock={ChangeImage.indexBLock} indexImage={ChangeImage.indexImage} onClose={() => setChangeImage(null)} setBlocks={setBlocks} blocks={blocks} />
      )}

      {/* CUSTOM SUCCESS MODAL */}
      {mediaVideo && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col">
      
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">▶</span>
              RepoFlux Channel
            </h2>
            <button onClick={() => setMediaVideo(false)} className="cursor-pointer hover:text-white text-zinc-500">Close</button>
          </div>

          <YoutubeVideo onClose={() => setMediaVideo(false)} onSave={addVideo} />
          </div>
        </div>
      )}

      {mediaLink && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <LinkIcon size={25}/>
                  My links
                </h2>
                <button onClick={() => setMediaLink(false)} className="cursor-pointer hover:text-white text-zinc-500">Close</button>
              </div>

              <LoadLink onClose={() => setMediaLink(false)} onSave={addLink} />

            </div>
          </div>
        )
      }

      {mediaList && (() => {
        return(
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <List size={25}/>
                  My list of item
                </h2>
                <button onClick={() => setMediaList(false)} className="cursor-pointer hover:text-white text-zinc-500">Close</button>
              </div>

              <LoadList onClose={() => setMediaList(false)} onSave={addList} />
              
            </div>
          </div>
        );
      })() }
    </div>
  );
}

// Helper Sub-component
function MenuButton({ icon, label, onClick }: { icon: any, label: string, onClick: any }) {
  return (
    <button 
      onClick={onClick}
      className="cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition"
    >
      <span className="text-zinc-600">{icon}</span>
      {label}
    </button>
  );
}


