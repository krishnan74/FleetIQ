import { NextResponse, NextRequest } from "next/server";
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

    const consignees = await prisma.consignee.findMany({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json(
      {
        message: "success",
        data: consignees,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while fetching consignees :: ", e);
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

    const {
      gstNumber,
      name,
      addressLine1,
      addressLine2,
      state,
      zipCode,
      phone,
    } = await req.json();

    const consignee = await prisma.consignee.create({
      data: {
        gstNumber,
        name,
        addressLine1,
        addressLine2,
        state,
        zipCode,
        phone,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "success",
        data: consignee,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while creating consignee :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
