import { dbAdmin } from "@/src/index"; // Your Drizzle admin instance
import { languages } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Get all languages
export async function getAllLanguages() {
  try {
    const result = await dbAdmin.select().from(languages);
    return  result;
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
}

// Add a language
export async function addLanguage(languageName: string) {
  try {

    if(await searchLanguage(languageName)){
      return false;
    }

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

export async function searchLanguage(language: string){

  try {
    const result = await dbAdmin.select().from(languages).where(eq(languages.language, language));
    if(result.length > 0){
      return true;
    }else{
      return false;
    }
  } catch (error) {
    console.error("Error fetching languages:", error);
    throw new Error("Error to search the language");
  }
}