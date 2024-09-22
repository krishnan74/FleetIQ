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

const styles = StyleSheet.create({
  page: {
    display: "flex",
    justifyContent: "space-between",
    padding: 50,
  },
  section: {
    marginBottom: 40,
  },
  header: {
    fontSize: 18,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    marginBottom: 8,
  },
  status: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: 50,
    color: "white",
    fontSize: 12,
    paddingHorizontal: 4,
    paddingVertical: 4,
    backgroundColor: "blue",
    borderRadius: 99,
  },
  value: {
    fontSize: 26,
    marginBottom: 10,
  },
});

const Invoice = ({ invoice }: { invoice: PartyInvoiceDetails }) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View>
          <View style={styles.section}>
            <Text style={styles.title}>Invoice {invoice.invoiceNumber}</Text>
            <Text style={styles.date}>
              {new Date(invoice.invoiceDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.value}>
              ${(invoice.amount / 100).toFixed(2)}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.header}>Billed To</Text>
            <Text style={styles.text}>Name: {invoice.party.name}</Text>
            <Text style={styles.text}>Phone: {invoice.party.phone}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.header}>Payment Details</Text>
            <Text style={styles.text}>Bank of the Universe</Text>
            <Text style={styles.text}>1234567890</Text>
            <Text style={styles.text}>0987654321</Text>
          </View>
        </View>
        <View>
          <Text style={styles.text}>Colby Fayock</Text>
          <Text style={styles.text}>hello@colbyfayock.com</Text>
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
  const partyInvoice = await prisma.partyInvoice.findUnique({
    where: {
      id: context.params.id,
    },
    include: {
      party: {
        include: {
          trips: true,
          transactions: true,
        },
      },
    },
  });

  if (!partyInvoice) {
    return new NextResponse("Invoice not found", { status: 404 });
  }

  const invoice: PartyInvoiceDetails = {
    id: partyInvoice.id,
    invoiceDate: partyInvoice.invoiceDate.toISOString(),
    dueDate: partyInvoice.dueDate.toISOString(), // Assuming dueDate exists
    amount: partyInvoice.amount,
    balance: partyInvoice.balance,
    tripId: partyInvoice.tripId,
    invoiceNumber: partyInvoice.invoiceNumber.toString(), // Assuming invoiceNumber exists
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
  };

  const stream = await renderToStream(<Invoice invoice={invoice} />);
  return new NextResponse(stream as unknown as ReadableStream);
}
