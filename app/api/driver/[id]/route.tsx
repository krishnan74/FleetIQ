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
  try {
    const driver = await prisma.driver.findUnique({
      where: {
        id: context.params.id,
      },
      include: {
        trips: true,
        truck: true,
      },
    });

    return NextResponse.json(
      {
        message: "success",
        data: driver,
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
