// app/api/tasks/actions.ts

import { addLanguage,deleteLanguage,getAllLanguages } from "@/src/db/admin/dbOperation";

export const actions: Record<string, (payload: any) => Promise<any>> = {
  newLanguage: async (data) => {
    const result = await addLanguage(data.language);
    if(result){
        return { status: 200,message: 'language added' };
    }else{
        return { status: 404,message: 'language not added' };
    }
  },
  getLanguages: async () =>{
    const result = await getAllLanguages();
    if(result.length > 0){
        return result;
    }else{
        return [];
    }
  },
  removeLanguage: async (data) =>{
    const result = await deleteLanguage(data.id);
    if(result){
        return { status: 200,message: 'language removed' };
    }else{
        return { status: 404,message: 'language not removed' };
    }
  }
};