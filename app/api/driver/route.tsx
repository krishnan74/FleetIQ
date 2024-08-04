import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { DriverStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const drivers = await prisma.driver.findMany();
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
    const body = await req.json();

    const driver = await prisma.driver.create({
      data: {
        name: body.name,
        phone: body.phone,
        status: DriverStatus.AVAILABLE,
        balance: 0,
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
