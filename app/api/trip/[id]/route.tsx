import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
    console.log("Error while fetching party :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}