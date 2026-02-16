export interface LinkYoutube{
  id: string,
  title: string,
  thumbnail: string,
  videoUrl: string,
  embedUrl: string
}

export interface Block{
  type: string
  content: Gallery[] | Item[] | string;
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
}

export interface GalleryImage {
  id: string;
  link: string;
  public_id: string;
}