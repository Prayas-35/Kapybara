"use server";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { verifyToken } from "@/app/_middleware/verify";

async function postHandler(req: Request) {
    try {
        const { name, description } = await req.json();
        const token = req.headers.get("Authorization");
        if (!token) {
            return NextResponse.json({ message: "Authorization token is required" }, { status: 401 });
        }

        const userId = await verifyToken(token);
        
        if (!name || !userId) {
            return NextResponse.json({ message: "Name and userId are required" }, { status: 400 });
        }

        console.log("details", name, description, userId);
        
        await db.insert(projects).values({
            name,
            description,
            userId,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: "Project added successfully!" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error adding project", error: error.message }, { status: 500 });
    }
}

export { postHandler as POST };