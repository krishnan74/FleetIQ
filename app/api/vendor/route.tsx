import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        address: true,
        trips: true,
        trucks: true,
      },
    });
    return NextResponse.json(
      {
        message: "success",
        data: vendors,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while fetching vendors :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  //console.log("DATABASE_URL: ", process.env.DATABASE_URL);

  try {
    const body = await req.json();
    console.log("Body :: ", body);

    // Create the vendor with the nested address
    const vendor = await prisma.vendor.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: {
          create: body.address,
        },
      },
      include: {
        address: true,
      },
    });

    return NextResponse.json(
      { message: "success", data: vendor },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while creating vendor :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
