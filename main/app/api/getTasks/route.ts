"use server";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/app/_middleware/verify";

async function postHandler(req: Request) {
    try {
        const token = req.headers.get("Authorization");
        console.log("token", token);
        if (!token) {
            return NextResponse.json({ message: "Authorization token is required" }, { status: 401 });
        }
        const userId = await verifyToken(token);
        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }
        const userTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
        return NextResponse.json(userTasks, { status: 200 });
    }
    catch (error: any) {
        console.log("error", error);
        return NextResponse.json({ message: "Error fetching tasks", error: error.message }, { status: 500 });
    }
}

export { postHandler as POST };