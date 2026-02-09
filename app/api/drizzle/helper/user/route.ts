import { NextResponse } from "next/server";
import { ActionUser } from '@/app/api/drizzle/action';

export async function POST(request: Request) {
  try {
    const { actionName, payload } = await request.json();

    // Look up the function in our actions object
    const selectedFunction = ActionUser[actionName];

    if (!selectedFunction) {
      return NextResponse.json({ error: "Invalid function name" }, { status: 400 });
    }

    // Execute the function
    const result = await selectedFunction(payload);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}