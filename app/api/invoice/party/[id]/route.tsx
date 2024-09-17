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
    const partyInvoices = await prisma.partyInvoice.findUniqueOrThrow({
      where: {
        id: context.params.id,
      },
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
