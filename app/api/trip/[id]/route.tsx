import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TripTransaction } from "@/lib/createInterface";

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
      id: string
    }
  }
)
{
  try {

    const body = await req.json();
    const { 
status, completedAt
    } = body
    
    const trip = await prisma.trip.update({
      where: {
        id: context.params.id,
      },
      data: {
        status, 
        completedAt,
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
    console.log("Error while updating trip :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}