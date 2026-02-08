// app/api/tasks/actions.ts
'use server';

import { languages,images } from "@/src/db/schema";
import { addRow,deleteRow,searchItem,getAllRows, } from "@/src/db/admin/dbOperation";

export const actions: Record<string, (payload: any) => Promise<any>> = {
  newLanguage: async (data) => {
    const result = await addRow(languages, { id: crypto.randomUUID(), language: data.language });
    if(result){
        return { message: 'language added' };
    }else{
        return { message: 'language not added' };
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
    const result = await deleteRow(languages,data.id);
    if(result){
        return {message: 'language removed' };
    }else{
        return {message: 'language not removed' };
    }
  },
  newImage: async (data)=>{
    const result = await addRow(images, { id: crypto.randomUUID(), link: data.image });
    if(result){
        return { message: 'image added' };
    }else{
        return { message: 'image not added' };
    }
  }
};