"use server";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { verifyToken } from "@/app/_middleware/verify";
import { eq } from "drizzle-orm";

async function putHandler(req: Request) {
    try {
        const { id, title, description, status } = await req.json();
        const token = req.headers.get("Authorization");
        if (!token) {
            return NextResponse.json({ message: "Authorization token is required" }, { status: 401 });
        }

        const userId = await verifyToken(token);

        if (!id || !title || !description || !status || !userId) {
            return NextResponse.json({ message: "Task ID, title, description, status and userId are required" }, { status: 400 });
        }

        await db.update(tasks).set({
            title,
            description,
            status,
        }).where(eq(tasks.id, parseInt(id)));

        return NextResponse.json({ message: "Task updated successfully!" }, { status: 200 });
    } catch (error: any) {
        console.log("error", error);
        return NextResponse.json({ message: "Error updating task", error: error.message }, { status: 500 });
    }
}

export { putHandler as PUT };