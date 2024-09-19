"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trip } from "@/lib/interface";
import { DatePicker } from "@/components/DatePicker";
import { PartyInvoiceDetails } from "@/lib/createInterface";
import axios from "axios";

interface InvoiceTrip {
  name: string;
  totalBalance: number;
  trips: Trip[];
  partyId: string;
}

const InvoiceTripDialogComponent: React.FC<InvoiceTrip> = ({
  name,
  totalBalance,
  trips,
  partyId,
}) => {
  const [open, setOpen] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([]);
  const [formData, setFormData] = useState<PartyInvoiceDetails>({
    invoiceDate: "",
    dueDate: "",
    amount: 0,
    balance: 0,
    tripIds: [],
    invoiceNumber: "",
    partyId: partyId,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateInvoice = async () => {
    if (!invoiceDate || !dueDate || selectedTripIds.length === 0) {
      setError("Please fill all required fields and select at least one trip.");
      return;
    }

    try {
      setLoading(true);
      setError(null); // Reset any previous error
      const invoiceData = {
        ...formData,
        invoiceDate: invoiceDate.toISOString(),
        dueDate: dueDate.toISOString(),
        tripIds: selectedTripIds,
      };

      // Post the invoice data
      const response = await axios.post("/api/invoice/party/", invoiceData);

      if (response.status === 200) {
        setOpen(false);
        setSelectedTripIds([]);
        setInvoiceDate(undefined);
        setDueDate(undefined);
      }
    } catch (err) {
      setError("Failed to create invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <TableRow className="cursor-pointer hover:bg-gray-100 transition-colors w-full">
            <TableCell className="py-3 px-4 font-medium">{name}</TableCell>
            <TableCell className="py-3 px-4 text-right font-medium">
              {totalBalance.toFixed(2)}
            </TableCell>
          </TableRow>
        </DialogTrigger>
        <DialogContent className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4 text-center">
              Invoice Details
            </DialogTitle>
            <DialogDescription className="space-y-3" id="report-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-lg text-gray-700">
                    Party Name
                  </p>
                  <p className="text-lg text-gray-600">{name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg text-gray-700">Balance</p>
                  <p className="text-lg text-gray-600">
                    ₹ {totalBalance.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="font-semibold text-lg text-gray-700">
                    Invoice Number
                  </p>
                  <p className="text-lg text-gray-600">0</p>
                </div>
                <div>
                  <label
                    htmlFor="invoice-date"
                    className="block font-semibold text-lg text-gray-700"
                  >
                    Invoice Date *
                  </label>
                  <DatePicker date={invoiceDate} setDate={setInvoiceDate} />
                </div>
                <div>
                  <label
                    htmlFor="due-date"
                    className="block font-semibold text-lg text-gray-700"
                  >
                    Due Date *
                  </label>
                  <DatePicker date={dueDate} setDate={setDueDate} />
                </div>
              </div>

              <div>
                <p>Select Trip</p>
              </div>

              <Table className="min-w-full bg-white shadow-sm rounded-lg">
                <TableHeader>
                  <TableRow className="bg-blue-500 border-b border-blue-300 hover:bg-blue-500">
                    <TableHead className="py-4 px-6 text-left text-white">
                      Date
                    </TableHead>
                    <TableHead className="py-4 px-6 text-right text-white">
                      Route
                    </TableHead>
                    <TableHead className="py-4 px-6 text-right text-white">
                      Truck
                    </TableHead>
                    <TableHead className="py-4 px-6 text-right text-white">
                      Invoice Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trips?.map((trip) => (
                    <TableRow
                      key={trip.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="py-4 px-6 flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 cursor-pointer"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTripIds([...selectedTripIds, trip.id]);
                            } else {
                              setSelectedTripIds(
                                selectedTripIds.filter((id) => id !== trip.id)
                              );
                            }
                          }}
                        />
                        {new Date(trip.createdAt).toDateString()}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        {trip.from} - {trip.to}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        {trip.truck?.registrationNumber}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        ₹ {trip.partyBalance.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Display error if any */}
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-4 mt-6">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </Button>
            </DialogClose>

            <Button
              type="button"
              variant="default"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleCreateInvoice}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceTripDialogComponent;
