"use server";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

const secretKey = process.env.JWT_SECRET as string;

//login handler
async function postHandler(req: Request) {
    try {
        const { email, password } = await req.json();

        // Find the user with the given email
        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Compare the password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // Generate a JWT token for the user
        const token = jwt.sign({ uId: user.id }, secretKey, { expiresIn: "30d" });

        return NextResponse.json({ message: "Login successful!", token }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export { postHandler as POST };