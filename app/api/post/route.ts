'use server'

import { NextResponse } from "next/server";

export async function  POST(request: Request) {
    try {
      const {
        blog,
        title,
        description,
        category,
        languages
      } = await request.json();
      
      console.dir(blog, { depth: null });
      
      const actionName = "newPage"; // The "function name" your API expects

      try { 
        const { origin } = new URL(request.url); 
        const response = await fetch(`${origin}/api/drizzle/helper/admin`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            actionName: actionName,
            payload: { 
              title: title,
              description: description,
              content: blog,
              category: category,
              languages: languages
             } 
          }),
        });
  
        const result = await response.json();
    
        if (!response.ok) {
          throw new Error(result.error || "Failed to add page to blog");
        }

        console.log("Success:", result);

      } catch (error) {
        console.error("Error calling API:", error);
      }
      
      return NextResponse.json({ status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
    }
}