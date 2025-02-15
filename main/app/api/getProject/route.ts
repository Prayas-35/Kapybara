"use server";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/app/_middleware/verify";

async function postHandler(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return NextResponse.json({ message: "Authorization token is required" }, { status: 401 });
        }

        // ✅ Extract the token after "Bearer "
        const token = authHeader.split(" ")[1];
        if (!token) {
            return NextResponse.json({ message: "Invalid authorization format" }, { status: 401 });
        }

        const userId = await verifyToken(token);
        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const userProjects = await db.select().from(projects).where(eq(projects.userId, userId));

        return NextResponse.json({ projects: userProjects }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching projects", error: error.message }, { status: 500 });
    }
}


export { postHandler as POST };