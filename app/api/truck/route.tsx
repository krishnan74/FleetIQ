import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TruckStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const trucks = await prisma.truck.findMany({
      include: {
        trips: true,
        vendor: true,
        driver: true,
      },
    });
    return NextResponse.json(
      {
        message: "success",
        data: trucks,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while fetching trucks :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      registrationNumber,
      truckType,
      truckOwnerShip,
      driverId,
      vendorId,
      userId,
    } = body;

    const truck = await prisma.truck.create({
      data: {
        registrationNumber,
        truckType,
        truckOwnerShip,
        user: {
          connect: {
            id: userId,
          },
        },
        driver: {
          connect: {
            id: driverId,
          },
        },
        vendor: {
          connect: {
            id: vendorId,
          },
        },
        status: TruckStatus.AVAILABLE,
      },
      include: {
        driver: true,
        vendor: true,
      },
    });

    return NextResponse.json(
      { message: "success", data: truck },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while creating truck :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
