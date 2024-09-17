import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PartyInvoiceDetails } from "@/lib/createInterface";

export async function GET(req: NextRequest) {
  try {
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
    const {
      invoiceDate,
      dueDate,
      amount,
      balance,
      tripId,
      invoiceNumber,
      partyId,
    } = body;

    const partyInvoice = await prisma.partyInvoice.create({
      data: {
        invoiceDate,
        dueDate,
        amount,
        balance,
        tripId,
        invoiceNumber,
        partyId,
      },
    });

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
