"use server";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { verifyToken } from "@/app/_middleware/verify";
import { eq } from "drizzle-orm";

async function deleteHandler(req: Request) {
    try {
        const { id } = await req.json();
        const token = req.headers.get("Authorization");
        if (!token) {
            return NextResponse.json({ message: "Authorization token is required" }, { status: 401 });
        }

        const userId = await verifyToken(token);
        console.log("details", id, userId);

        if (!id || !userId) {
            return NextResponse.json({ message: "Task ID and userId are required" }, { status: 400 });
        }

        await db.delete(tasks).where(eq(tasks.id, parseInt(id)));

        return NextResponse.json({ message: "Task deleted successfully!" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error deleting task", error: error.message }, { status: 500 });
    }
}

export { deleteHandler as DELETE };