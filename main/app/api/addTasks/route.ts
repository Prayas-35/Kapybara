"use server";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";

async function postHandler(req: Request) {
    const { title, dueDate } = await req.json();
    await db.insert(tasks).values({ title, dueDate });
    return NextResponse.json({ message: "Task added!" }, { status: 200});
}

export { postHandler as POST };