import { NextResponse, NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { User } from "@/lib/createInterface";

import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body: User = await req.json();
    const { userName, phone, email, password } = body;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        userName,
        phone,
        email,
        password: hashedPassword, // Store the hashed password
      },
    });

    console.log("User created successfully");

    return NextResponse.json(
      {
        message: "success",
        data: user,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while creating user :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
