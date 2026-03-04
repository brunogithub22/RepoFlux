import { UUID } from "crypto";

export interface LinkYoutube{
  id: string,
  title: string,
  thumbnail: string,
  videoUrl: string,
  embedUrl: string
}

export interface Block{
  type: string
  content: Gallery[] | Item[] | string | GitHubInfo | CodeInfo | DriveFile;
}

export interface Gallery {
  id: string;
  link: string;
  public_id?: string;
  text?: string;
}

export interface Item{
  name: string;
  link?: string;
  icon: Gallery;
}

export interface NavigationProps {
  onNavigate?: (tab: string) => void;
}

export interface LanguageType {
  id: string;
  language: string;
}

export type CloudinaryResourceType = "image";

export interface CloudinaryUploadInfo {
  asset_id: string;
  public_id: string;
  secure_url: string;
  resource_type: CloudinaryResourceType;
  format: string;
  width?: number;
  height?: number;
  duration?: number; // videos only
  original_filename: string;
}

export interface GalleryImage {
  id: string;
  link: string;
  name: string;
}

export interface ImageChange{
  indexBLock: number;
  indexImage: number;
}

export interface GitHubInfo{
  link: string;
  text: string;
  description: string;
}

export interface CodeInfo{
  fileName: string;
  code: string;
}

export interface post{
  id: UUID;
  published: boolean;
  date: string;
  type: string;
  title: string;
  description: string;
  languages: LanguageType[];
  content: Block[],
  cont: number;
}

export interface BasePost{
  id: UUID;
  title: string;
  published: boolean;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  downloadUrl: string;
  previewUrl: string;
  createdAt: string | null | undefined;
  size: string | null | undefined;
}