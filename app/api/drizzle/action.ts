// app/api/tasks/actions.ts
import { languages,images,posts,youtube_video,link,github,code,postImage,textBlock,postVideo, feedback, files } from "@/src/db/schema";
import { addRow,deleteRow,searchItem,getAllRows,getItem,modifyRow } from "@/src/db/admin/dbOperation";
import { Block, CodeInfo, Gallery, GitHubInfo, Item, LinkYoutube, BasePost,post, LanguageType, DriveFile } from "@/components/intefaces";
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

    const check = {
        link: true,
        list: true, 
        image: true,
        textBlock: true, 
        textArea: true,
        youtube: true,
        code: true, 
        github: true,
        file: true
    }; 
    const date:string = new Date().toDateString();
    const id_post = crypto.randomUUID();

    try{
        const addPage = await addRow(posts,{ 
            id: id_post,
            title: data.title,
            type: data.category, 
            description: data.description,
            date: date, 
            languages: data.language,
            numContent: data.cont 
        });
        if(!Array.isArray(data.content)){return {message: "not array"}}
       // Use for...of to ensure each block is saved before moving to the next
        data.content.map(async (item: Block,index:number)=>{
            let text: string;
            switch (item.type) {
                case "file":
                    const file = item.content as DriveFile;
                    const addfile = await addRow(files,{
                        id: crypto.randomUUID(),
                        postId: id_post,
                        name: file.name,
                        link_download: file.downloadUrl,
                        link_preview: file.previewUrl,
                        mime_type: file.mimeType,
                        createdAt: file.createdAt as string,
                        size: file.size as string,
                        idBlock: index
                    });
                    if(addfile){
                        console.log("File added");
                    }else{
                        check.file = false;
                        console.log("File not added");
                    }
                    break;
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

    // 1. Refactor getPost to RETURN the object instead of pushing to an external array
    const getPost = async (postData: any): Promise<BasePost> => {
      return {
        id: postData.id,
        title: postData.title,
        published: postData.isPublished,
      };
    };

    const Data = await getItem(posts, {});

    const result: BasePost[] = await Promise.all(
      Data.map((value) => getPost(value))
    );

    return result;
  },

  getPost: async (data) =>{

    const getBlocks = async (idPost: UUID, cont: number) => {
      const blocks: Block[] = [];

      for (let indexBlock = 0; indexBlock < cont; indexBlock++) {
        let item: Gallery[] | Item[] | string | CodeInfo | GitHubInfo | DriveFile = "";
        const block: Block = { type: "", content: [] };

        // 1. Fetch the relations
        const imagePost = await getItem(postImage, { postId: idPost, idBlock: indexBlock });
        const listPost = await getItem(link, { postId: idPost, idBlock: indexBlock, type: "list" });
        const linkPost = await getItem(link, { postId: idPost, idBlock: indexBlock, type: "link" });
        const youtubePost = await getItem(postVideo, { postId: idPost, idBlock: indexBlock });
        const textBlockPost = await getItem(textBlock, { postId: idPost, idBlock: indexBlock, type: "textBlock" });
        const textAreaBlockPost = await getItem(textBlock, { postId: idPost, idBlock: indexBlock, type: "textAreaBlock" });  
        const githubPost = await getItem(github, { postId: idPost, idBlock: indexBlock});  
        const codePost = await getItem(code, { postId: idPost, idBlock: indexBlock });  
        const filePost = await getItem(files, { postId: idPost, idBlock: indexBlock }); 
        
        const listOfImage = Array.isArray(imagePost) ? imagePost : [];
        const listOflists = Array.isArray(listPost) ? listPost : [];
        const listOflinks = Array.isArray(linkPost) ? linkPost : [];
        const listOfyoutube = Array.isArray(youtubePost) ? youtubePost : [];
        const listOfTextBlock = Array.isArray(textBlockPost) ? textBlockPost : [];
        const listOfTextAreaBlock = Array.isArray(textAreaBlockPost) ? textAreaBlockPost : [];
        const listOfgithub = Array.isArray(githubPost) ? githubPost : [];
        const listOfcode = Array.isArray(codePost) ? codePost : [];
        const listOffile = Array.isArray(filePost) ? filePost : [];
        
        
        // 2. FIX: Use for...of instead of .map() to respect 'await'
        if (listOfImage.length > 0) {
          block.type = "image";
          const galleryItems: Gallery[] = [];
          for (const image of listOfImage) {
            const imageInfo = await getItem(images, { id: image.imageId });
            if (imageInfo.length === 1) {
              galleryItems.push({
                id: imageInfo[0].id,
                link: imageInfo[0].link,
                text: image.text
              } as Gallery);
            }
          }
          item = galleryItems;
        }

        if(listOffile.length > 0){
            block.type = "file"
            item = listOffile[0] as DriveFile;
        }

        if (listOflinks.length > 0) {
          let index: number = 0;
          block.type = "link";
          const LinkItems: Item[] = [];
          for (const linkItem of listOflinks) {
            const linkInfo = await getItem(link, { postId: idPost, idBlock: indexBlock, type: "link", index: index });
            const imageInfo = await getItem(images, { id: linkItem.imageId });
            if (imageInfo.length === 1) {
              
              if (linkInfo.length === 1) {
                LinkItems.push({
                  name: linkInfo[0].name,
                  icon: {
                      id: imageInfo[0].id,
                      link: imageInfo[0].link
                    } as Gallery,
                  link: linkInfo[0].link
                } as Item)
              }
            } 
            index++;
          }
          item = LinkItems;
        }

        if (listOflists.length > 0) {
          let index: number = 0;
          block.type = "list";
          const ListItems: Item[] = [];
          for (const listItem of listOflists) {
            const listInfo = await getItem(link, { postId: idPost, idBlock: indexBlock, type: "list", index: index });
            const imageInfo = await getItem(images, { id: listItem.imageId });
            if (imageInfo.length === 1) {
              
              if (listInfo.length === 1) {
                ListItems.push({
                  name: listInfo[0].name,
                  icon: {
                      id: imageInfo[0].id,
                      link: imageInfo[0].link
                    } as Gallery,
                  link: listInfo[0].link
                } as Item)
              }
            } 
            index++;
          }
          item = ListItems;
        }

        if(listOfyoutube.length > 0){
            block.type = "youtube"
            const YoutubeItems: Gallery[] = [];
            const youtubeInfo = await getItem(youtube_video, { id: listOfyoutube[0].videoId });
            if(youtubeInfo.length === 1){
                YoutubeItems.push({
                id: youtubeInfo[0].id,
                link: youtubeInfo[0].link,
                text: listOfyoutube[0].text
              } as Gallery);
            }
            item = YoutubeItems;
        }

        if(listOfTextBlock.length > 0){
            block.type = "textBlock"
            item = listOfTextBlock[0].text;
        }

        if(listOfTextAreaBlock.length > 0){
            block.type = "textAreaBlock"
            item = listOfTextAreaBlock[0].text;
        }

        if(listOfgithub.length > 0){
            block.type = "github";
            const GithubItems: GitHubInfo = {
                link: listOfgithub[0].link,
                text: listOfgithub[0].text,
                description: listOfgithub[0].description
            };
            item = GithubItems;
        
        }

        if(listOfcode.length > 0){
            block.type = "code";
            const Code: CodeInfo = {
                code: listOfcode[0].code,
                fileName: listOfcode[0].filename
            }
            item = Code;
        }

        block.content = item;
        blocks.push(block);
     }

     return blocks;
    };

    const get = async (postData: any): Promise<post> => {
      return {
        id: postData.id,
        type: postData.type,
        title: postData.title,
        description: postData.description,
        date: postData.date,
        content: await getBlocks(postData.id, postData.numContent), 
        published: postData.isPublished,
        languages: postData.languages,
        cont: postData.numContent,
      };
    };

    const Data = await getItem(posts, {id: data.id});
    const result: post[] = await Promise.all(
      Data.map((value) => get(value))
    );

    console.dir(result, { depth: null });
    return result;
  },

  removePost: async (data) =>{
    
    const remove = async (postData: any) => {
        // We return the Promise.all so the parent can await it
        return await Promise.all([
            deleteRow(postImage, { postId: postData.id }),
            deleteRow(link, { postId: postData.id, type: "list" }),
            deleteRow(link, { postId: postData.id, type: "link" }),
            deleteRow(postVideo, { postId: postData.id }),
            deleteRow(textBlock, { postId: postData.id, type: "textBlock" }),
            deleteRow(textBlock, { postId: postData.id, type: "textAreaBlock" }),
            deleteRow(github, { postId: postData.id }),
            deleteRow(code, { postId: postData.id }),
            deleteRow(files,{ postId: postData.id }),
            deleteRow(feedback,{ postId: postData.id}),
            deleteRow(posts, { id: postData.id })
        ]);
    };

    try {
        const Data = await getItem(posts, { id: data.post.id });
        
        if (Data.length === 0) {
            console.warn("No post found to delete.");
            return { success: false, message: "Post not found" };
        }

        // FIX: Use Promise.all with map to wait for ALL deletions for ALL items
        await Promise.all(Data.map((value) => remove(value)));

        console.log("All deletions completed successfully!");
        return { success: true };

    } catch (error) {
        console.error("Deletion failed:", error);
        return { success: false, error: error };
    }
  },

  getFeedbacks: async (data)=>{
    const result = await getItem(feedback,{postId: data.id});
    if(result.length > 0){
        return {data: result, message: true};
    }else{
        return {data: [], message: false};
    }
  },

  addFeedback: async (data)=>{
    const result = await addRow(feedback,{id: crypto.randomUUID(), feedback: data.text, valutation: data.valutation, postId: data.postId});
    return {message: result};
  },

  publish: async (data) =>{
     
    const Data: boolean = data.publish;
    const result = await modifyRow(posts,{isPublished: Data});
    console.log(result , "  ", Data);
    return {message: result, data: data};
  },

  checkImage: async (data) =>{

    const Images = await getItem(postImage,{imageId: data.image});
    if(Images.length>0){
        return {message: true};
    }else{
        return {message: false};
    }

  },
  checkLanguage: async (data) =>{

    const item = await getItem(posts,{});
    const Posts = Array.isArray(item) ? item : [];

    const result = Posts.some((post) => 
       post.languages.some((language: LanguageType) => language.language === data.language)
    );


    return {message: !result};
    
  },
  
  modifyPost: async (data)=>{

  }

};

export const ActionUser: Record<string, (payload: any) => Promise<any>> = {

    getPost: async (data)=>{
        
    }
};