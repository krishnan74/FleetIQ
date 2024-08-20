import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {
  ExpenseType,
  TransactionMode,
  TripStatus,
  TripTransactionType,
} from "@prisma/client";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const trip = await prisma.trip.findMany({
      include: {
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
    console.log("Error while fetching trips :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}