import { LanguageType, post,Block, Gallery,Item, GitHubInfo, CodeInfo } from "@/components/intefaces";
import { Calendar,Globe,ChevronLeft,ChevronRight,ShoppingBag,Github,ExternalLink,Check,Copy,Code2 } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { useState } from "react";

export default function ViewPost({Post, onNavigate }: {Post?: post, onNavigate?: (tab: string) => void;}){

    const lang: LanguageType[] = Array.isArray(Post?.languages) ? Post?.languages: [];
    const content: Block[] = Array.isArray(Post?.content) ? Post?.content : [];
    const [selectedIdx, setSelectedIdx] = useState<number>(0);
    const [copied, setCopied] = useState(false);

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

    if (!Post) return <div>No post selected. Please go back to Overview.</div>;
    
    return(
      <div className="max-w-4xl mx-auto py-10 px-6 bg-zinc-950 text-zinc-100 min-h-screen">
          
          {/* 2. Header Section */}
          <header className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/20">
                {Post?.type}
              </span>
              <div className="h-1 w-1 rounded-full bg-zinc-700" />
              <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                <Calendar size={14} />
                {Post?.date}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className={Post?.published ? "text-emerald-400" : "text-amber-400"}>
                ● {Post?.published ? "Published" : "Draft"}
                </span>
              </div>
           </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">  
            {Post?.title}
          </h1>
        </header>

        {/* 3. Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Description</h3>
              <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap">
                {Post?.description}
              </p>
            </section>
          </div>

          {/* 4. Sidebar: Tech Stack / Languages */}
          <aside className="lg:col-span-1">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl sticky top-8">
              <div className="flex items-center gap-2 mb-6 text-white font-bold">
                <Globe size={18} className="text-blue-500" />
                <span>Languages Used</span>
              </div>
            
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                {lang.length > 0 ? (
                  lang.map((lang) => (
                    <span 
                      key={lang.id} 
                      className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 font-medium"
                    >
                      {lang.language}
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-600 text-sm italic">No languages linked.</span>
                )}
              </div>
            </div>
          </aside>


        </div>
        <div className="w-full flex flex-col justify-center py-5">
            {content.map((block, index) => {
              const blockKey = `block-${index}`;

              switch (block.type) {
                case 'image':
                  const listImage:Gallery[] = block.content as Gallery[]; 
                  const activeImage: string = listImage.length > 1 
                    ? listImage[selectedIdx].link.toString() 
                    : listImage[0].link.toString();
                  const currentIndex = listImage.findIndex(img => img.link === activeImage);
                  const currentCaption = listImage[currentIndex]?.text || "";
                  return (
                    <div key={blockKey} className="relative max-w-4xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-950 mb-3 mt-3">
                      {listImage.length > 1 && (
                        <>
                          <div className="absolute inset-0 flex items-center justify-between p-4 z-20 pointer-events-none">
                            <button 
                              onClick={() => prevImage(listImage.length)} 
                              className="pointer-events-auto p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-all active:scale-90"
                            >
                              <ChevronLeft size={24} />
                            </button>

                            <button 
                              onClick={() => nextImage(listImage.length)} 
                              className="pointer-events-auto p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-all active:scale-90"
                            >
                              <ChevronRight size={24} />
                            </button>
                          </div>

                          <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-xl rounded-full border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                            {currentIndex + 1} / {listImage.length}
                          </div>
                        </>
                      )}

                      <div key={activeImage} className="relative flex flex-col items-center">
                        <CldImage
                          src={activeImage}
                          alt="Gallery Image"
                          width={800}
                          height={600}
                          crop="fit"
                          className="w-full h-auto object-contain max-h-[70vh]"
                          sizes="(max-width: 768px) 100vw, 800px"
                        />
    
                        <div className="w-full p-4 bg-zinc-900/50 border-t border-zinc-800">
                          <p className="text-sm text-zinc-400 text-center italic">
                            {currentCaption || "No description provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );

                case 'list':
                  const listOfItem = block.content as Item[];
                  console.log("List Data:", JSON.stringify(listOfItem, null, 2));
                  return(
                    <div key={blockKey} className="relative grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-zinc-950 rounded-3xl mb-8 mt-8 border border-zinc-900 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />

                        {listOfItem.map((item) => (
                          <div 
                            key={item.name} 
                            className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 hover:border-blue-500/30 hover:bg-zinc-800/40 transition-all duration-500 hover:-translate-y-1 shadow-2xl"
                          >
                            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500 rounded-full" />
       
                            <div className="relative z-10 mb-4 transform group-hover:scale-110 transition-transform duration-500">
                              <CldImage
                                src={item.icon.link}
                                alt={item.name}
                                width={80} // Scaled down for better grid fit
                                height={80}
                                crop="fit"
                                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                sizes="(max-width: 768px) 100vw, 80px"
                              />
                            </div>
      
                            <h3 className="relative z-10 text-zinc-400 group-hover:text-white text-xs font-bold uppercase tracking-widest transition-colors duration-300">
                              {item.name}
                            </h3>
                          </div>
                        ))}
                    </div>
                  );  
                
                case 'link':
                  const listOfLink = block.content as Item[];

                  return(
                    <div key={blockKey} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3 mt-3">
                      {listOfLink.map((item) => (
                        <a 
                          key={item.name}
                          href={item.link ? item.link : ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-col p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800/50 transition-all h-full"
                        >
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
                            <div>
                              <h4 className="text-zinc-200 font-medium">{item.name}</h4>
                            </div>
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                              <ShoppingBag size={18} className="text-orange-500" />
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  ); 

                case 'youtube':
                  const content = block.content as Gallery[];
                  console.log("Youtube Data:", JSON.stringify(content, null, 2));

                  const rawLink = content[0].link;

                  const getEmbedUrl = (url: string) => {
                    if (url.includes("watch?v=")) {
                      return url.replace("watch?v=", "embed/");
                    }
                    if (url.includes("youtu.be/")) {
                      return url.replace("youtu.be/", "youtube.com/embed/");
                    }
                    return url;
                  };

                  return(
                    <div key={blockKey} className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 w-full max-w-4xl mx-auto mt-12">
                      <div className="rounded-xl overflow-hidden border border-zinc-800">
                        <iframe 
                          src={getEmbedUrl(rawLink)}  
                          className="w-full aspect-video rounded-xl"
                        />
                      </div>
  
                      {content[0].text && (
                        <div className="p-4 bg-zinc-900/50 border-t border-zinc-800">
                          <p className="text-sm text-zinc-400 italic text-center">
                            {content[0].text}
                          </p>
                        </div>
                      )}
                    </div>
                  );

                case 'textBlock':
                  return(
                    <div key={blockKey} className="w-full max-w-4xl mx-auto pt-8 pb-2 mt-12">
                      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        {block.content as string}
                      </h2>
                    </div>
                  );

                case 'textAreaBlock':
                  return(
                    <div key={blockKey} className="w-full max-w-4xl mx-auto mt-12">
                      <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap">
                        {block.content as string}
                      </p>
                    </div>
                  );
                  
                case 'github': 

                  const github = block.content as GitHubInfo;
                  console.log("GitHub Data:", JSON.stringify(github, null, 2));
                  console.log(github.text);
                   return(
                    <div key={blockKey} className="group relative p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:border-blue-500/50 transition-all duration-300 overflow-hidden mb-3 mt-12">
                      {/* Background decorative gradient */}
                      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
                      <div className="relative flex flex-col md:flex-row items-center gap-6">
                        {/* Icon Wrapper */}
                         <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-xl group-hover:scale-110 transition-transform duration-500">
                           <Github size={32} className="text-white" />
                         </div>

                        {/* Content */}
                        <div className="flex-1 space-y-1 text-center md:text-left">
                          <h4 className="text-white font-semibold text-lg tracking-tight">{github.text}</h4>
                          <p className="text-zinc-500 text-sm">{github.description}</p>
                        </div>
 
                        {/* Action Link */}
                        <div className="flex items-center gap-3">
                          <a 
                            href={github.link}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="cursor-pointer flex items-center gap-2 px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-all active:scale-95"
                          >
                            View Code
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                   );

                case 'code': 

                  const code = block.content as CodeInfo
                  console.log("Code Data:", JSON.stringify(code, null, 2));
                  return(
                    <section key={blockKey} className="mt-12 space-y-4">
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
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{code.fileName}</span>
                          {/* COPY BUTTON */}
                          <button 
                            onClick={() =>handleCopy(code.code)}
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

                        {/* The Code Area */}
                        <div className="p-6 overflow-x-auto font-mono text-sm leading-relaxed">
                          <pre className="text-zinc-300">
                            <code className="language-typescript">
                             {code.code}
                           </code>
                          </pre>
                        </div>
                      </div>
                    </section>
                  );
                  
                default:
                  return <div key={blockKey} className="text-zinc-500 text-xs">Unsupported block type: {block.type}</div>;
              }
            })}
        </div>
        
      </div>
    );   

}