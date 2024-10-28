import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PartyInvoiceDetails } from "@/lib/createInterface";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const forInvoiceNumber = searchParams.get("forInvoiceNumber");

    if (forInvoiceNumber) {
      const latestInvoiceNumber = await prisma.partyInvoice.findFirst({
        orderBy: {
          invoiceNumber: "desc",
        },
      });

      return NextResponse.json(
        {
          message: "success",
          data: latestInvoiceNumber,
        },
        { status: 200 }
      );
    } else {
      const partyInvoices = await prisma.partyInvoice.findMany({
        include: {
          party: true,
        },
      });

      return NextResponse.json(
        {
          message: "success",
          data: partyInvoices,
        },
        { status: 200 }
      );
    }
  } catch (e: any) {
    console.log("Error while fetching invoices :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: PartyInvoiceDetails = await req.json();
    const { invoiceDate, dueDate, tripId, partyId } = body;

    const latestInvoiceNumber = await prisma.partyInvoice.findFirst({
      orderBy: {
        invoiceNumber: "desc",
      },
    });

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
    });

    let partyInvoice;

    if (!latestInvoiceNumber) {
      partyInvoice = await prisma.partyInvoice.create({
        data: {
          invoiceDate,
          dueDate,
          amount: trip?.partyFreightAmount || 0,
          balance: trip?.partyBalance || 0,
          tripId,
          invoiceNumber: 1,
          partyId,
        },
      });
    } else {
      partyInvoice = await prisma.partyInvoice.create({
        data: {
          invoiceDate,
          dueDate,
          amount: trip?.partyFreightAmount || 0,
          balance: trip?.partyBalance || 0,
          tripId,
          invoiceNumber: latestInvoiceNumber.invoiceNumber + 1,
          partyId,
        },
      });
    }

    return NextResponse.json(
      {
        message: "success",
        data: partyInvoice,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while creating invoice :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
