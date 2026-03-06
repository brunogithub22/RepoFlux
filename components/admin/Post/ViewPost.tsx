import { LanguageType, BasePost,Block, Gallery,Item, GitHubInfo, CodeInfo,post,DriveFile, Feedback } from "@/components/intefaces";
import { Calendar,Globe,ChevronLeft,ChevronRight,ShoppingBag,
         Github,ExternalLink,Check,Copy,Code2,FileText,Download,ShieldXIcon,
         CircleAlert,CheckCircle2
        } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { useCallback, useEffect, useState } from "react";

export default function ViewPost({Post, onNavigate }: {Post?: BasePost, onNavigate?: (tab: string) => void;}){

  const [post,setPost] = useState<post>();
  const [lang,setLang] = useState<LanguageType[]>([]);
  const [content,setContent] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [feedback,setFeedback] = useState("");
  const [listFeedback,setListFeedback] = useState<Feedback[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [valutation,setValutation] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "success" | "warning" | "error">("idle");
  const emojis = ['😞', '😐', '😊', '🔥'];

  const getPost = useCallback (async () => {
      const actionName = "getPost";
      try {
        const response = await fetch('/api/drizzle/helper/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Use the ID from your initial source (e.g., props or URL params)
          body: JSON.stringify({ actionName, payload: { id: Post?.id } }),
        });

        const result = await response.json();

        if (response.ok && result.result && result.result.length > 0) {
          const data: post = result.result[0];
          
          // 1. Update the state for the UI
          setPost(data);
          await getFeedback();

          if (!data) {
            console.log("Error: Data is empty");
            return;
          }

          // Set other states using the fresh 'data' object
          setLang(data.languages || []);
          setContent(data.content || []);
        
          console.log("Post data loaded successfully:", data);
        } else {
          console.error("Post not found or API error");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
      finally{
        setIsLoading(false);
      }
  }, []);

  useEffect(() => {
    if (Post?.id) {
      getPost();
    }
  }, [Post?.id]); 

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

    const sendFeedback = async () =>{
      const actionName = "addFeedback";

      if(valutation == null){
        setMessage("Choice a valutation.");
        setState("warning");
        setShowSuccess(true);
        return;
      }

      try {
        const response = await fetch('/api/drizzle/helper/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actionName, payload: { postId: Post?.id,text: feedback, valutation: valutation} }),
        });

        const result = await response.json();

        if (response.ok) {
          if(result.result.message){
            setMessage("FeedBack added successfully");
            setState("success");
            console.log("FeedBack added successfully:");
            await getPost();
          }else{
            setMessage("FeedBack added successfully");
            setState("warning");
            console.log("FeedBack not added successfully:");
          }
        } else {
          setMessage("Feedback not added API error");
          setState("error");
          console.error("Feedback not added API error");
        }
        setValutation(null);
        setFeedback("");
        setShowSuccess(true);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }


    const getFeedback = async () =>{
      const actionName = "getFeedbacks";
      try {
        const response = await fetch('/api/drizzle/helper/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Use the ID from your initial source (e.g., props or URL params)
          body: JSON.stringify({ actionName, payload: { id: Post?.id } }),
        });

        const result = await response.json();

        if (response.ok) {

          let data: Feedback[] = [];
          if(result.result.message){
            data = result.result.data;
            console.log("feedback loaded successfully:", data);
          }else{
            console.log("feedback empty");
          }
          setListFeedback(data);
          
        } else {
          console.error("Post feedback not found or API error");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }

    if (!Post) return <div>No post selected. Please go back to Overview.</div>;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-black">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
         <p className="ml-4 text-white">Loading your post...</p>
        </div>
      ); 
    }
    
    return(
      <div className=" mx-auto py-10 px-6 bg-zinc-950 text-zinc-100 min-h-screen">
          
          {/* 2. Header Section */}
          <header className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/20">
                {post?.type}
              </span>
              <div className="h-1 w-1 rounded-full bg-zinc-700" />
              <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                <Calendar size={14} />
                {post?.date}
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
                {post?.description}
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
                              width={80}
                              height={80}
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
                    <div key={blockKey} className="w-full max-w-4xl mx-auto pt-8 ">
                      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        {block.content as string}
                      </h2>
                    </div>
                  );

                case 'textAreaBlock':
                  return(
                    <div key={blockKey} className="w-full max-w-4xl mx-auto ">
                      <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap">
                        {block.content as string}
                      </p>
                    </div>
                  );

                case 'file':
                  const file = block.content as DriveFile;
                  return(
                    <div key={blockKey} className="group relative flex items-center justify-between p-5 bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl hover:border-blue-500/30 transition-all duration-300 mb-4">

                      {/* 1. File Info Section */}
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                          <FileText size={28} />
                        </div>
                        <div>
                          <h4 className="text-zinc-100 font-medium truncate max-w-50 lg:max-w-xs">
                            {file.name || "Untitled File"}
                          </h4>
                        </div>
                      </div>
 
                      {/* 2. Download Button */}
                      <a 
                        href={file.downloadUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        download
                        className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-black text-sm font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-white/5"
                      >
                        <Download size={18} />
                        <span className="hidden sm:inline">Download</span>
                      </a>

                      {/* Subtle Background Glow */}
                      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 blur-2xl -z-10 transition-opacity" />
                    </div>
                  );
                  
                case 'github': 

                  const github = block.content as GitHubInfo;
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

            {listFeedback.length === 0 ? (
              <div className="text-center p-10 border-2 border-dashed border-zinc-800 rounded-3xl mt-3">
                <p className="text-zinc-500">No feedback received yet.</p>
              </div>
            ) : (
              <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl">
                <div className="flex items-center justify-between mb-6 px-2">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Feedback</h2>
                    <p className="text-zinc-500 text-sm">what users are saying:</p>
                  </div>
    
                  {/* Dynamic Counter Badge */}
                  <div className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-xs font-mono border border-zinc-700">
                    {listFeedback.length} {listFeedback.length === 1 ? 'Entry' : 'Entries'}
                  </div>
                </div>
                
                {listFeedback.map((feedback, index) => (
                  <div  
                    key={feedback.id} 
                    className="mt-2 group p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
          
                      {/* 1. Content and Rating */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl" role="img" aria-label="rating">
                            {emojis[feedback.valutation]}
                          </span>
                          <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                            Rating {feedback.valutation + 1}/4
                          </span>
                        </div>
            
                        <p className="text-zinc-300 leading-relaxed wrap-break-words">
                          {feedback.feedback || "no text provided"}
                        </p>
                      </div>
                    </div>

                    <div className="h-0.5 w-0 group-hover:w-full bg-blue-500/30 transition-all duration-500 mt-4 rounded-full" />
                  </div>
                ))}
              </div>
            )}
    
        </div>

        <div className="max-w-xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-2">Send us your feedback</h3>
          <p className="text-zinc-400 text-sm mb-6">How can we improve your experience?</p>

          {/* Sentiment Selection (Optional but Senior touch) */}
          <div className="flex gap-4 mb-6">
            {emojis.map((emoji, id) => {
              const isActive = valutation === id;

              return (
                <button
                  key={emoji}
                  onClick={() => {!isActive ? setValutation(id) : setValutation(null)}}
                  className={`
                    cursor-pointer text-2xl p-3 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' 
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}
                  `}
                >
                  {emoji}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <textarea
              value={feedback}
              onChange={(e) => {setFeedback(e.target.value)}}
              placeholder="Write something..."
              className="w-full h-40 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={sendFeedback} 
              className="cursor-pointer px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              Submit Feedback
            </button>
          </div>
        </div>

        {/* CUSTOM SUCCESS MODAL */}
        {showSuccess && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full shadow-2xl scale-in-center">
              <div className="flex flex-col items-center text-center">
                {state === "success"  ? (
                  <div className="bg-green-500/10 p-4 rounded-full mb-4">
                    <CheckCircle2 size={48} className="text-green-500" />
                  </div>
                ):(
                  state === "warning" ?(
                    <div className="bg-yellow-500/10 p-4 rounded-full mb-4">
                      <CircleAlert size={48} className="text-yellow-500" />
                    </div>
                ):(
                  <div className="bg-red-500/10 p-4 rounded-full mb-4">
                    <ShieldXIcon size={48} className="text-red-500" />
                  </div>
                )
              )}
                      
                <p className="text-zinc-400 mb-6">
                  {message}
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="cursor-pointer w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      
    );   

}