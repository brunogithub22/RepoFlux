// app/api/tasks/actions.ts

import { languages,images,posts,youtube_video,link,github,code,postImage,textBlock,postVideo } from "@/src/db/schema";
import { addRow,deleteRow,searchItem,getAllRows, } from "@/src/db/admin/dbOperation";
import { Block, CodeInfo, Gallery, GitHubInfo, Item, LinkYoutube } from "@/components/intefaces";

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
    const result = await addRow(images, { id: data.id, public_id: data.public_id, link: data.image });
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

    const check = {link: true,list: true, image: true,textBlock: true, textArea: true,youtube: true,code: true, github: true} 
    const date:string = new Date().toDateString();
    const id_post = crypto.randomUUID();
    
    const addPage = await addRow(posts,{ id: id_post,title: data.title ,type: data.category, description: data.description,date: date, languages: languages });
    
    data.blog.map( async (item:Block,id:number)=>{
        let text: string;
        switch(item.type){
            case "image":
                const images = item.content as Gallery[]
                images.map( async(image,index)=>{
                    const text:string = image.text?.trim() ? image.text : "";
                    const addImage = await addRow(postImage,{id: crypto.randomUUID(),postId: id_post,imageId: image.id,text: text});
                    if(addImage){
                        console.log("Image", image.id, "added");
                    }else{
                        console.log("Image", image.id, "not added");
                        check.image = false;
                    }
                });
                break;
            case "textBlock":
            case "textAreaBlock":
                text = item.content as string;
                const addText = await addRow(textBlock,{id: crypto.randomUUID(),postId: id_post,type: item.type,text: text});
                if(addText){
                    console.log("Text", id, "added");
                }else{
                    console.log("Text", id, "not added");
                    if(item.type === "textBlock"){
                        check.textBlock = false;
                    }else{
                        check.textArea = false;
                    }
                }
                break;    
            case "youtube":
                const youtube = item.content as Gallery[]
                text = youtube[0].text?.trim() ? youtube[0].text : "";
                const addYoutube = await addRow(postVideo,{id: crypto.randomUUID(),postId: id_post,videoId:youtube[0].id,text:text});
                if(addYoutube){
                    console.log("Youtube video", youtube[0].id, "added");
                }else{
                    console.log("Youtube video", youtube[0].id, "not added");
                    check.youtube = false;
                }
                break;
            case "code":
                const Code = item.content as CodeInfo;
                const addCode = await addRow(code,{id: crypto.randomUUID(),postId: id_post,code:Code.code,filename: Code.fileName});
                if(addCode){
                    console.log("Code", id, "added");
                }else{
                    console.log("Code", id, "not added");
                    check.code = false;
                }
                break;
            case "github":
                const Github = item.content as GitHubInfo;
                const addGitHub = await addRow(github,{id: crypto.randomUUID(),postId: id_post,description: Github.description,link:Github.link,text:Github.text});
                if(addGitHub){
                    console.log("Repository", id, "added");
                }else{
                    console.log("Repository", id, "not added");
                    check.github = false;
                }
                break;
            case "link":
            case "list":
                const items = item.content as Item[]
                items.map( async(itemofList,index)=>{
                    const text:string = itemofList.link?.trim() ? itemofList.link : "";
                    const additem = await addRow(link,{id: crypto.randomUUID(),postId: id_post,name: itemofList.name,imageId: itemofList.idImage,link: text,type: item.type});
                    if(additem){
                        console.log("Item", item.type, itemofList.name, "added");
                    }else{
                        console.log("Item", item.type, itemofList.name, "not added");
                        if(item.type === "list"){
                            check.list = false;
                        }else{
                            check.link = false;
                        }
                    }
                });
                break;    
        }
    });
    if(addPage && Object.values(check).every(value => value === true)){
        return {message: 'page added' };
    }else{
        return {message: 'page not added' };
    }

  },

};

export const ActionUser: Record<string, (payload: any) => Promise<any>> = {

};