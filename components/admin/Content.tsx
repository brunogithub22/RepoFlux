"use client";

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { UploadCloud, FileVideo, Image as ImageIcon } from 'lucide-react';

export default function Content() {
  const [resource, setResource] = useState<any>(null);

  return (
    <div className="p-8 max-w-2xl mx-auto border-2 border-dashed rounded-3xl border-zinc-800 bg-zinc-950">
      <CldUploadWidget 
        // 1. THIS IS THE KEY: Point to your API route
        signatureEndpoint="/api/sign-cloudinary" 
        
        // 2. Ensure this preset is 'Signed' in Cloudinary Settings
        uploadPreset="your_signed_preset_name" 
        
        options={{ 
          sources: ['local', 'url', 'camera'], 
          multiple: false 
        }}
        onSuccess={(result) => setResource(result.info)}
      >
        {({ open }) => (
          <button 
            type="button" // Expert tip: always specify button type in forms
            onClick={() => open()}
            className="w-full flex flex-col items-center justify-center gap-4 py-10 hover:bg-zinc-900 transition-all rounded-2xl"
          >
            <UploadCloud size={40} className="text-blue-500" />
            <div className="text-center">
              <p className="text-lg font-bold">Secure Upload Media</p>
              <p className="text-sm text-zinc-500">Authenticated via Server Signature</p>
            </div>
          </button>
        )}
      </CldUploadWidget>

      {resource && (
        <div className="mt-6 p-4 bg-zinc-900 rounded-2xl animate-in fade-in zoom-in">
          {/* ... (Your existing preview code is perfect) ... */}
          <p className="text-xs text-zinc-500 mb-2">Secure URL Generated:</p>
          <div className="mt-3 flex items-center gap-2 text-sm font-mono text-emerald-400 break-all">
             <span className="bg-emerald-500/10 px-2 py-1 rounded">Signed & Verified</span>
          </div>
        </div>
      )}
    </div>
  );
}