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
    const body: TripTransaction = await req.json();
    const {
      amount,
      tripTransactionType,
      transactionType,
      transactionDate,
      transactionMode,
      transactionDescription,
      partyBalance,
    } = body;

    var newPartyBalance: number = 0;

    switch (tripTransactionType) {
      case "ADVANCE":
        newPartyBalance = partyBalance - amount;
        break;

      case "CHARGE":
        newPartyBalance = partyBalance + amount;
        break;

      case "PAYMENT":
        newPartyBalance = partyBalance - amount;
        break;

      default:
        break;
    }

    const trip = await prisma.trip.update({
      where: {
        id: context.params.id,
      },
      data: { partyBalance: newPartyBalance },
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

export async function POST(
  req: NextRequest,
  context: {
    params: {
      id: string;
    };
  }
) {
  try {
    const body: TripTransaction = await req.json();
    const {
      amount,
      tripTransactionType,
      transactionType,
      transactionDate,
      transactionMode,
      transactionDescription,
      partyBalance,
    } = body;

    const tripTransaction = await prisma.tripTransaction.create({
      data: {
        amount,
        tripTransactionType,
        transactionType,
        transactionDate,
        transactionMode,
        transactionDescription,

        trip: {
          connect: {
            id: context.params.id,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "success",
        data: tripTransaction,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while creating tripTransaction :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
