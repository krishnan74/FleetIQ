import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany();

    return NextResponse.json(
      {
        message: "success",
        data: users,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while fetching users :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
