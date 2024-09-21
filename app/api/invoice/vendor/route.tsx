import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { VendorInvoiceDetails } from "@/lib/createInterface";

export async function GET(req: NextRequest) {
  try {
    const vendorInvoices = await prisma.vendorInvoice.findMany({
      include: {
        vendor: true,
      },
    });
    return NextResponse.json(
      {
        message: "success",
        data: vendorInvoices,
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
    const body: VendorInvoiceDetails = await req.json();
    const {
      invoiceDate,
      dueDate,
      amount,
      balance,
      tripIds,
      invoiceNumber,
      vendorId,
    } = body;

    const latestInvoiceNumber = await prisma.vendorInvoice.findFirst({
      orderBy: {
        invoiceNumber: "desc",
      },
    });

    let vendorInvoice;

    if (!latestInvoiceNumber) {
      vendorInvoice = await prisma.vendorInvoice.create({
        data: {
          invoiceDate,
          dueDate,
          amount,
          balance,
          tripIds,
          invoiceNumber: 0,
          vendorId,
        },
      });
    } else {
      vendorInvoice = await prisma.vendorInvoice.create({
        data: {
          invoiceDate,
          dueDate,
          amount,
          balance,
          tripIds,
          invoiceNumber: latestInvoiceNumber.invoiceNumber + 1,
          vendorId,
        },
      });
    }

    return NextResponse.json(
      {
        message: "success",
        data: vendorInvoice,
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
