import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TripTransaction } from "@/lib/createInterface";
import { DriverStatus, TripStatus, TruckStatus } from "@prisma/client";

export async function GET(
  req: NextRequest,
  context: {
    params: {
      id: string;
    };
  }
) {
  try {
    const trip = await prisma.trip.findUnique({
      where: {
        id: context.params.id,
      },
      include: {
        vendor: true,
        driver: true,
        party: true,
        truck: true,
        transactions: true,
        expenses: true,
        onlineBilty: true,
      },
    });

    return NextResponse.json(
      {
        message: "success",
        data: trip,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while fetching trip :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: {
    params: {
      id: string;
    };
  }
) {
  try {
    const body = await req.json();
    const { status, completedAt, endKMSReadings } = body;
    let trip;
    switch (status) {
      case TripStatus.COMPLETED:
        trip = await prisma.trip.update({
          where: {
            id: context.params.id,
          },
          data: {
            status,
            completedAt,
            endKMSReadings,
          },
        });

        const driver = await prisma.driver.update({
          where: {
            id: trip.driverId,
          },
          data: {
            status: DriverStatus.AVAILABLE,
          },
        });

        const truck = await prisma.truck.update({
          where: {
            id: trip.truckId,
          },
          data: {
            status: TruckStatus.AVAILABLE,
          },
        });

      case TripStatus.POD_RECEIVED:
        trip = await prisma.trip.update({
          where: {
            id: context.params.id,
          },
          data: {
            status,
          },
        });

      case TripStatus.POD_SUBMITTED:
        trip = await prisma.trip.update({
          where: {
            id: context.params.id,
          },
          data: {
            status,
          },
        });

      case TripStatus.SETTLED:
        trip = await prisma.trip.update({
          where: {
            id: context.params.id,
          },
          data: {
            status,
          },
        });
    }

    return NextResponse.json(
      {
        message: "success",
        data: trip,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while updating trip :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
