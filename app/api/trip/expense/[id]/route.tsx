import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Expense } from "@/lib/createInterface";

export async function POST(
  req: NextRequest,
  context: {
    params: {
      id: string;
    };
  }
) {
  try {
    const body: Expense = await req.json();
    const { amount, expenseType } = body;

    const expense = await prisma.expense.create({
      data: {
        amount,
        expenseType,

        trip: {
          connect: {
            id: context.params.id,
          },
        },
      },
    });

    const trip = await prisma.trip.update({
      where: {
        id: context.params.id,
      },
      data: {
        totalExpenseAmount: {
          increment: amount,
        },

        profit: {
          decrement: amount,
        },
      },
    });

    return NextResponse.json(
      {
        message: "success",
        data: expense,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while creating expense :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
