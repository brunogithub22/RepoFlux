import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Store this in .env (never expose to client)
});

export async function POST(request: Request) {
  const { publicId } = await request.json();
  console.log("Received publicId for deletion:", publicId);

  if (!publicId) {
    return NextResponse.json({ error: "Public ID is required" }, { status: 400 });
  }

  try {
    // resource_type 'image' is default, use 'video' or 'raw' if necessary
    const result = await cloudinary.uploader.destroy(publicId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}