"use client";
import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Trash2, UploadCloud, CheckCircle2 } from "lucide-react";

interface MediaData {
  url: string;
  publicId: string;
  type: "image" | "video";
}

export default function Port() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<MediaData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSavePost = async () => {
    
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT SIDE: THE FORM */}
        <section className="space-y-8 bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
          <div>
            <h1 className="text-3xl font-bold text-white">Project Details</h1>
            <p className="text-zinc-500 mt-2">Upload your work to your portfolio.</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Project Title"
              className="w-full bg-black border border-zinc-700 p-4 rounded-xl focus:border-blue-500 outline-none transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Describe your process..."
              rows={4}
              className="w-full bg-black border border-zinc-700 p-4 rounded-xl focus:border-blue-500 outline-none transition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            onClick={handleSavePost}
            disabled={loading}
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Publish to Portfolio"}
          </button>
        </section>

        {/* RIGHT SIDE: LIVE PREVIEW */}
        <section className="sticky top-8 h-fit">
          <h2 className="text-sm uppercase tracking-widest text-zinc-500 mb-4">Live Preview</h2>
          <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
            <div className="aspect-video bg-zinc-800 flex items-center justify-center">
              
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{title || "Your Project Title"}</h3>
              <p className="text-zinc-400 line-clamp-3">{description || "Project description will appear here..."}</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}