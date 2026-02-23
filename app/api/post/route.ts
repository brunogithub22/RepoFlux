'use server'

import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { blog, title, description, category, postLanguages,cont } = await request.json();
        const actionName = "newPage";
        const { origin } = new URL(request.url);

        // 1. Execute the second fetch
        const response = await fetch(`${origin}/api/drizzle/helper/admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                actionName,
                payload: { 
                    title: title, 
                    description: description, 
                    content: blog, 
                    category: category,
                    language: postLanguages,
                    cont:cont 
                }
            }),
        });

        const result = await response.json();

        // 2. CHECK if the second fetch failed
        if (!response.ok) {
            // Return the EXACT error from the second API to the client
            return NextResponse.json(
                { error: result.error || "Database operation failed" }, 
                { status: response.status }
            );
        }

        // 3. Success!
        console.log("Success of post:", result);
        return NextResponse.json({ message: "Success", result }, { status: 200 });

    } catch (error: any) {
        // 4. Catch unexpected crashes (Network issues, JSON parsing errors)
        console.error("Global API Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" }, 
            { status: 500 }
        );
    }
}