import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { TripStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        vendor: {
          include: {
            address: true,
          },
        },
      },
    });
    return NextResponse.json(
      {
        message: "success",
        data: trips,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while fetching trips :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Body :: ", body);

    // Create the trip with the nested vendor
    const trip = await prisma.trip.create({
      data: {
        from: body.from,
        status: TripStatus.PLANNED,
        to: body.to,
        vendor: {
          connect: {
            id: body.vendorId,
          },
        },

        driver: {
          connect: {
            id: body.driverId,
          },
        },

        party: {
          connect: {
            id: body.partyId,
          },
        },

        truck: {
          connect: {
            id: body.truckId,
          },
        },
      },
      include: {
        vendor: true,
        driver: true,
        party: true,
      },
    });

    return NextResponse.json(
      { message: "success", data: trip },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while creating trip :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
