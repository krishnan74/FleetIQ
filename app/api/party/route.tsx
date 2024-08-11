import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { error } from "console";

interface PartyDetails {
  name: string;
  phone: string;
  openingBalance: number;
  gstNumber: string;
  openingBalanceDate: string;
  PANNumber: string;
  companyName: string;
}

export async function GET(req: NextRequest) {
  try {
    const parties = await prisma.party.findMany({
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
