import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const vendors = await prisma.vendor.findMany({
      where: {
        name: {
          not: "Own Vendor",
        },
        userId,
      },
      include: {
        trips: true,
        trucks: true,
      },
    });
    return NextResponse.json(
      {
        message: "success",
        data: vendors,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while fetching vendors :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, email, phone } = body;

    const vendor = await prisma.vendor.create({
      data: {
        name,
        email,
        phone,
        totalBalance: 0,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "success", data: vendor },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while creating vendor :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
