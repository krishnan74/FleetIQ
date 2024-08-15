import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: {
    params: {
      id: string;
    };
  }
) {
  console.log("Fetching party with id :: ", context.params.id);
  try {
    const party = await prisma.party.findUnique({
      where: {
        id: context.params.id,
      },
      include: {
        trips: {
          include: {
            transactions: true,
          },
        },

        transactions: true,
      },
    });
    return NextResponse.json(
      {
        message: "success",
        data: party,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while fetching party :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
