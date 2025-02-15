"use server";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/app/_middleware/verify";

async function getHandler(req: Request) {
    try {
        const token = req.headers.get("Authorization");
        if (!token) {
            return NextResponse.json({ message: "Authorization token is required" }, { status: 401 });
        }
        const userId = await verifyToken(token);
        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }
        const user = await db.select().from(users).where(eq(users.id, userId));
        return NextResponse.json(user, { status: 200 });
    }
    catch (error: any) {
        return NextResponse.json({ message: "Error fetching user", error: error.message }, { status: 500 });
    }
}

export { getHandler as GET };