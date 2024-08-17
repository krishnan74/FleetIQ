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
    const trips = await prisma.trip.findMany({
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
    const {
      from,
      to,
      vendorId,
      driverId,
      partyId,
      truckId,
      partyFreightAmount,
      vendorBalance,
      startKMSReadings,
      lrNumber,
      material,
      notes,
      startedAt,
    } = body;

    const partyBalance = partyFreightAmount;

    const party = await prisma.party.update({
      where: {
        id: partyId,
      },
      data: {
        totalBalance: {
          increment: partyFreightAmount,
        },
      },
    });

    // Create the trip with the nested vendor
    const trip = await prisma.trip.create({
      data: {
        from,
        to,
        status: TripStatus.PLANNED,
        profit: partyFreightAmount,
        vendor: {
          connect: {
            id: vendorId,
          },
        },
        driver: {
          connect: {
            id: driverId,
          },
        },
        party: {
          connect: {
            id: partyId,
          },
        },
        truck: {
          connect: {
            id: truckId,
          },
        },

        totalExpenseAmount: 0,
        partyFreightAmount,
        startKMSReadings,
        partyBalance,
        vendorBalance,
        lrNumber,
        material,
        notes,
        startedAt,
      },
      include: {
        vendor: true,
        driver: true,
        party: true,
        truck: true,
        transactions: true,
      },
    });

    const partyTransaction = await prisma.partyTransaction.create({
      data: {
        partyId,
        amount: partyFreightAmount,

        transactionType: TripTransactionType.FREIGHT,
        transactionDate: new Date().toISOString(),
        transactionMode: TransactionMode.CASH,
        transactionDescription: "Party Freight Amount",
      },
    });

    const vendorTransaction = await prisma.vendorTransaction.create({
      data: {
        vendorId,
        amount: vendorBalance,
        transactionType: ExpenseType.Truck_Hire_Cost,
        transactionDate: new Date().toISOString(),
        transactionMode: TransactionMode.CASH,
        transactionDescription: "Vendor Truck Hire Cost",
      },
    });

    const expense = await prisma.expense.create({
      data: {
        amount: vendorBalance,
        expenseType: ExpenseType.Truck_Hire_Cost,

        trip: {
          connect: {
            id: trip.id,
          },
        },
      },
    });

    const updateTrip = await prisma.trip.update({
      where: {
        id: trip.id,
      },
      data: {
        totalExpenseAmount: {
          increment: vendorBalance,
        },

        profit: {
          decrement: vendorBalance,
        },
      },
    });

    const vendor = await prisma.vendor.update({
      where: {
        id: vendorId,
      },

      data: {
        totalBalance: vendorBalance,
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
