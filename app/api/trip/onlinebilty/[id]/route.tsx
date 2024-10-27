import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DriverStatus, TripStatus, TruckStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET(
  req: NextRequest,
  context: {
    params: {
      id: string;
    };
  }
) {
  try {
    const onlineBilty = await prisma.onlineBilty.findUnique({
      where: {
        id: context.params.id,
      },
      include: {
        consignee: true,
        consignor: true,
        trip: true,
      },
    });

    return NextResponse.json(
      {
        message: "success",
        data: onlineBilty,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error while fetching onlineBilty:", err);
    return NextResponse.json(
      { message: "Failed", error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: {
    params: {
      id: string;
    };
  }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const body: {
      consigneeId: string;
      consignorId: string;
      material: string;
      weight: number;
      unit: string;
      noOfPackages: number;
      paidBy: string;
      gstPercentage: number;
      gstPaidBy: string;
    } = await req.json();
    const {
      consigneeId,
      consignorId,
      material,
      weight,
      unit,
      noOfPackages,
      paidBy,
      gstPercentage,
      gstPaidBy,
    } = body;
    console.log("Request body:", body);
    console.log("Context params:", context.params);

    const onlineBilty = await prisma.onlineBilty.create({
      data: {
        material,
        weight,
        unit,
        noOfPackages,
        paidBy,
        gstPercentage,
        gstPaidBy,
        consignee: {
          connect: {
            id: consigneeId,
          },
        },
        consignor: {
          connect: {
            id: consignorId,
          },
        },
        trip: {
          connect: {
            id: context.params.id,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    console.log("Created onlineBilty:", onlineBilty);

    return NextResponse.json(
      {
        message: "success",
        data: onlineBilty,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error while creating onlineBilty:", err);
    return NextResponse.json(
      { message: "Failed", error: err.message },
      { status: 500 }
    );
  }
}
