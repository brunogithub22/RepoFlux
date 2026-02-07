import { dbAdmin } from "@/src/index"; // Your Drizzle admin instance
import { languages } from "@/src/db/schema";
import { eq } from "drizzle-orm";

// Get all languages
export async function getAllLanguages() {
  try {
    return await dbAdmin.select().from(languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
}

// Add a language
export async function addLanguage(languageName: string) {
  try {
    await dbAdmin.insert(languages).values({
      id: crypto.randomUUID(),
      language: languageName,
    });
    return true;
  } catch (error) {
    console.error("Error inserting language:", error);
    return false;
  }
}

// Delete a language by ID
export async function deleteLanguage(languageId: string) {
  try {
    await dbAdmin.delete(languages).where(eq(languages.id, languageId));
    return true;
  } catch (error) {
    console.error("Error deleting language:", error);
    return false;
  }
}