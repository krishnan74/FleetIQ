"use client";
import React, { useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spreadsheet from "react-spreadsheet";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trip } from "@/lib/interface";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Get current year and month
const presentYear = new Date().getFullYear();
const presentMonth = new Date().getMonth().toString();

const months = [
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];

const years = Array.from({ length: 10 }, (_, i) => presentYear - i).map(
  (year) => ({
    value: year.toString(),
    label: year.toString(),
  })
);

const PartyRevenueReportDialogComponent = () => {
  const [open, setOpen] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>(presentMonth);
  const [currentYear, setCurrentYear] = useState<string>(
    presentYear.toString()
  );
  const [partyData, setPartyData] = useState<{ [key: string]: any }>({});

  const fileName = "Party Revenue Report";

  const fetchData = async () => {
    console.log(
      "Fetching data for month:",
      currentMonth,
      "and year:",
      currentYear
    );

    try {
      const response = await axios.get(`/api/tripTransactions/`);
      console.log("API response:", response.data);

      if (response.data.message === "success") {
        const currentMonthTrips = response.data.data.filter(
          (trip: Trip) =>
            new Date(trip.startedAt).getMonth().toString() === currentMonth &&
            new Date(trip.startedAt).getFullYear().toString() === currentYear
        );

        console.log(
          "Filtered trips for the selected month and year:",
          currentMonthTrips
        );

        // Separate trips by Party ownership type
        const partyDetails: {
          [key: string]: { trips: number; revenue: number };
        } = {};

        currentMonthTrips.forEach((trip: Trip) => {
          const partyName = trip.party.name;

          if (!partyDetails[partyName]) {
            partyDetails[partyName] = { trips: 0, revenue: 0 };
          }

          partyDetails[partyName].revenue += trip.partyFreightAmount || 0;
          partyDetails[partyName].trips += 1; // Increment trip count
        });

        console.log("Party details with cumulative data:", partyDetails);

        setPartyData(partyDetails);

        setTrips(currentMonthTrips);
      }
    } catch (error) {
      console.error("An error occurred while fetching data", error);
    }
  };

  useEffect(() => {
    if (currentMonth && currentYear) {
      fetchData();
    }
  }, [currentMonth, currentYear]);

  const createDataArray = (
    partyData: { [key: string]: any },
    title: string
  ) => {
    const rows = [
      [
        { value: "Party Name" },
        { value: "Number of Trips" },
        { value: "Revenue" },
      ],
      ...Object.keys(partyData).map((partyName) => [
        { value: partyName },
        { value: partyData[partyName].trips.toString() },
        { value: `₹ ${partyData[partyName].revenue.toString()}` },
      ]),
      [
        {
          value: "Total",
        },
        {
          value: Object.values(partyData)
            .reduce((acc, curr) => acc + curr.trips, 0)
            .toString(),
        },
        {
          value: `₹ ${Object.values(partyData).reduce(
            (acc, curr) => acc + curr.revenue,
            0
          )}`,
        },
      ],
    ];
    return rows;
  };

  const data = [
    [
      { value: "Party Revenue Report" },
      { value: months[parseInt(currentMonth)].label },
      { value: currentYear },
      { value: "" },
    ],
    [],
    ...createDataArray(partyData, "Parties"),
    [],
  ];

  const exportToExcel = () => {
    console.log("Exporting data to Excel:", data);

    const aoaData = data.map((row) => row.map((cell) => cell.value));
    const worksheet = XLSX.utils.aoa_to_sheet(aoaData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const chartData = {
    labels: Object.keys(partyData),
    datasets: [
      {
        label: "Revenue",
        data: Object.values(partyData).map((party) => party.revenue),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <div
            onClick={() => setOpen(true)}
            className="flex gap-5 p-5 border rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <img src={"/party-revenue.png"} height={50} width={50} alt="" />
            <p className="font-semibold text-lg">Party Revenue Report</p>
          </div>
        </DialogTrigger>
        <DialogContent className="w-full max-w-3xl bg-gray-50 p-8 rounded-lg shadow-xl ">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold pb-5 border-b mb-5 text-center text-gray-700">
              Party Revenue Report
            </DialogTitle>
            <DialogDescription className="w-full h-[80vh] overflow-y-auto space-y-6">
              <div className="flex gap-5">
                <Select
                  value={currentMonth}
                  onValueChange={(value) => {
                    console.log("Selected month:", value);
                    setCurrentMonth(value);
                  }}
                >
                  <SelectTrigger className="w-full mt-2 bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm hover:shadow-md transition-shadow">
                    <SelectValue placeholder="Select a month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={currentYear}
                  onValueChange={(value) => {
                    console.log("Selected year:", value);
                    setCurrentYear(value);
                  }}
                >
                  <SelectTrigger className="w-full mt-2 bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm hover:shadow-md transition-shadow">
                    <SelectValue placeholder="Select a year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {years.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-center gap-5 mt-5">
                <div className="w-fit overflow-x-auto">
                  <Spreadsheet data={data} />
                </div>

                <div className="">
                  <Bar data={chartData} options={{ responsive: true }} />
                </div>
              </div>

              <DialogFooter className="flex justify-end border-t pt-10 space-x-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      console.log("Dialog closed");
                      setOpen(false);
                    }}
                  >
                    Close
                  </Button>
                </DialogClose>
                <Button onClick={exportToExcel}>Download</Button>
              </DialogFooter>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartyRevenueReportDialogComponent;