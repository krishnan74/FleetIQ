import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { DriverStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

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

    const drivers = await prisma.driver.findMany({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json(
      {
        message: "success",
        data: drivers,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while fetching drivers :: ", e);
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

    const { name, phone, balance, driverPay } = body;

    let newBalance = 0;

    if (driverPay === "driverPay") {
      newBalance = balance;
    } else {
      newBalance = -balance;
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        phone,
        status: DriverStatus.AVAILABLE,
        balance: newBalance,
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
        data: driver,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while creating driver :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
