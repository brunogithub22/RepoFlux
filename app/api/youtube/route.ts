// app/api/youtube/route.ts
import { LinkYoutube } from '@/components/intefaces';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const API_KEY = process.env.YOUTUBE_PRIVATE_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
  
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=20&type=video`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) throw new Error(data.error.message);

    const videos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
    }));

    const { origin } = new URL(request.url);

    await Promise.all(
      videos.map(async (video: LinkYoutube) => {
        try {
          const response = await fetch(`${origin}/api/drizzle/helper/admin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              actionName: "addYoutube",
              payload: {
                title: video.title,
                link: video.videoUrl,
                id: video.id,
              },
            }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Failed to add video");
          console.log("Added video:", video.title);
        } catch (error) {
          console.error("Error calling API:", error);
        }
      })
    );

    const actionName = "removeYoutube"; // The "function name" your API expects

    try { 
      const response = await fetch(`${origin}/api/drizzle/helper/admin`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionName: actionName,
          payload: { 
            videos: videos
           } 
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to add youtube video to blog");
      }
      console.log("Success response:", result);
    } catch (error) {
      console.error("Error calling API:", error);
    }

    return NextResponse.json(videos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}