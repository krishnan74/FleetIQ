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
    const vendorInvoice = await prisma.vendorInvoice.findUniqueOrThrow({
      where: {
        id: context.params.id,
      },
      include: {
        vendor: true,
      },
    });
    return NextResponse.json(
      {
        message: "success",
        data: vendorInvoice,
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
