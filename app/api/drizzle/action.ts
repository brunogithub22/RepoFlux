// app/api/tasks/actions.ts

import { languages,images,posts,youtube_video } from "@/src/db/schema";
import { addRow,deleteRow,searchItem,getAllRows, } from "@/src/db/admin/dbOperation";
import { LinkYoutube } from "@/components/intefaces";

export const ActionAdmin: Record<string, (payload: any) => Promise<any>> = {

  newLanguage: async (data) => {
    const check = await searchItem(languages,{language: data.language});
    if(check){
        return {message: 'language alrealdy exists'};
    }
    const result = await addRow(languages, { id: crypto.randomUUID(), language: data.language });
    if(result){
        return { message: 'language added' };
    }else{
        return { message: 'language not added' };
    }
  },
  addYoutube: async (data) =>{
    const check = await searchItem(youtube_video,{title: data.title});
    if(check){
        return {message: 'video youtube alrealdy exists'};
    }
    const result = await addRow(youtube_video, { id: data.id, title: data.title, link: data.link});
    if(result){
        return { message: 'video youtube added' };
    }else{
        return { message: 'video youtube not added' };
    }
  },
  removeYoutube: async (data) =>{
    const youtubeDB = await getAllRows(youtube_video);
    if(youtubeDB.length > 0){
        const youtubeIdSet = new Set(data.videos.map((v:LinkYoutube) => v.title));
        const missingVideos = youtubeDB.filter(dbVideo => !youtubeIdSet.has(dbVideo.title));
        const allPresent = missingVideos.length === 0;
        if (!allPresent) {
            console.log("These database videos are missing from YouTube:", missingVideos);
            await Promise.all(missingVideos.map(async (video) => {
                const result = await deleteRow(youtube_video, { title: video.title });
                if(result){
                    console.log("video removed: " + video);
                }else{
                    console.log("video not removed: "+ video);
                }
            }));
        }
    }
  },
  getLanguages: async () =>{
    const result = await getAllRows(languages);
    if(result.length > 0){
        return result;
    }else{
        return [];
    }
  },
  removeLanguage: async (data) =>{
    const result = await deleteRow(languages,{ id: data.Id });
    if(result){
        return {message: 'language removed' };
    }else{
        return {message: 'language not removed' };
    }
  },
  newImage: async (data)=>{
    const check = await searchItem(images,{link: data.image});
    if(check){
        return {message: 'image alrealdy exists'};
    }
    const result = await addRow(images, { id: crypto.randomUUID(), public_id: data.public_id, link: data.image });
    if(result){
        return { message: 'image added' };
    }else{
        return { message: 'image not added' };
    }
  },
  getImages: async () =>{
    const result = await getAllRows(images);
    if(result.length > 0){
        return result;
    }else{
        return [];
    }
  },
  removeImage: async (data) =>{
    const result = await deleteRow(images,{ public_id: data.publicId });
    if(result){
        return {message: 'image removed' };
    }else{
        return {message: 'image not removed' };
    }
  },
  newPage: async (data) =>{
    const date:string = new Date().toDateString();
    const result = await addRow(posts,{ id: crypto.randomUUID(),title: data.title ,type: data.category, description: data.description,date: date });
    if(result){
        return {message: 'page added' };
    }else{
        return {message: 'page not added' };
    }
  },

};

export const ActionUser: Record<string, (payload: any) => Promise<any>> = {

};