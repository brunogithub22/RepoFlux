import { dbPublic } from "@/src/index"; // Your Drizzle admin instance
import { posts } from "@/src/db/schema";
import { eq } from "drizzle-orm";

// Get all project
export async function getAllProjects() {
  try {
    return await dbPublic.select().from(posts).where(eq(posts.type, "project"));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// Get all software
export async function getAllSoftware() {
  try {
    return await dbPublic.select().from(posts).where(eq(posts.type, "software"));
  } catch (error) {
    console.error("Error fetching software:", error);
    return [];
  }
}
