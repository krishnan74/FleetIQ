import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gstNumber = searchParams.get("gstNumber");

  if (!gstNumber) {
    return NextResponse.json(
      { message: "Failed", error: "GST number is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `https://sheet.gstincheck.co.in/check/47c2be27364710723e6e259c3f30dfdc/${gstNumber}`
    );

    console.log("GST details fetched :: ", response.data);

    return NextResponse.json(
      {
        message: "success",
        data: response.data,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log("Error while fetching gst details :: ", e);
    return NextResponse.json(
      { message: "Failed", error: e.message },
      { status: 500 }
    );
  }
}
