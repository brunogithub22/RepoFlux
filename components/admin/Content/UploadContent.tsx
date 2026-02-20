'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { UploadCloud, Image, CheckCircle2, ShieldXIcon,CircleAlert } from 'lucide-react';
import {CloudinaryUploadInfo} from "@/components/intefaces";


export default function UploadContent() {

  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "warning" | "success" | "error">("idle");

  async function handleUpload(info: CloudinaryUploadInfo) {
    const actionName = "newImage"; // The "function name" your API expects

    try {  
      const response = await fetch('/api/drizzle/helper/admin', { // Use the path to your route.ts
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionName: actionName,
          payload: { 
            name: info.original_filename,
            image: info.secure_url, 
            public_id: info.public_id 
          } // Passing the parameter
        }),
      });
  
      const result = await response.json();
    
      if (!response.ok) {
        throw new Error(result.error || "Failed to add image");
      }
      console.log(result.result.message)

      switch (result.result.message) {
        case 'image added':
          setMessage('Image successfully added to the database!');
          setState("success");
          break;
        case "image alrealdy exists":
          setState("warning");
          setMessage('This image already exists in the database.');
          fetch('/api/claudinary/removeImage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId: info.public_id }),
          }) 
          .then((res) => {
            if (!res.ok) throw new Error("Delete failed from claudinary"); 
              return res.json();
          }).then((data) => {
            console.log(data);
          })
          .catch((err) => console.error(err))
          break;
        default:
          setState("error");
          setMessage('Unexpected response: ' + result.result.message);
      }
      console.log(result.result.message);
      setShowSuccess(true);
      console.log("Success:", info.secure_url);
    } catch (error) {
      console.error("Error calling API:", error);
    }

  }

  return (
  <div className="p-8 h-full w-full border-2 border-dashed rounded-3xl border-zinc-800 bg-zinc-950 flex items-center justify-center">
  <CldUploadWidget
    signatureEndpoint="/api/claudinary"
    uploadPreset="RepoFlux"
    options={{
      folder: "RepoFlux",
      resourceType: "auto",
      multiple: true,

      sources: ["local", "url"],
      clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
    }}
    onSuccess={(result) => {
      const info = result.info as CloudinaryUploadInfo;
      if (info.resource_type === "image") {
        handleUpload(info);
      }
    }}
  >
    {(props: any) => {
  // 1. Safely destructure with a fallback to an empty object
       const { open } = props || {};

       return (
        <button
          type="button"
          // 2. Use optional chaining so it doesn't crash if open is undefined
          onClick={() => open?.()}
          // 3. Visual feedback: dim the button if it's not ready yet
          className={`cursor-pointer max-w-sm w-full flex flex-col items-center justify-center gap-4 py-10
                 transition-all rounded-2xl ${
                   !open 
                    ? "opacity-50 cursor-wait bg-zinc-900/50" 
                    : "hover:bg-zinc-900 bg-zinc-900/10"
                 }`}
        >
        <UploadCloud size={40} className={open ? "text-blue-500" : "text-zinc-600"} />
        <div className="text-center">
          <p className="text-lg font-bold">Secure Upload Media</p>
          <p className="text-sm text-zinc-500">
            {/* 4. Help the user understand if they are waiting for the script */}
            {open ? "Authenticated via Server Signature" : "Loading Widget..."}
          </p>
        </div>
      </button>
    );
  }}
  </CldUploadWidget>

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
              
              <h3 className="text-xl font-bold text-white mb-2">{message}</h3>
              
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