import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  renderToStream,
} from "@react-pdf/renderer";
import { FaCheck } from "react-icons/fa";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OnlineBiltyDetails } from "@/lib/interface";

// Define the styles for the document
const styles = StyleSheet.create({
  page: {
    transform: "scale(0.9)",
    padding: 20,
    fontSize: 10,
    border: "5px solid black",
  },
  section: {
    marginBottom: 10,
    border: "1px solid black",
    padding: "10px",
    borderRadius: 5,
  },

  sectionRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  column: {
    flexDirection: "column",
  },
  header: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  contact: {
    fontSize: 10,
    textAlign: "right",
  },
  box: {
    padding: 5,
    border: "1px solid black",
    fontSize: 10,
    marginBottom: 4,
  },
  table: {
    display: "flex",
    width: "100%",
    marginTop: 10,
    borderTop: "1px solid black",
    borderLeft: "1px solid black",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    fontSize: 10,
    borderBottom: "1px solid black",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid black",
  },
  tableCell: {
    borderRight: "1px solid black",
    padding: 4,
    flex: 1,
    textAlign: "center",
  },
  largeCell: {
    flex: 3,
  },
  addressBox: {
    padding: 5,
    marginLeft: 10,
    width: "40%",
    fontSize: 10,
  },

  addressLine: {
    fontWeight: "bold",
    paddingBottom: 3,
    borderBottom: "1px solid black",
    marginBottom: 5,
  },
  insuranceBox: {
    border: "1px solid black",
    padding: 10,
    flex: 1,
    borderRadius: 5,
    height: "70px",
  },
  amountBox: {
    padding: 5,
    border: "1px solid black",
    fontSize: 10,
  },
  textRight: {
    textAlign: "right",
  },

  footer: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 10,
    marginBottom: 10,
    border: "1px solid black",
    padding: "10px",
    borderRadius: 5,
  },
});

// Define the Invoice component
const OnlineBilty = ({ bilty }: { bilty: OnlineBiltyDetails }) => {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.header}>{bilty.user.companyName}</Text>
          <Text style={styles.contact}>Phone No: {bilty.user.phone}</Text>
        </View>

        {/* Freight and Insurance Section */}
        <View style={styles.row}>
          <View
            style={{
              flex: 1,
              marginRight: 10,
              border: "1px solid black",
              padding: "10px",
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "extrabold",
                marginBottom: 10,
                textDecoration: "underline",
              }}
            >
              Freight Paid By
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                paddingBottom: 10,
                marginBottom: 10,
                borderBottom: "1px solid black",
              }}
            >
              <Text>{bilty.paidBy}</Text>
            </View>
            <Text>Vehicle: {bilty.trip.truck.registrationNumber}</Text>
          </View>
          <View style={styles.insuranceBox}>
            <Text
              style={{
                fontSize: 9,
                fontWeight: "extrabold",
                marginBottom: 10,
                textDecoration: "underline",
              }}
            >
              INSURANCE
            </Text>
            <Text>The Consignor has NOT insured the consignment</Text>
          </View>
          <View style={styles.addressBox}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "extrabold",
                marginBottom: 10,
                textDecoration: "underline",
              }}
            >
              Address of Delivery Door/Godown
            </Text>
            <Text>{bilty.consignee.addressLine1}</Text>
            <Text>{bilty.consignee.addressLine2}</Text>
            <Text>{bilty.consignee.addressLine2}</Text>
          </View>
        </View>

        {/* Consignor and Consignee Details */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View
            style={{
              width: "60%",
            }}
          >
            <View
              style={{
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                Consignor's Name & Address
              </Text>
              <Text style={styles.addressLine}>
                {bilty.consignor.name} (GST: {bilty.consignor.gstNumber})
              </Text>
              <Text style={styles.addressLine}>
                {bilty.consignor.addressLine1}
              </Text>
              <Text style={styles.addressLine}>
                {bilty.consignor.addressLine2}
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                Consignee's Name & Address
              </Text>
              <Text style={styles.addressLine}>
                {bilty.consignee.name} (GST: {bilty.consignee.gstNumber})
              </Text>
              <Text style={styles.addressLine}>
                {bilty.consignee.addressLine1}
              </Text>
              <Text style={styles.addressLine}>
                {bilty.consignee.addressLine2}
              </Text>
            </View>
          </View>
          {/* LR, Invoice, and Shipping Details */}
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "40%",
            }}
          >
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <Text>L.R No: </Text>
                <Text>{bilty.trip.lrNumber}</Text>
              </View>
              <View style={styles.sectionRow}>
                <Text>Date: </Text>
                <Text>
                  {new Date(bilty.trip.startedAt).toDateString().slice(4)}
                </Text>
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <Text>E-Way Bill No: </Text>
                <Text>None</Text>
              </View>
              <View style={styles.sectionRow}>
                <Text>Invoice No: </Text>
                <Text>None</Text>
              </View>
              <View style={styles.sectionRow}>
                <Text>Invoice Value: </Text>
                <Text>None</Text>
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <Text>From: </Text>
                <Text>{bilty.trip.from}</Text>
              </View>
              <View style={styles.sectionRow}>
                <Text>
                  <Text>To</Text>
                </Text>
                <Text>{bilty.trip.to}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Freight Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Sr No.</Text>
            <Text style={styles.tableCell}>No. of {"\n"} Packets</Text>
            <Text style={[styles.tableCell, styles.largeCell]}>
              Description
            </Text>
            <Text style={styles.tableCell}>Actual Weight</Text>
            <Text style={styles.tableCell}>Unit</Text>
            <Text style={styles.tableCell}>Rate</Text>
            <Text style={styles.tableCell}>Freight Amt</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>1</Text>
            <Text style={styles.tableCell}>{bilty.noOfPackages}</Text>
            <Text style={[styles.tableCell, styles.largeCell]}>
              {bilty.material}
            </Text>
            <Text style={styles.tableCell}>{bilty.weight}</Text>
            <Text style={styles.tableCell}>{bilty.unit}</Text>
            <Text style={styles.tableCell}>
              Rs.{bilty.trip.partyFreightAmount}
            </Text>
            <Text style={styles.tableCell}>
              Rs.{bilty.trip.partyFreightAmount}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            {/* First Cell: "Rate" */}
            <View style={{ flex: 2 }}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                Rate
              </Text>
            </View>

            {/* Second Cell: "Amount to be Pay/Paid" with Nested Table Row */}
            <View style={{ flex: 6 }}>
              {/* This is the header spanning across 3 columns */}
              <Text
                style={[
                  styles.tableCell,
                  {
                    textAlign: "center",
                    fontWeight: "bold",
                    borderRightWidth: 1,
                  },
                ]}
              >
                Amount to be Pay/Paid
              </Text>

              {/* Nested Row for Sub-headers */}
              <View
                style={[styles.tableRow, { marginTop: 10, borderTopWidth: 1 }]}
              >
                <Text style={[styles.tableCell, { flex: 2 }]}>
                  Taxable Amount
                </Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>GST(%)</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Amount</Text>
              </View>
            </View>
          </View>

          {/* Freight Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Freight</Text>
            <Text style={styles.tableCell}>Rs. 2,000.00</Text>
            <Text style={styles.tableCell}>5</Text>
            <Text style={styles.tableCell}>Rs. 2,100.00</Text>
          </View>

          {/* Amount Row (Colspan Simulation) */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Amount</Text>
            {/* Simulating Colspan by making this cell span across 3 columns */}
            <Text style={[styles.tableCell, { flex: 3, textAlign: "center" }]}>
              Rs. 2,100.00
            </Text>
          </View>

          {/* Advance Row (Colspan Simulation) */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Advance</Text>
            {/* Simulating Colspan by making this cell span across 3 columns */}
            <Text style={[styles.tableCell, { flex: 3, textAlign: "center" }]}>
              Rs. 0.00
            </Text>
          </View>

          {/* To Pay Row (Colspan Simulation) */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>To Pay</Text>
            {/* Simulating Colspan by making this cell span across 3 columns */}
            <Text style={[styles.tableCell, { flex: 3, textAlign: "center" }]}>
              Rs. 2,100.00
            </Text>
          </View>
        </View>

        {/* Amount in Words */}
        <View
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Text>Amount In Words</Text>
          <Text>Two Thousand One Hundred Only</Text>
        </View>

        {/* Disclaimer */}
        <Text style={styles.footer}>
          Company is not responsible for the leakages & thefts
        </Text>

        {/* Terms and Conditions */}
        <View
          style={[
            {
              display: "flex",
              flexDirection: "row",
              width: "100%",
              borderRadius: 10,
              border: "1px solid black",
            },
          ]}
        >
          <View
            style={{
              width: "60%",
              padding: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
              Terms & Conditions:
            </Text>
            <Text>1. This is a digitally generated Bilty/LR Copy</Text>
          </View>
          {/* Signature Section */}
          <View
            style={{
              width: "40%",
              display: "flex",
              justifyContent: "space-between",

              padding: 10,
              flexDirection: "column",
              borderLeft: "1px solid black",
            }}
          >
            <View>
              <Text>
                Certified that the particulars given above are true and correct
              </Text>
              <Text
                style={{
                  marginTop: 10,
                }}
              >
                For, {bilty.user.companyName}
              </Text>
            </View>
            <Text style={{ marginTop: 40, textAlign: "right" }}>Signature</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export async function GET(
  req: NextRequest,
  context: {
    params: {
      id: string;
    };
  }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  const onlineBilty = await prisma.onlineBilty.findUnique({
    where: {
      tripId: context.params.id,
    },
    include: {
      consignee: true,
      consignor: true,
      trip: {
        include: {
          truck: true,
        },
      },
      user: true,
    },
  });

  if (!onlineBilty) {
    return new NextResponse("OnlineBilty not found", { status: 404 });
  }

  const bilty: OnlineBiltyDetails = {
    id: onlineBilty.id,

    consignee: {
      id: onlineBilty.consignee.id,
      gstNumber: onlineBilty.consignee.gstNumber,
      name: onlineBilty.consignee.name,
      addressLine1: onlineBilty.consignee.addressLine1 || "",
      addressLine2: onlineBilty.consignee.addressLine2 || "",
      state: onlineBilty.consignee.state || "",
      zipCode: onlineBilty.consignee.zipCode || "",
      phone: onlineBilty.consignee.phone || "",
    },

    consignor: {
      id: onlineBilty.consignor.id,
      gstNumber: onlineBilty.consignor.gstNumber,
      name: onlineBilty.consignor.name,
      addressLine1: onlineBilty.consignor.addressLine1 || "",
      addressLine2: onlineBilty.consignor.addressLine2 || "",
      state: onlineBilty.consignor.state || "",
      zipCode: onlineBilty.consignor.zipCode || "",
      phone: onlineBilty.consignor.phone || "",
    },

    material: onlineBilty.material,
    weight: onlineBilty.weight,
    unit: onlineBilty.unit,
    noOfPackages: onlineBilty.noOfPackages,
    paidBy: onlineBilty.paidBy,
    gstPercentage: onlineBilty.gstPercentage,
    gstPaidBy: onlineBilty.gstPaidBy,

    user: {
      id: onlineBilty.user.id,
      userName: onlineBilty.user.userName,
      companyName: onlineBilty.user.companyName || "",
      password: onlineBilty.user.password,
      email: onlineBilty.user.email,
      phone: onlineBilty.user.phone,
    },

    trip: {
      from: onlineBilty.trip.from,

      to: onlineBilty.trip.to,
      truck: {
        registrationNumber: onlineBilty.trip.truck.registrationNumber,
      },
      partyFreightAmount: onlineBilty.trip.partyFreightAmount,
      partyBalance: onlineBilty.trip.partyBalance,
      lrNumber: onlineBilty.trip.lrNumber,
      material: onlineBilty.trip.material,
      completedAt: onlineBilty.trip.completedAt?.toDateString() || "",
      startedAt: onlineBilty.trip.startedAt?.toDateString() || "",
    },
  };

  const stream = await renderToStream(<OnlineBilty bilty={bilty} />);
  return new NextResponse(stream as unknown as ReadableStream);
}
