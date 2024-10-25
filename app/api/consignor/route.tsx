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

    const consignors = await prisma.consignor.findMany({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json(
      {
        message: "success",
        data: consignors,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while fetching consignors :: ", e);
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

    const consignor = await prisma.consignor.create({
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
        data: consignor,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while creating consignor :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
