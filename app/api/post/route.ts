'use server'

import { NextResponse } from "next/server";

export async function  POST(request: Request) {
    try {
      const {blog} = await request.json();
      console.dir(blog, { depth: null }); 
      return NextResponse.json({ status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
    }
}