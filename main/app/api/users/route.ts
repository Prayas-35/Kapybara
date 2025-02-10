import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function GET() {
  const allUsers = await db.select().from(users);
  return NextResponse.json(allUsers);
}

export async function POST(req: Request) {
  const { name, email } = await req.json();
  await db.insert(users).values({ name, email });
  return NextResponse.json({ message: "User added!" }, { status: 201 });
}
