"use client";
import { useEffect, useState } from "react";
import {Item,Block,Gallery,ImageChange,GitHubInfo, CodeInfo, LanguageType,NavigationProps} from "@/components/intefaces"
import LoadImage  from "@/components/admin/component/AddImages";
import LoadLink from "@/components/admin/component/AddLink";
import YoutubeVideo from "@/components/admin/component/AddYoutubeVideo";
import LoadList from "@/components/admin/component/AddList";
import { 
         Plus, Type, ImageIcon, Image,
         Video,Trash2,ChevronLeft,ChevronRight,
         ShieldXIcon, LinkIcon, ShoppingCart, 
         List,Pencil,CheckCircle2,CircleAlert,
         Github,ExternalLink,Link,Code2,Check,Copy,ChevronDown
        } from "lucide-react";
import { CldImage } from 'next-cloudinary';
import ChangeImageComponent from "./component/ChangeImage";

export default function Post({ onNavigate }: NavigationProps) {
  
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
  const [showResult,setShowResult] = useState(false);
  const [result,setResult] = useState<"idle" | "warning" | "error" | "success">("idle");
  const [message,setMessage] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const options = ["Software", "Project"];
  const [category, setCategory] = useState<string>("empty");
  const [mylanguages,setMyLanguages] = useState<LanguageType[]>([]);
  const [languagesofDB,setLanguagesofDB] = useState<LanguageType[]>([]);
  const [showLanguage,setShowLanguage] = useState(false);
  
  useEffect(()=>{
    getLanguages();
  },[])

  useEffect(() => {
    console.log("The UI has updated! Current languages:", mylanguages);
  }, [mylanguages]);

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

  const addgithub = async ()=>{
    setBlocks([...blocks, { type: "github", content: {link: "",description: "",text: ""} as GitHubInfo}]);
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

  const addCode = async () =>{
    setBlocks([...blocks,{type:"code",content: {fileName: "",code: ""} as CodeInfo}])
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

  const handleCopy = (codeToCopy: string) => {
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
  };

  const getLanguages = async () =>{
    const actionName = "getLanguages"; 

      try { 
        const response = await fetch('/api/drizzle/helper/admin', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            actionName: actionName,
          }),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Failed to add language");
        }
        const language: LanguageType[] = result.result;
        language.unshift({id: "0",language: ""});
        setLanguagesofDB(language)
        console.log("Success:", language);

      } catch (error) {
        console.error("Error calling API:", error);
      }
  }

  const addLanguage = async (lang: LanguageType) =>{
    console.log(lang);
    setMyLanguages((prev)=>[...prev,lang]);
  }

  const deleteLanguages = async (lang: LanguageType) =>{
    setMyLanguages((prev)=> prev.filter((language)=> language.id !== lang.id));
  }

  const publish = async () =>{
    const check = {link: true, list: true,textBlock: true, textArea: true};
    let array,text:string;

    blocks.map((block)=>{
      switch(block.type){
        case "textBlock":
          text = block.content as string;
          if(!text.trim()){
            check.textBlock = false;
          }
          break;
        case "textAreaBlock":
          text = block.content as string;
          if(!text.trim()){
            check.textBlock = false;
          }
          break;
        case "link":
          array = block.content as Item[]
          array.map((item,index)=>{
            if(!item.link?.trim() && !item.name.trim()){
              check.link = false;
            }
          })  
          break;
        case "list":
          array = block.content as Item[]
          array.map((item,index)=>{
            if(!item.name.trim()){
              check.list = false;
            }
          })
          break;
      }
    })

    if(category !== "empty" && title.trim() && description.trim())
    {
      const response = await fetch('/api/post', { // Use the path to your route.ts
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim() ? title: "",
          description: description.trim() ? description : "",
          category: category,
          postLanguages: Array.isArray(mylanguages) ? mylanguages: [],
          blog: Array.isArray(blocks) ? blocks: []
        }),
      });
  
      const res = await response.json();
      
      if (!response.ok) {
        setResult("error");
        throw new Error(res.error || "Failed to add post");
      }else{
        
        switch(res.result.result.message){
          case "page added":
            console.log("Success:", res);
            setResult("success");
            setMessage("Post created with success!!");
            break;
          case "page not added":
            console.log("Error:", res);
            setResult("error");
            setMessage("Something went wrong!!");
            break;
          case "Post already exsist":
            console.log("Success:", res);
            setResult("warning");
            setMessage("Post already exsist!!");
            break;
        }      
      }
    }else{
      if(category === "empty"){
        setMessage("Some text is missing and select the category");
      }else{
        setMessage("Some text is missing");
      }
      setResult("error");
    }

    setCategory("empty");
    setMyLanguages([]);
    setTitle("");
    setDescription("");
    setBlocks([])
    setShowResult(true);
  };

  return (
    <div onClick={() => {if(open){ setOpen(false);} if(showLanguage){setShowLanguage(false)}}} className=" mx-auto p-10 space-y-5 bg-zinc-950 text-zinc-200 min-h-screen font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-end border-b border-zinc-800 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight" >{title=="" ? "Project Title": title}</h1>
          <p className="text-zinc-500 text-sm">{description == "" ? "Describe the high-level process..." : description}.</p>
        </div>
        <button onClick={publish} className="cursor-pointer px-5 py-2 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition text-sm">
          Publish
        </button>
      </header>

      {/* SCROLLABLE CONTENT AREA */}
      <div className="overflow-y-auto max-h-[65vh] pr-4 space-y-3 custom-scrollbar">
        {/* METADATA SECTION */}
        <section className="space-y-4">
          <input
            id="title"
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            className="w-full bg-transparent text-4xl font-bold placeholder:text-zinc-800 outline-none border-none focus:ring-0"
          />
          <textarea
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            placeholder="Describe the high-level process..."
            className="w-full bg-transparent text-zinc-400 placeholder:text-zinc-800 outline-none border-none focus:ring-0 resize-none"
            rows={2}
          />

          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 w-fit">
           {options.map((option) => (
            <label key={option} className="relative cursor-pointer">
             {/* The actual input is hidden but still works for accessibility */}
              <input
               type="radio"
               name="blockType"
               value={option}
               checked={category === option}
               onChange={(e) => setCategory(e.target.value)}
               className="sr-only" 
              />
        
              {/* The custom styled "Button" */}
              <div className={`
                px-4 py-2 rounded-lg text-xs font-bold transition-all
                ${category === option 
                ? "bg-blue-500 text-white shadow-lg" 
                : "text-zinc-500 hover:text-zinc-300"}
              `}>
                 {option}
              </div>
            </label>
            ))}
          </div>

          <div className="relative w-full">
            {/* The "Trigger" Button (Looks like your select) */}
            <button
              onClick={() => setShowLanguage(!showLanguage)}
              className="cursor-pointer w-full flex justify-between items-center bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm"
            >
              <span>Select a language...</span>
              <ChevronDown size={16} />
            </button>

           {/* The Scrollable Menu */}
           {showLanguage && (
            <div className="absolute top-full left-0 w-full mt-2 z-50 
                      bg-zinc-950 border border-zinc-800 rounded-xl 
                      shadow-2xl overflow-hidden">
              {/* THIS IS YOUR OVERFLOW CONTROL */}
              <div className="max-h-37.5 overflow-y-auto custom-scrollbar">
                {languagesofDB.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      addLanguage(item);
                      setShowLanguage(false);
                    }}
                    className=" px-4 py-2 hover:bg-zinc-900 cursor-pointer text-sm text-zinc-200 transition-colors"
                  >
                    {item.language}
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>

          <div className="mt-3">
        
            {mylanguages.length > 0 ? 
             (<div>
                <h5 className=" font-medium text-gray-500 dark:text-gray-400">Languages</h5>
                <ul className="  mt-2 max-h-80 w-full overflow-y-auto bg-white dark:bg-zinc-950">
                  {mylanguages.map(lang => (
                    <li
                       key={lang.id}
                       className="p-2 flex items-center gap-2"
                    >
                      <button className='cursor-pointer' onClick={ async ()=> await deleteLanguages(lang)}>
                        <Trash2 size={20}/>
                      </button>  
                      <span> - {lang.language}</span>
                    </li>
                  ))}
                </ul>
              </div>)
               : (
                <div className="mt-4 p-4 rounded-xl border border-dashed text-center text-sm text-gray-400 dark:border-zinc-800">
                  <p className="font-medium mb-1">No languages added yet</p>
                  <p>Search for a language above and click it to add</p>
                </div>
                )
              }
            </div>

        </section>


        {/* DYNAMIC BLOCKS */}
        <div className="space-y-2">
          {blocks.map((block, index) => (
            <div key={index} className="group relative p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all">
              <div className="absolute -left-10 top-6 text-xs font-mono text-zinc-700">0{index + 1}</div>
              
              <button onClick={()=>setBlocks((prev)=>prev.filter((_, i) => i !== index))} className="cursor-pointer absolute -right-3 -top-3 p-2 bg-red-900/20 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-900/40">
                <Trash2 size={14} />
              </button>

              {block.type === "textBlock" && (
                <input
                  key={index}
                  className="w-full bg-transparent outline-none text-zinc-300 leading-relaxed resize-none"
                  placeholder="Enter text content..."
                  value={block.content as string}
                  onChange={(e) => {
                    setBlocks(prev => prev.map((block, i) => {
                    if (i !== index) return block; // Not the block we want, return as is
                      return {
                        ...block,
                        content: e.target.value
                      };
                    }));
                  }}
                />
              )}

              {block.type === "github" &&(
                <div className="group relative p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:border-blue-500/50 transition-all duration-300 overflow-hidden">
                  {/* Background decorative gradient */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
                  <div className="relative flex flex-col md:flex-row items-center gap-6">
                    {/* Icon Wrapper */}
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <Github size={32} className="text-white" />
                    </div>

                    <div className="flex-1 space-y-3 text-center md:text-left">
                      {/* TITLE INPUT */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                          Section Title
                        </label>
                        <input
                          value={(block.content as GitHubInfo).text}
                          onChange={(e) => {
                            setBlocks(prev => prev.map((block, i) => {
                              if (i !== index) return block; // Not the block we want, return as is
                                let Content = block.content as GitHubInfo;
                                Content = {...Content,text: e.target.value}
                                return {
                                  ...block,
                                  content: Content
                                };
                            }));
                          }} 
                          key={index}
                          type="text"
                          className="w-full bg-zinc-950/50 border border-zinc-800 p-2 rounded-xl text-white font-semibold text-lg tracking-tight outline-none focus:border-blue-500/50 transition-all" 
                          placeholder="Project Repository"
                        />
                      </div>

                      {/* DESCRIPTION TEXTAREA */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                          Description
                        </label>
                        <textarea
                          value={(block.content as GitHubInfo).description}
                          onChange={(e) => {
                            setBlocks(prev => prev.map((block, i) => {
                              if (i !== index) return block; // Not the block we want, return as is
                                let Content = block.content as GitHubInfo;
                                Content = {...Content,description: e.target.value}
                                return {
                                 ...block,
                                 content: Content
                                };
                            }));  
                          }} 
                          key={index} 
                          rows={2}
                          className="w-full bg-zinc-950/50 border border-zinc-800 p-3 rounded-xl text-zinc-400 text-sm outline-none focus:border-blue-500/50 transition-all resize-none leading-relaxed" 
                          placeholder="View the full source code..."
                        />
                      </div>
                    </div>
                    {/* Action Link */}
                    <div className="flex items-center gap-3">
                      <a 
                        href={(block.content as GitHubInfo).link}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="cursor-pointer flex items-center gap-2 px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-all active:scale-95"
                      >
                        View Code
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Input Field for Editing (Admin View) */}
                  <div className="mt-6 pt-6 border-t border-zinc-800/50">
                    <div className="relative">
                      <Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                      <input 
                        value={(block.content as GitHubInfo).link}
                        onChange={(e) => {
                          
                          setBlocks(prev => prev.map((block, i) => {
                            if (i !== index) return block; // Not the block we want, return as is
                            let Content = block.content as GitHubInfo;
                            Content = {...Content,link: e.target.value}
                            return {
                              ...block,
                              content: Content
                            };
                          }));    
                        }} 
                        key={index}
                        type="text"
                        className="w-full bg-zinc-950 border border-zinc-800 pl-12 pr-4 py-3 rounded-2xl text-zinc-300 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                  </div>
                </div>
              )}

              {block.type === "code" && (
                <section className="mt-12 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 size={20} className="text-blue-500" />
                    <h3 className="text-xl font-bold text-white">Technical Deep Dive</h3>
                  </div>

                  <div className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
                    {/* Mac-style Window Header */}
                    <div className="bg-zinc-900/50 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                      </div>

                      {/* VISIBLE INPUT BOX */}
                      <div className="relative flex-1 flex justify-center">
                        <input 
                          value={(block.content as CodeInfo).fileName}
                          onChange={(e) => {
                            setBlocks(prev => prev.map((block, i) => {
                              if (i !== index) return block; // Not the block we want, return as is
                              let Content = block.content as CodeInfo;
                              Content = {...Content,fileName: e.target.value}
                              return {
                                ...block,
                                content: Content
                              };
                            }));  
                          }} 
                          spellCheck={false}
                          className={`
                            bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-1
                            text-[10px] font-mono text-zinc-400 uppercase tracking-widest text-center
                            hover:border-zinc-700 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20
                            outline-none transition-all w-full max-w-60
                          `}
                          placeholder="FileName..."
                        />
                      </div>
                      
                      {/* COPY BUTTON */}
                      <button 
                        onClick={() => handleCopy((block.content as CodeInfo).code)}
                        className="flex items-center gap-2 px-2 py-1 rounded-md bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700 hover:text-white text-zinc-400 transition-all active:scale-95 group"
                        title="Copy code"
                      >
                        {copied ? (
                          <>
                            <Check size={12} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-emerald-500">Copied!</span>
                          </> 
                        ) : (
                          <>
                            <Copy size={12} className="group-hover:text-blue-400" />
                            <span className="text-[10px] font-bold">Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* The Code Area (Admin Version) */}
                    <div className="p-6 overflow-x-auto font-mono text-sm leading-relaxed bg-zinc-950/50">
                      <textarea
                        value={(block.content as CodeInfo).code}
                        onChange={(e) => {
                          setBlocks(prev => prev.map((block, i) => {
                            if (i !== index) return block; // Not the block we want, return as is
                            let Content = block.content as CodeInfo;
                            Content = {...Content,code: e.target.value}
                            return {
                              ...block,
                              content: Content
                            };
                          }));
                        }} 
                        spellCheck={false}
                        className="w-full h-75 bg-transparent text-zinc-300 outline-none resize-none font-mono leading-relaxed selection:bg-blue-500/30"
                        placeholder="// Paste your expert code here..."
                      />
                    </div>
                  </div>
                </section>
              )}

              {block.type === "textAreaBlock" && (
                <textarea
                  className="w-full bg-transparent outline-none text-zinc-300 leading-relaxed resize-none"
                  placeholder="Enter text area content..."
                  rows={5}
                  value={block.content as string}
                  onChange={(e) => {
                    setBlocks(prev => prev.map((block, i) => {
                      if (i !== index) return block; // Not the block we want, return as is
                        return {
                          ...block,
                          content: e.target.value
                        };
                      }));
                    }
                  }
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
                        setBlocks(prev => prev.map((block, i) => {
                          if (i !== index) return block; // Not the block we want, return as is
                          const galleryContent = block.content as Gallery[];
                          return {
                           ...block,
                           content: galleryContent.map((item, j) => {
                            if (j !== 0) return item; // Not the first image, return as is
  
                              return { ...item, text: e.target.value };
                            })
                          };
                        }));
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
                          typeof (blocks[index].content as Gallery[])[selectedIdx] === 'object'  
                            ? ((blocks[index].content as Gallery[])[selectedIdx]).text || "" 
                            : ""
                        }
                        rows={2}
                        onChange={(e) => {
                          setBlocks(prev => prev.map((block, i) => {
                            if (i !== index) return block; // Not the block we want, return as is
                              const galleryContent = block.content as Gallery[];
                              return {
                                ...block,
                                content: galleryContent.map((item, j) => {
                                if (j !== selectedIdx) return item; // Not the first image, return as is
   
                                  return { ...item, text: e.target.value };
                                })
                            };
                          }));
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
                                    onClick={() => { 
                                      const newlink = listOfItem.filter((_,i) => i !== indexofItem );
                                      const newBlocks = [...blocks]
                                      newBlocks[index].content = newlink;
                                      setBlocks(newBlocks);
                                    }} 
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
                            key={index}
                            value={item.name} 
                            onChange={(e)=>{
                              setBlocks(prev => prev.map((block, i) => {
                                if (i !== index) return block; // Not the block we want, return as is
                                  const galleryContent = block.content as Item[];
                                  return {
                                    ...block,
                                    content: galleryContent.map((item, j) => {
                                      if (j !== indexofItem) return item; // Not the first image, return as is
                                      return { ...item, name: e.target.value };
                                    })
                                  };
                              }));
                            }}
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
                                    onClick={() => { 
                                      const newlink = listOfLink.filter((_,i) => i !== indexofItem );
                                      const newBlocks = [...blocks]
                                      newBlocks[index].content = newlink;
                                      setBlocks(newBlocks);
                                     }} 
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
                              key={index}
                              value={item.name} 
                              onChange={(e) => {
                                setBlocks(prev => prev.map((block, i) => {
                                  if (i !== index) return block; // Not the block we want, return as is
                                    const galleryContent = block.content as Item[];
                                    return {
                                      ...block,
                                      content: galleryContent.map((item, j) => {
                                        if (j !== indexofItem) return item; // Not the first image, return as is
                                        return { ...item, name: e.target.value };
                                      })
                                    };
                                }));
                              }}
                              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                              placeholder="e.g. Something" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Item Link</label>
                            <textarea
                              rows={2} 
                              onChange={(e)=>{
                                setBlocks(prev => prev.map((block, i) => {
                                  if (i !== index) return block; // Not the block we want, return as is
                                    const galleryContent = block.content as Item[];
                                    return {
                                      ...block,
                                      content: galleryContent.map((item, j) => {
                                        if (j !== indexofItem) return item; // Not the first image, return as is
                                        return { ...item, link: e.target.value };
                                      })
                                    };
                                }));
                              }}
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
      <div className="fixed bottom-8 left-1/2  -translate-x-1/2 flex flex-col items-center z-50">
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
            <div className="grid grid-cols-1 gap-1 overflow-y-auto max-h-50 custom-scrollbar">
              <MenuButton icon={<Type size={16}/>} label="Text Block" onClick={() => {addTextBlock(); setOpen(false);}} />
              <MenuButton icon={<Type size={16}/>} label="Text Area Block" onClick={() => {addTextAreaBlock(); setOpen(false);}} />              
              <MenuButton icon={<ImageIcon size={16}/>} label="Cloudinary Media" onClick={() => {setMediaImage(true); setOpen(false);}} />
              <MenuButton icon={<Video size={16}/>} label="YouTube Video" onClick={() => {setMediaVideo(true); setOpen(false);}} />
              <MenuButton icon={<List size={16}/>} label="List Items" onClick={() => {setMediaList(true); setOpen(false);}} />
              <MenuButton icon={<ShoppingCart size={16}/>} label="Link Items" onClick={() => {setMediaLink(true); setOpen(false);}} />
              <MenuButton icon={<Github size={16}/>} label="Add Repository" onClick={() => {addgithub(); setOpen(false);}} />
              <MenuButton icon={<Code2 size={16}/>} label="Add Code" onClick={() => {addCode(); setOpen(false);}} />
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

      {showResult && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-4xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">

              {/* Dynamic Icon Section */}
              <div className={`p-5 rounded-full mb-6 ${
                  result === "success" ? "bg-green-500/10" : 
                  result === "warning" ? "bg-yellow-500/10" : "bg-red-500/10"
                }`}>
                {result === "success" && <CheckCircle2 size={48} className="text-green-500" />}
                {result === "warning" && <CircleAlert size={48} className="text-yellow-500" />}
                {result === "error" && <ShieldXIcon size={48} className="text-red-500" />}
              </div>
        
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{message}</h3>
              <p className="text-zinc-400 text-sm mb-8">
                {result === "success" ? "Everything looks great!" : "Something needs your attention."}
              </p>

              {/* Action Buttons Container */}
              <div className="flex flex-col gap-3 w-full">
                {result === "success" && (
                  <button 
                    onClick={() => onNavigate?.('overview')}
                    className="cursor-pointer w-full py-3.5 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-white/5"
                  >
                    View Post
                  </button>
                )}

                <button
                  onClick={() => setShowResult(false)}
                  className={`cursor-pointer w-full py-3.5 font-bold rounded-2xl transition-all active:scale-[0.98] ${
                    result === "success" 
                     ? "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                  }`}
                >
                  {result === "success" ? "Dismiss" : "Try Again"}
                </button>
              </div>

            </div>
          </div>
        </div> 
      )}
    </div>
  );
}

// Helper Sub-component
function MenuButton({ icon, label, onClick }: { icon: any, label: string, onClick: any }) {
  return (
    <button 
      onClick={onClick}
      className="relative z-50 cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition"
    >
      <span className="text-zinc-600">{icon}</span>
      {label}
    </button>
  );
}


