import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
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
    console.log("Error while fetching userDetails :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Parse the request body to get user details
    const userData = await req.json();

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: userData,
    });

    return NextResponse.json(
      {
        message: "User updated successfully",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while updating userDetails :: ", e);
    return NextResponse.json(
      { message: "Failed to update user", error: e.message },
      { status: 500 }
    );
  }
}
