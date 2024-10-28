import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  renderToStream,
} from "@react-pdf/renderer";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PartyInvoiceDetails } from "@/lib/interface";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { toWords } from "number-to-words";

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  section: {
    border: "1px solid black",
    padding: "10px",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  column: {
    flexDirection: "column",
    border: "1px solid black",
    padding: "3px",
    flex: 1,
  },

  columnLayout: {
    flexDirection: "column",
    border: "1px solid black",
    padding: "3px",
  },
  header: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
  },
  boldText: {
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: 4,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginVertical: 10,
  },
  descriptionRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 6,
  },
  descriptionColumn: {
    width: "20%", // Adjust according to content
    textAlign: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
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
    flex: 2,
    textAlign: "center",
  },
  largeCell: {
    flex: 6,
  },

  smallCell: {
    borderRight: "1px solid black",
    paddingHorizontal: 2,
    paddingVertical: 4,
    textAlign: "center",
    flex: 1,
  },
});

function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word
        .replace(/-/g, " ") // Replace hyphens with spaces
        .split(" ") // Split the word if needed (e.g. "forty-eight" becomes ["forty", "eight"])
        .map(function (part) {
          return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join(" ");
    })
    .join(" ");
}
// Updated PDF Component Structure
const Invoice = ({ invoice }: { invoice: PartyInvoiceDetails }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {" "}
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            INVOICE
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            (ORIGINAL FOR RECIPIENT)
          </Text>
        </View>

        {/* Header Section */}
        <View style={styles.row}>
          <View style={[{ border: "1px solid black", flex: 1 }]}>
            <View style={styles.columnLayout}>
              <Text style={styles.header}>{invoice.user.companyName}</Text>
              <Text style={styles.text}>
                {invoice.user.doorNumber}, {invoice.user.street},
                {invoice.user.city}
              </Text>
              <Text style={styles.text}>
                GSTIN/UIN: {invoice.user.gstNumber}
              </Text>
              <Text style={styles.text}>State: {invoice.user.state}</Text>
              <Text style={styles.text}>Email: {invoice.user.email}</Text>
            </View>
            <View>
              <View style={styles.columnLayout}>
                <Text style={styles.boldText}>Consignee (Ship to)</Text>
                <Text style={styles.text}>{invoice.consignee.name}</Text>
                <Text style={styles.text}>
                  {invoice.consignee.addressLine1}
                </Text>
                <Text style={styles.text}>
                  GSTIN/UIN: {invoice.consignee.gstNumber}
                </Text>
                <Text style={styles.text}>
                  State: {invoice.consignee.state}
                </Text>
              </View>
              <View style={styles.columnLayout}>
                <Text style={styles.boldText}>Buyer (Bill to)</Text>
                <Text style={styles.text}>{invoice.consignor.name}</Text>
                <Text style={styles.text}>
                  {invoice.consignor.addressLine1}
                </Text>
                <Text style={styles.text}>
                  GSTIN/UIN: {invoice.consignor.gstNumber}
                </Text>
                <Text style={styles.text}>
                  State: {invoice.consignor.state}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <View>
              <View style={styles.column}>
                <Text style={styles.boldText}>Invoice No.</Text>
                <Text style={styles.text}>{invoice.invoiceNumber}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.boldText}>Delivery Note</Text>
                <Text style={styles.text}>{invoice.trip.notes}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.boldText}>Reference No. & Date</Text>
                <Text style={styles.text}>--</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.boldText}>Dispatch Doc. No.</Text>
                <Text style={styles.text}>--</Text>
              </View>{" "}
              <View style={styles.column}>
                <Text style={styles.boldText}>Dispatch Through</Text>
                <Text style={styles.text}>{invoice.trip.from}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.boldText}>Bill of Lading / LR-RR No.</Text>
                <Text style={styles.text}>{invoice.trip.lrNumber}</Text>
              </View>
            </View>

            <View>
              <View style={styles.column}>
                <Text style={styles.boldText}>Dated</Text>
                <Text style={styles.text}>
                  {new Date(invoice.invoiceDate).toDateString().slice(4)}
                </Text>
              </View>
              <View
                style={[
                  styles.column,
                  {
                    flex: 1,
                  },
                ]}
              >
                <Text style={styles.boldText}></Text>
                <Text style={styles.text}></Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.boldText}>Other References</Text>
                <Text style={styles.text}>--</Text>
              </View>

              <View style={styles.column}>
                <Text style={styles.boldText}>Delivery Note Date</Text>
                <Text style={styles.text}>--</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.boldText}>Destination</Text>
                <Text style={styles.text}>{invoice.trip.from}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.boldText}>Motor Vehicle No.</Text>
                <Text style={styles.text}>
                  {invoice.truck.registrationNumber}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Invoice Information */}

        {/* Consignee and Buyer Section */}

        {/* Description of Goods */}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.smallCell}>Sl No.</Text>
            <Text style={[styles.tableCell, styles.largeCell]}>
              Description of Goods
            </Text>
            <Text style={styles.tableCell}>Quantity</Text>
            <Text style={styles.tableCell}>Rate</Text>

            <Text style={styles.smallCell}>Per</Text>
            <Text style={styles.tableCell}>Amount</Text>
          </View>

          <View
            style={[
              styles.tableRow,
              {
                height: "25vh",
              },
            ]}
          >
            <Text style={styles.smallCell}>1</Text>
            <View
              style={[
                styles.largeCell,
                {
                  display: `flex`,
                  flexDirection: `column`,
                  borderRight: "1px solid black",
                  padding: 4,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  marginBottom: 4,
                }}
              >
                Transport Charges for Import
              </Text>
              <View
                style={{
                  paddingLeft: 10,
                }}
              >
                <Text>
                  Loading Date:{" "}
                  {new Date(invoice.trip.startedAt).toDateString().slice(4)}
                </Text>
                <Text>{invoice.truck.registrationNumber}</Text>
                <Text>
                  WEIGHT: {invoice.onbilty.weight} {invoice.onbilty.unit}
                </Text>
                <Text>TRUCK TYPE: {invoice.truck.truckType}</Text>
                <Text>
                  {invoice.trip.from.toUpperCase() +
                    " TO " +
                    invoice.trip.to.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.tableCell}>1 NOS</Text>
            <Text style={styles.tableCell}>{invoice.trip.partyBalance}</Text>
            <Text style={styles.smallCell}>NOS</Text>
            <Text style={styles.tableCell}>{invoice.trip.partyBalance}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.smallCell}></Text>

            <View
              style={[
                styles.largeCell,
                {
                  display: `flex`,
                  flexDirection: `column`,
                  borderRight: "1px solid black",
                  padding: 4,
                  textAlign: "right",
                },
              ]}
            >
              <Text>Total:</Text>
            </View>
            <Text style={styles.tableCell}>1 NOS</Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.smallCell}></Text>
            <Text style={styles.tableCell}>{invoice.trip.partyBalance}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View>
            <Text>Amount Chargable ( in words )</Text>
            <Text
              style={{
                fontSize: 12,
              }}
            >
              INR {titleCase(toWords(48000))} Only
            </Text>
          </View>

          <Text>E & O.E. For {invoice.user.companyName} </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            marginVertical: 10,
          }}
        >
          <View>
            <View>
              <Text style={styles.boldText}>Company&apos;s Bank Details</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <View>
                  <Text>Bank Name:</Text>
                  <Text>A/C Holder&apos;s Name: </Text>
                  <Text>A/C No: </Text>
                  <Text>Branch & IFS Code: </Text>
                </View>
                <View>
                  <Text>{invoice.user.bankName}</Text>
                  <Text>{invoice.user.accountHolderName}</Text>
                  <Text>{invoice.user.accountNumber}</Text>
                  <Text>
                    {invoice.user.bankBranch} & {invoice.user.ifscCode}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Declaration */}
        <View
          style={[
            styles.row,
            {
              height: "15vh",
              gap: 10,
            },
          ]}
        >
          <View
            style={[
              {
                width: "50%",
              },
            ]}
          >
            <Text style={styles.boldText}>Declaration</Text>
            <Text style={styles.text}>
              We declare that this invoice shows the actual price of the goods
              described and that all particulars are true and correct.
            </Text>
          </View>
          {/* Signature */}
          <View
            style={[
              {
                width: "50%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                border: "1px solid black",
              },
            ]}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                paddingBottom: 10,
              }}
            >
              <Text>for {invoice.user.companyName}</Text>
              <Text style={styles.text}>Authorized Signatory</Text>
            </View>
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

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const partyInvoice = await prisma.partyInvoice.findUnique({
    where: {
      id: context.params.id,
    },
    include: {
      trip: {
        include: {
          truck: true,
          onlineBilty: {
            include: {
              consignee: true,
              consignor: true,
            },
          },
        },
      },
      party: true,
    },
  });

  console.log(partyInvoice);

  if (!partyInvoice) {
    return new NextResponse("Invoice not found", { status: 404 });
  }

  const invoice: PartyInvoiceDetails = {
    id: partyInvoice.id,
    invoiceDate: partyInvoice.invoiceDate.toISOString(),
    dueDate: partyInvoice.dueDate.toISOString(),
    amount: partyInvoice.amount,
    balance: partyInvoice.balance,
    tripId: partyInvoice.tripId,
    invoiceNumber: partyInvoice.invoiceNumber.toString(),

    onbilty: {
      id: partyInvoice?.trip?.onlineBilty?.id || "",
      material: partyInvoice.trip.onlineBilty?.material || "",
      weight: partyInvoice.trip.onlineBilty?.weight || 0,
      unit: partyInvoice.trip.onlineBilty?.unit || "",
      noOfPackages: partyInvoice.trip.onlineBilty?.noOfPackages || 0,
      paidBy: partyInvoice.trip.onlineBilty?.paidBy || "",
      gstPercentage: partyInvoice.trip.onlineBilty?.gstPercentage || 0,
      gstPaidBy: partyInvoice.trip.onlineBilty?.gstPaidBy || "",
    },
    consignee: {
      id: partyInvoice?.trip?.onlineBilty?.consignee.id || "",
      name: partyInvoice.trip.onlineBilty?.consignee.name || "",
      phone: partyInvoice.trip.onlineBilty?.consignee.phone || "",
      gstNumber: partyInvoice.trip.onlineBilty?.consignee.gstNumber || "",
      addressLine1: partyInvoice.trip.onlineBilty?.consignee.addressLine1 || "",
      addressLine2: partyInvoice.trip.onlineBilty?.consignee.addressLine2 || "",
      state: partyInvoice.trip.onlineBilty?.consignee.state || "",
      zipCode: partyInvoice.trip.onlineBilty?.consignee.zipCode || "",
    },

    consignor: {
      id: partyInvoice?.trip?.onlineBilty?.consignor.id || "",
      name: partyInvoice.trip.onlineBilty?.consignor.name || "",
      phone: partyInvoice.trip.onlineBilty?.consignor.phone || "",
      gstNumber: partyInvoice.trip.onlineBilty?.consignor.gstNumber || "",
      addressLine1: partyInvoice.trip.onlineBilty?.consignor.addressLine1 || "",
      addressLine2: partyInvoice.trip.onlineBilty?.consignor.addressLine2 || "",
      state: partyInvoice.trip.onlineBilty?.consignor.state || "",
      zipCode: partyInvoice.trip.onlineBilty?.consignor.zipCode || "",
    },

    truck: {
      id: partyInvoice.trip.truck.id,
      registrationNumber: partyInvoice.trip.truck.registrationNumber,
      truckType: partyInvoice.trip.truck.truckType,
      truckOwnerShip: partyInvoice.trip.truck.truckOwnerShip,
    },

    trip: {
      id: partyInvoice.trip.id,
      status: partyInvoice.trip.status,

      createdAt: partyInvoice.trip.createdAt.toISOString(),
      completedAt: partyInvoice.trip.completedAt?.toISOString() || "",
      startedAt: partyInvoice.trip.startedAt?.toISOString() || "",
      from: partyInvoice.trip.from,
      to: partyInvoice.trip.to,
      profit: partyInvoice.trip.profit,
      updatedAt: partyInvoice.trip.updatedAt.toISOString(),

      partyFreightAmount: partyInvoice.trip.partyFreightAmount,
      partyBalance: partyInvoice.trip.partyBalance,
      startKMSReadings: partyInvoice.trip.startKMSReadings || 0,
      lrNumber: partyInvoice.trip.lrNumber,
      material: partyInvoice.trip.material,
      notes: partyInvoice.trip.notes,
    },

    party: {
      id: partyInvoice.party.id,
      name: partyInvoice.party.name,
      phone: partyInvoice.party.phone,
      openingBalance: partyInvoice.party.openingBalance,
      openingBalanceDate:
        partyInvoice.party.openingBalanceDate?.toISOString() ||
        new Date().toISOString(),
      gstNumber: partyInvoice.party.gstNumber || "",
      totalBalance: partyInvoice.party.totalBalance,
      PANNumber: partyInvoice.party.PANNumber || "",
      companyName: partyInvoice.party.companyName || "",
      trips: [],
      transactions: [],
    },
    user: {
      id: user?.id || "",
      userName: user?.userName || "",
      email: user?.email || "",
      password: user?.password || "",
      phone: user?.phone || "",
      gstNumber: user?.gstNumber || "",
      companyName: user?.companyName || "",
      doorNumber: user?.doorNumber || "",
      street: user?.street || "",
      city: user?.city || "",
      state: user?.state || "",
      zipCode: user?.zipCode || "",

      bankName: user?.bankName || "",
      accountHolderName: user?.accountHolderName || "",
      accountNumber: user?.accountNumber || "",
      bankBranch: user?.bankBranch || "",
      ifscCode: user?.ifscCode || "",
    },
  };

  const stream = await renderToStream(<Invoice invoice={invoice} />);
  return new NextResponse(stream as unknown as ReadableStream);
}
