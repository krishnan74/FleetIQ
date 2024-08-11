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
        transactions: true,
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

export async function PUT(
  req: NextRequest,
  context: {
    params: {
      id: string;
    };
  }
) {
  const body = await req.json();
  const { newBalance } = body;

  try {
    const driver = await prisma.driver.update({
      where: {
        id: context.params.id,
      },
      data: {
        balance: newBalance,
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
    console.log("Error while updating driver :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
