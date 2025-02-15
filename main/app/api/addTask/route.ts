"use server";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { verifyToken } from "@/app/_middleware/verify";

async function postHandler(req: Request) {
    try {
        const { title, description, dueDate, priority, status, projectId } = await req.json();
        const token = req.headers.get("Authorization");

        if (!token) {
            return NextResponse.json({ message: "Authorization token is required" }, { status: 401 });
        }

        const userId = await verifyToken(token);

        if (!title || !projectId || !userId) {
            return NextResponse.json({ message: "Title, projectId, and userId are required" }, { status: 400 });
        }

        console.log("details", title, description, dueDate, priority, status, projectId, userId);

        await db.insert(tasks).values({
            title,
            description,
            dueDate: dueDate ? new Date(dueDate + "Z") : null, // Preserve IST time while converting to UTC
            priority: priority ? parseInt(priority) : 3,
            status: status ?? "pending",
            projectId: parseInt(projectId),
            userId,
            createdAt: new Date(),
        });        

        return NextResponse.json({ message: "Task added successfully!" }, { status: 200 });
    } catch (error: any) {
        console.log("error", error);
        return NextResponse.json({ message: "Error adding task", error: error.message }, { status: 500 });
    }
}

export { postHandler as POST };
