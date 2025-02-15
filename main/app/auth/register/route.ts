"use server";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET as string;

async function postHandler(req: Request) {
    try {
        const { name, email, password } = await req.json();

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert the new user and return the inserted record
        const [newUser] = await db.insert(users)
            .values({ name, email, passwordHash })
            .returning({ uId: users.id }); // Adjust field name based on your schema

        if (!newUser) {
            return NextResponse.json({ error: "User creation failed" }, { status: 500 });
        }

        // Generate a JWT token for the user
        const token = jwt.sign({ uId: newUser.uId }, secretKey, { expiresIn: "30d" });

        return NextResponse.json({ message: "User added!", token }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export { postHandler as POST };
