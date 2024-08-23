import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PartyDetails } from "@/lib/createInterface";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const parties = await prisma.party.findMany({
      where: {
        userId: userId,
      },
      include: {
        trips: true,
        transactions: true,
      },
    });

    return NextResponse.json(
      {
        message: "success",
        data: parties,
      },
      {
        status: 200,
      }
    );
  } catch (e: any) {
    console.log("Error while fetching parties", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const body: PartyDetails = await req.json();
    const {
      name,
      phone,
      openingBalance,
      openingBalanceDate,
      gstNumber,
      PANNumber,
      companyName,
    } = body;

    const totalBalance = openingBalance;

    const party = await prisma.party.create({
      data: {
        name,
        phone,
        openingBalance,
        openingBalanceDate,
        totalBalance,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "success",
        data: party,
      },
      {
        status: 200,
      }
    );
  } catch (e: any) {
    console.log("Error while creating party: ", e.message);
    return NextResponse.json(
      {
        message: "Failed",
        error: e.message,
      },
      { status: 500 }
    );
  }
}
