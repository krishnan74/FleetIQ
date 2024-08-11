import { TripStatus } from "@prisma/client";
import React from "react";

interface TripProgressProps {
  status: TripStatus;
}

const TripProgress: React.FC<TripProgressProps> = ({ status }) => {
  const steps = [
    { name: TripStatus.PLANNED, date: "6 Aug 2024" },
    { name: TripStatus.COMPLETED },
    { name: TripStatus.POD_RECEIVED },
    { name: TripStatus.POD_SUBMITTED },
    { name: TripStatus.SETTLED },
  ];

  const getStatusIndex = (status: TripStatus) => {
    return steps.findIndex((step) => step.name === status);
  };

  const currentStatusIndex = getStatusIndex(status);

  return (
    <div className="flex items-center space-x-4">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={`w-6 h-6 flex items-center justify-center rounded-full 
                        ${
                          index <= currentStatusIndex
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
          >
            {index <= currentStatusIndex && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            )}
          </div>
          <div
            className={`mt-2 text-xs ${
              index <= currentStatusIndex ? "text-black" : "text-gray-500"
            }`}
          >
            {step.name}
          </div>
          {step.date && (
            <div className="text-xs text-gray-500">{step.date}</div>
          )}
        </div>
      ))}
      <div className="flex-grow h-px bg-gray-300 mx-2"></div>
    </div>
  );
};

export default TripProgress;
