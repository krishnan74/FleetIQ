import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TruckStatus } from "@prisma/client";
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

    const trucks = await prisma.truck.findMany({
      where: {
        userId,
      },
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
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const body = await req.json();
    const {
      registrationNumber,
      truckType,
      truckOwnerShip,
      driverId,
      vendorId,
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
