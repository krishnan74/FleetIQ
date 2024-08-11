import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function POST(
  req: NextRequest,
  context: {
    params: {
      id: string;
    };
  }
) {
  const body = await req.json();
  const {
    amount,
    driverBalance,
    transactionType,
    transactionMode,
    transactionDate,
    transactionDescription,
  } = body;

  try {
    const driverTransaction = await prisma.driverTransaction.create({
      data: {
        amount,
        driverId: context.params.id,
        transactionType,
        transactionMode,
        transactionDate,
        transactionDescription,
        driverBalance,
      },
    });

    return NextResponse.json(
      {
        message: "success",
        data: driverTransaction,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while creating driver transaction :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
