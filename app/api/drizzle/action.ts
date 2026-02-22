// app/api/tasks/actions.ts
import { languages,images,posts,youtube_video,link,github,code,postImage,textBlock,postVideo, feedback } from "@/src/db/schema";
import { addRow,deleteRow,searchItem,getAllRows,getItem } from "@/src/db/admin/dbOperation";
import { Block, CodeInfo, Gallery, GitHubInfo, Item, LinkYoutube, post } from "@/components/intefaces";
import { UUID } from "crypto";

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
    const check = await searchItem(images,{name: data.name});
    if(check){
        return {message: "image alrealdy exists"};
    }
    const result = await addRow(images, { id: data.public_id, link: data.image,name: data.name });
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
    const result = await deleteRow(images,{ id: data.publicId });
    if(result){
        return {message: 'image removed' };
    }else{
        return {message: 'image not removed' };
    }
  },
  newPage: async (data) =>{

    
    const Data = await searchItem(posts,{title: data.title});
    if(Data){
        return {message: "Post already exsist"};
    }

    const check = {link: true,list: true, image: true,textBlock: true, textArea: true,youtube: true,code: true, github: true}; 
    const date:string = new Date().toDateString();
    const id_post = crypto.randomUUID();

    try{
        const addPage = await addRow(posts,{ id: id_post,title: data.title ,type: data.category, description: data.description,date: date, languages: data.language });
        if(!Array.isArray(data.content)){return {message: "not array"}}
       // Use for...of to ensure each block is saved before moving to the next
        data.content.map(async (item: Block,index:number)=>{
            let text: string;
            switch (item.type) {
                case "image":
                    const images = item.content as Gallery[];
                    // Nested loop must also be for...of
                    images.map(async (image,id)=>{
                        const imgText = image.text?.trim() ? image.text : "";
                        const addImage = await addRow(postImage, {
                            id: crypto.randomUUID(),
                            postId: id_post,
                            imageId: image.id,
                            text: imgText,
                            idBlock: index,
                            index: id
                        });
                        if (!addImage) check.image = false;
                    }) 
                    break;

                case "link":
                case "list":
                    const items = item.content as Item[];
                    items.map(async (itemofList,id)=>{
                        const linkText = itemofList.link?.trim() ? itemofList.link : "";
                        const additem = await addRow(link, {
                            id: crypto.randomUUID(),
                            postId: id_post,
                            name: itemofList.name,
                            imageId: itemofList.icon.id,
                            link: linkText,
                            type: item.type,
                            idBlock: index,
                            index: id
                        });
                        if (!additem) {
                            if (item.type === "list") check.list = false;
                            else check.link = false;
                        }
                    })
                    break;
                case "textBlock":
                case "textAreaBlock":
                    text = item.content as string;
                    const addText = await addRow(textBlock,{
                        id: crypto.randomUUID(),
                        postId: id_post,
                        type: item.type,
                        text: text,
                        idBlock: index
                    });
                    if(addText){
                        console.log("Text added");
                    }else{
                        console.log("Text not added");
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
                    const addYoutube = await addRow(postVideo,{
                        id: crypto.randomUUID(),
                        postId: id_post,
                        videoId:youtube[0].id,
                        text: text,
                        idBlock: index
                    });
                    if(addYoutube){
                        console.log("Youtube video", youtube[0].id, "added");
                    }else{
                        console.log("Youtube video", youtube[0].id, "not added");
                        check.youtube = false;
                    }
                    break;
                case "code":
                    const Code = item.content as CodeInfo;
                    const addCode = await addRow(code,{
                        id: crypto.randomUUID(),
                        postId: id_post,
                        code:Code.code,
                        filename: Code.fileName,
                        idBlock: index
                    });
                    if(addCode){
                        console.log("Code added");
                    }else{
                        console.log("Code not added");
                        check.code = false;
                    }
                    break;
                case "github":
                    const Github = item.content as GitHubInfo;
                    const addGitHub = await addRow(github,{
                        id: crypto.randomUUID(),
                        postId: id_post,
                        description: Github.description,
                        link:Github.link,
                        text:Github.text,
                        idBlock: index
                    });
                    if(addGitHub){
                        console.log("Repository added");
                    }else{
                        console.log("Repository not added");
                       check.github = false;
                    }
                    break;
            }
        
        });

        if (addPage && Object.values(check).every(v => v === true)) {
            return { message: 'page added' };
        } else {
            return { message: 'page not added' };
        }

    }catch(error){console.log(error); return{message:"error"}}
    
  },

  getPosts: async ()=>{

    const result: post[] = [];
    const getPost = async (postData: any) =>{
        const Post:post = {
            id: postData.id, 
            type: postData.type,
            title: postData.title, 
            description: postData.description,
            date: postData.date,
            content: [],
            published: postData.published,
            languages: postData.languages
        }

        //const contentCheck = {image: false, list: false, link: false, youtube: false, textBlock: false,textArea: false,code: false,github: false};
        const getBlocks = async (idPost: UUID) =>{
           
           const blocks:Block[] = [];

           const imagePost = await getItem(postImage,{postId: idPost}); 
           const youtubePost = await getItem(postVideo,{postId: idPost});
           const codePost = await getItem(code,{postId: idPost});
           const repositoryPost = await getItem(github,{postId: idPost});
           const listPost = await getItem(link,{postId: idPost,type: "list"});
           const linkPost = await getItem(link,{postId: idPost,type: "link"});
           
           if(imagePost.length > 0){
            console.log(imagePost);
           }
           if(youtubePost.length > 0){
            console.log(youtubePost);
           }
           if(codePost.length > 0){
            console.log(codePost);
           }
           if(repositoryPost.length > 0){
            console.log(repositoryPost);
           }
           if(linkPost.length > 0){
            console.log(linkPost);
           }
           if(listPost.length > 0){
            console.log(listPost);
           }

           return blocks
        }

        Post.content = await getBlocks(Post.id);
        console.log(Post);
    }
 
    const Data = await getItem(posts,{});
    Data.map((value) =>{
        console.log()
        getPost(value);
    })

    return Data;
  },

  removePost: async (data) =>{

  },

  getFeedbacks: async ()=>{
    const result = await getItem(feedback,{});
    if(result.length > 0){
        return result;
    }else{
        return [];
    }
  },
  
  modifyPost: async (data)=>{

  }

};

export const ActionUser: Record<string, (payload: any) => Promise<any>> = {

    getPost: async (data)=>{
        
    }
};