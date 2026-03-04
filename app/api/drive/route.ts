// app/api/upload/route.ts
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { DriveFile } from "@/components/intefaces";

export async function GET(req: NextRequest): Promise<NextResponse> {

  // Type guard for env variables
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.DRIVE_PRIVATE_KEY;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!clientEmail || !privateKey || !folderId) {
    return NextResponse.json(
      { error: "Missing Google credentials in environment variables" },
      { status: 500 }
    );
  }

  console.log("client_email:", clientEmail)
  console.log("key starts with:", privateKey.substring(0, 30))

  // Authenticate with service account
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, "\n").replace(/\n/g, "\n").trim(),
    },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"], // 👈 readonly scope, more secure
  });

  const drive = google.drive({ version: "v3", auth });

  // Get all files inside your folder
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`, // only files in your folder, not deleted
    fields: "files(id, name, mimeType, createdTime, size)", // only fetch what you need
    orderBy: "createdTime desc", // newest first
  });

  const files = response.data.files;

  if (!files || files.length === 0) {
    return NextResponse.json({ files: [] });
  }

  // Map to a clean response
  const resultFile: DriveFile[] = files.map((file) => ({
    id: file.id!,
    name: file.name!,
    mimeType: file.mimeType!,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
    previewUrl: `https://drive.google.com/file/d/${file.id}/view`,
    createdAt: file.createdTime,
    size: file.size,
  }));
 

  return NextResponse.json({ files: resultFile });
}