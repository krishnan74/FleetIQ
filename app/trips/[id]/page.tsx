"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Trip } from "@/lib/interface";
import axios from "axios";

import { FaTruck } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { GiSteeringWheel } from "react-icons/gi";
import { FaChevronRight } from "react-icons/fa";
import AddTripDialogComponent from "../components/AddTripDialogComponent";
import AddAdvanceDialogComponent from "../components/AddAdvanceDialogComponent";
import CompleteTripDialogComponent from "../components/CompleteTripDialogComponent";
import Link from "next/link";
import { CiCircleChevRight } from "react-icons/ci";
import TripProgress from "../components/TripProgress";
import AddChargeDialogComponent from "../components/AddChargeDialogComponent";
import AddPaymentDialogComponent from "../components/AddPaymentDialogComponent";
import { TripTransaction } from "@/lib/interface";
import AddExpenseDialogComponent from "../components/AddExpenseDialogComponent";
import { Expense } from "@/lib/interface";
import { TripStatus } from "@prisma/client";
import TripBillDialogComponent from "../components/TripBillDialogComponent";
import PODReceivedDialogComponent from "../components/PODReceivedDialogComponent";
import PODSubmittedDialogComponent from "../components/PODSubmittedDialogComponent";
import SettleTripDialogComponent from "../components/SettleTripDialogComponent";

const Page = () => {
  const [tripDetails, setTripDetails] = useState<Trip>();
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const [refresh, setRefresh] = useState(false);
  const [advances, setAdvances] = useState<TripTransaction[]>();
  const [charges, setCharges] = useState<TripTransaction[]>();
  const [payments, setPayments] = useState<TripTransaction[]>();
  const [expenses, setExpenses] = useState<Expense[]>();

  const fetchTripDetails = async () => {
    try {
      const response = await axios.get(`/api/trip/${id}`);
      if (response.data.message === "success") {
        setTripDetails(response.data.data);

        const advanceFilter = response.data.data?.transactions.filter(
          (transaction: TripTransaction) =>
            transaction.tripTransactionType === "ADVANCE"
        );

        setAdvances(advanceFilter);

        const chargeFilter = response.data.data?.transactions.filter(
          (transaction: TripTransaction) =>
            transaction.tripTransactionType === "CHARGE"
        );

        setCharges(chargeFilter);

        const paymentFilter = response.data.data?.transactions.filter(
          (transaction: TripTransaction) =>
            transaction.tripTransactionType === "PAYMENT"
        );

        setPayments(paymentFilter);

        const expenseResponse: Expense[] = response.data.data?.expenses;
        setExpenses(expenseResponse);
      }
    } catch (error) {
      console.error("An error occurred while fetching data", error);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [refresh]);

  return (
    <div className="flex gap-x-5">
      <div className="flex flex-col w-[70%] gap-y-5">
        <div className="flex gap-10 w-full justify-between">
          <Link
            href={`/trucks/${tripDetails?.truck.id}`}
            className="truck-card flex-1 flex justify-between border p-5 rounded-md items-center"
          >
            <div className="flex">
              <FaTruck className="text-5xl " />
              <div className="flex flex-col ml-4">
                <p className="text-xl font-bold">Truck Number</p>
                <p className=" text-[#666]">
                  {tripDetails?.truck.registrationNumber}
                </p>
              </div>
            </div>
            <FaChevronRight className="text-2xl ml-4" />
          </Link>

          <Link
            href={`/drivers/${tripDetails?.driver.id}`}
            className="driver-card flex-1 flex justify-between border p-5 rounded-md items-center"
          >
            <div className="flex">
              <GiSteeringWheel className="text-5xl " />
              <div className="flex flex-col ml-4">
                <p className="text-xl font-bold">Driver Name</p>
                <p className=" text-[#666]">{tripDetails?.driver.name}</p>
              </div>
            </div>
            <FaChevronRight className="text-2xl ml-4" />
          </Link>
        </div>

        <div className="flex flex-col p-5 rounded-md border">
          <div className="flex justify-between border-b pb-5">
            <p className="text-2xl font-bold">{tripDetails?.party.name}</p>
          </div>

          <div className="grid grid-cols-4 gap-3 mt-5">
            <div className="flex justify-between col-span-2 p-5 border rounded-md">
              <div>
                <p className="text-sm font-light">Party Name</p>
                <p className="text-lg font-bold">{tripDetails?.party.name}</p>
              </div>

              <div>
                <p className="text-sm font-light">Party Balance</p>
                <p className="text-lg font-bold">
                  ₹ {tripDetails?.partyBalance}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center p-5 col-span-1 border rounded-md">
              <div>
                <p className="text-sm font-light">LR Number</p>
                <p className="text-lg font-bold">{tripDetails?.lrNumber}</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-5 col-span-1 border rounded-md">
              <div>
                <p className="text-sm font-light">Material</p>
                <p className="text-lg font-bold">{tripDetails?.material}</p>
              </div>
            </div>

            <div className="flex justify-between col-span-2 p-5 border rounded-md items-center">
              <div>
                <p className="text-lg font-bold">{tripDetails?.from}</p>
                <p className="text-sm font-light">
                  {new Date(
                    tripDetails?.createdAt ? tripDetails?.createdAt : ""
                  ).toDateString()}
                </p>
              </div>

              <div>
                <CiCircleChevRight size={30} />
              </div>

              <div>
                <p className="text-lg font-bold">{tripDetails?.to}</p>
              </div>
            </div>

            <div className="flex justify-between col-span-2 p-5 border rounded-md">
              <div>
                <p className="text-sm font-light">Start KMs Reading</p>
                <p className="text-lg font-bold">
                  {tripDetails?.startKMSReadings}{" "}
                  <span className="text-sm">kms</span>
                </p>
              </div>

              <div>
                <p className="text-sm font-light">End KMs Reading</p>
                <p className="text-lg font-bold">---</p>
              </div>
            </div>
          </div>
        </div>

        <TripProgress
          status={
            tripDetails?.status ? tripDetails?.status : TripStatus.PLANNED
          }
        />

        <div className="flex gap-5 w-full justify-between">
          <div className="flex-1">
            {(() => {
              switch (tripDetails?.status) {
                case TripStatus.PLANNED:
                  return (
                    <CompleteTripDialogComponent
                      refresh={refresh}
                      setRefresh={setRefresh}
                      tripId={tripDetails?.id}
                    />
                  );

                case TripStatus.COMPLETED:
                  return (
                    <PODReceivedDialogComponent
                      refresh={refresh}
                      setRefresh={setRefresh}
                      tripId={tripDetails?.id}
                    />
                  );

                case TripStatus.POD_RECEIVED:
                  return (
                    <PODSubmittedDialogComponent
                      refresh={refresh}
                      setRefresh={setRefresh}
                      tripId={tripDetails?.id}
                    />
                  );

                case TripStatus.POD_SUBMITTED:
                  return (
                    <SettleTripDialogComponent
                      refresh={refresh}
                      setRefresh={setRefresh}
                      tripId={tripDetails?.id}
                    />
                  );

                case TripStatus.SETTLED:
                  return (
                    <Button
                      disabled={true}
                      variant={"secondary"}
                      className="w-full border"
                    >
                      Amount Settled
                    </Button>
                  );
              }
            })()}
          </div>

          <div className="flex-1">
            <TripBillDialogComponent />
          </div>
        </div>

        <div>
          <div className="flex justify-between py-3 items-center border-b mb-3">
            <p>Freight Amount</p>₹ {tripDetails?.partyFreightAmount}
          </div>

          <div className="flex flex-col py-3 items-center">
            <div className="flex justify-between w-full mb-5">
              <div className="flex gap-1">
                <p>( - ) Advance</p>
                <AddAdvanceDialogComponent
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              </div>
              <p className="text-red-500">
                {" "}
                - ₹{" "}
                {advances?.reduce((acc, advance) => acc + advance.amount, 0)}
              </p>
            </div>

            <div className="flex flex-col gap-y-5 w-full">
              {advances?.map((advance) => (
                <div
                  key={advance.id}
                  className="flex justify-between w-full bg-gray-100 rounded-md p-5"
                >
                  <div className="flex gap-3 justify-center items-center">
                    <p className="font-bold text-sm">
                      {new Date(advance.transactionDate)
                        .toDateString()
                        .substring(3)}
                    </p>
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <p className="capitalize">{advance.transactionMode}</p>
                  </div>
                  ₹ {advance.amount}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col py-3 items-center">
            <div className="flex justify-between w-full mb-5">
              <div className="flex gap-1">
                <p>( + ) Charges</p>
                <AddChargeDialogComponent
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              </div>
              <p className="text-green-500">
                + ₹ {charges?.reduce((acc, charge) => acc + charge.amount, 0)}
              </p>
            </div>

            <div className="flex flex-col gap-y-5 w-full">
              {charges?.map((charge) => (
                <div
                  key={charge.id}
                  className="flex justify-between w-full bg-gray-100 rounded-md p-5"
                >
                  <div className="flex gap-3 justify-center items-center">
                    <p className="font-bold text-sm">
                      {new Date(charge.transactionDate)
                        .toDateString()
                        .substring(3)}
                    </p>
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <p className="capitalize">{charge.transactionMode}</p>
                  </div>
                  ₹ {charge.amount}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col py-3 items-center">
            <div className="flex justify-between w-full mb-5">
              <div className="flex gap-1">
                <p>( - ) Payments</p>
                <AddPaymentDialogComponent
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              </div>
              <p className="text-red-500">
                {" "}
                - ₹{" "}
                {payments?.reduce((acc, payment) => acc + payment.amount, 0)}
              </p>
            </div>

            <div className="flex flex-col gap-y-5 w-full">
              {payments?.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between w-full bg-gray-100 rounded-md p-5"
                >
                  <div className="flex gap-3 justify-center items-center">
                    <p className="font-bold text-sm">
                      {new Date(payment.transactionDate)
                        .toDateString()
                        .substring(3)}
                    </p>
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <p className="capitalize">{payment.transactionMode}</p>
                  </div>
                  ₹ {payment.amount}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-5 border-t">
          <div className="flex justify-between py-3 items-center">
            <p>Pending Party Balance</p>₹ {tripDetails?.partyBalance}
          </div>
        </div>
      </div>
      <div className="w-[30%] flex flex-col gap-5">
        <div className="w-full p-5 gap-y-2 border rounded-md">
          <div className="flex justify-between pb-5 border-b items-center">
            <p>Trip Profit</p>
            <AddExpenseDialogComponent
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </div>

          <div>
            <div className="flex justify-between py-3 items-center">
              <p>(+) Revenue</p>₹ {tripDetails?.partyFreightAmount}
            </div>
            <div>
              <div className="flex justify-between py-3 border-b items-center mb-2">
                <p>(-) Expense</p>₹ {tripDetails?.totalExpenseAmount}
              </div>
              <div className="flex flex-col gap-y-2 border rounded-md p-5 mb-2 bg-gray-100">
                {expenses?.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex justify-between w-full border-b pb-2"
                  >
                    <div className="flex gap-3 justify-center items-center">
                      <p className="capitalize">{expense.expenseType}</p>
                    </div>
                    ₹ {expense.amount}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between py-3 border-t items-center">
            <p>Profit</p>₹ {tripDetails?.profit}
          </div>
        </div>

        <div className="w-full p-5 gap-y-2 border rounded-md">
          <div className="flex justify-between pb-5 border-b items-center">
            <p>{tripDetails?.party.name}</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex justify-between p-3 items-center border rounded-md">
              <p>Online Bilty/LR</p>
              <Button>Create LR</Button>
            </div>
            <div className="flex justify-between p-3 border-b items-center border rounded-md">
              <p>POD Challan</p>
              <Button>Add POD</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
