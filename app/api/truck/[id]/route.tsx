import { NextResponse, NextRequest } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const truck = await prisma.truck.findUnique({
      where: {
        id: context.params.id as string,
      },
      include: {
        trips: true,
        vendor: true,
        driver: true,
      },
    });

    return NextResponse.json(
      {
        message: "success",
        data: truck,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while fetching trucks :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
