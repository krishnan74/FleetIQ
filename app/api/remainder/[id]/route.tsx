import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const reminderId = req.url.split("/").pop();
    const body = await req.json();

    const updatedReminder = await prisma.reminder.update({
      where: { id: reminderId },
      data: {
        type: body.type,
        details: body.details,
        date: body.date,
      },
    });

    return NextResponse.json({
      message: "success",
      data: updatedReminder,
    });
  } catch (e: any) {
    console.log("Error while updating reminder:", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const reminderId = req.url.split("/").pop();

    await prisma.reminder.delete({
      where: { id: reminderId },
    });

    return NextResponse.json({ message: "success" });
  } catch (e: any) {
    console.log("Error while deleting reminder:", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
