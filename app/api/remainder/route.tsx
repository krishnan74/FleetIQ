import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ReminderCreate } from "@/lib/createInterface";

export async function POST(req: NextRequest) {
  try {
    const body: ReminderCreate = await req.json();
    const { type, details, date, userId } = body;

    // Validate input data (this is optional but recommended)
    if (!type || !details || !date) {
      return NextResponse.json(
        { message: "Validation failed: Missing required fields." },
        { status: 400 }
      );
    }

    // Create the new reminder
    const reminder = await prisma.reminder.create({
      data: {
        type,
        details,
        date,
        user: {
          connect: {
            id: userId,
          },
        },
        status: "PENDING", // Default to 'PENDING' if not provided
      },
    });

    console.log("Reminder created successfully");

    return NextResponse.json(
      {
        message: "success",
        data: reminder,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while creating reminder :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    //console.log("Fetching reminders for user ID:", url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId parameter is required." },
        { status: 400 }
      );
    }

    //console.log("Fetching reminders for user ID:", userId);

    const reminders = await prisma.reminder.findMany({
      where: {
        userId: userId, // Ensure userId is a string
      },
    });

    return NextResponse.json(
      {
        message: "success",
        data: reminders,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while fetching reminders:", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
