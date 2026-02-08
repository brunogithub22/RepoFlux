'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

type CloudinaryResourceType = "image";

interface CloudinaryUploadInfo {
  asset_id: string;
  public_id: string;
  secure_url: string;
  resource_type: CloudinaryResourceType;
  format: string;
  width?: number;
  height?: number;
  duration?: number; // videos only
}

export default function UploadContent() {
  const [assetUrl, setAssetUrl] = useState<string | null>(null);

  async function handleUpload(info: CloudinaryUploadInfo) {
    const actionName = "newImage"; // The "function name" your API expects

    setAssetUrl(info.secure_url);
    try {  
      const response = await fetch('/api/drizzle/helper/admin', { // Use the path to your route.ts
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionName: actionName,
          payload: { image: assetUrl } // Passing the parameter
        }),
      });
  
      const result = await response.json();
    
      if (!response.ok) {
        throw new Error(result.error || "Failed to add image");
      }

      console.log("Success:", result);
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
      multiple: false,
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
    {({ open }) => (
      <button
        type="button"
        onClick={() => open()}
        className="max-w-sm w-full flex flex-col items-center justify-center gap-4 py-10
                   hover:bg-zinc-900 transition-all rounded-2xl"
      >
        <UploadCloud size={40} className="text-blue-500" />
        <div className="text-center">
          <p className="text-lg font-bold">Secure Upload Media</p>
          <p className="text-sm text-zinc-500">
            Authenticated via Server Signature
          </p>
        </div>
      </button>
    )}
  </CldUploadWidget>
</div>


  );
}