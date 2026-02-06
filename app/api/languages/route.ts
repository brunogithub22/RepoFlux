import { NextResponse } from 'next/server';
import yaml from 'js-yaml';

export async function GET() {
  try {
    // 1. We call the link DIRECTLY without saving any file
    const githubLink = 'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml';
    const response = await fetch(githubLink);

    if (!response.ok) throw new Error('GitHub link is down');

    // 2. We take the "raw text" from that link
    const rawYaml = await response.text();

    // 3. We turn that text into a JavaScript object immediately
    const data = yaml.load(rawYaml) as any;

    // 4. We extract the names and send them to your frontend
    const languageNames = Object.keys(data);

    return NextResponse.json(languageNames);
  } catch (error) {
    return NextResponse.json({ error: "Couldn't use the link" }, { status: 500 });
  }
}