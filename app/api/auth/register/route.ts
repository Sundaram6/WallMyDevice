import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email: cleanEmail,
        password: hashedPassword,
        name: name && typeof name === "string" && name.trim() ? name.trim() : cleanEmail.split("@")[0],
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error("Registration Error:", error);

    if (error?.code === "P2002" || error?.message?.includes("Unique constraint")) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    return NextResponse.json({ error: error?.message || "Failed to create account. Please try again." }, { status: 500 });
  }
}
