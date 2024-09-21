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
    const invoiceId = context.params.id;
    const partyInvoice = await prisma.partyInvoice.findUnique({
      where: {
        id: invoiceId,
      },
      include: {
        party: true,
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
    console.log("Error while fetching invoice :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
