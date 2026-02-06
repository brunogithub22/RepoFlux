import GitHubLoginDemo from "./GitHub";
import { createSupabaseServerClient } from "@/lib/superbase/server";

export default async function GitHubLoginPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log( { user });
  return <GitHubLoginDemo user={user} />;
}