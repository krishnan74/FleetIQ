import { NextResponse, NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { User } from "@/lib/createInterface";

export async function POST(req: NextRequest) {
  try {
    const body: User = await req.json();

    const { userName, phone, email, password } = body;

    const user = prisma.user.create({
      data: {
        userName,
        phone,
        email,
        password,
      },
    });

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
