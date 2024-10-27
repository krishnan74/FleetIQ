import React from "react";

interface BillComponentPage4Props {
  setPageNo: React.Dispatch<React.SetStateAction<number>>;
}
const BillComponentPage4: React.FC<BillComponentPage4Props> = ({
  setPageNo,
}) => {
  return (
    <div className="p-5">
      {/* Free Online Bilty Banner */}
      <div className="bg-blue-500 text-white p-4 rounded-lg mb-6 flex items-center">
        <div>
          <h2 className="font-bold text-lg">Free Online Bilty</h2>
          <p>
            Create your free online bilty with us & document your trip easily
          </p>
        </div>
      </div>

      {/* Company Details Section */}
      <div className="flex flex-col space-y-8">
        {/* Company Details */}
        <div className="flex items-start gap-3">
          {/* Check Icon */}
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          {/* Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Company Details</h3>
            <p className="text-gray-500 text-sm">
              Your Company Address, contact & GST Number
            </p>
            <button
              onClick={() => setPageNo(1)}
              className="mt-2 px-3 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-100"
            >
              Edit Company Details
            </button>
          </div>
        </div>

        {/* Consignor Consignee Details */}
        <div className="flex items-start gap-3">
          {/* Check Icon */}
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          {/* Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              Consignor Consignee Details
            </h3>
            <p className="text-gray-500 text-sm">
              Name, Address & GST details of Consignor & Consignee
            </p>
            <button
              onClick={() => setPageNo(2)}
              className="mt-2 px-3 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-100"
            >
              Edit Consignor / Consignee Details
            </button>
          </div>
        </div>

        {/* Load & Trip Details */}
        <div className="flex items-start gap-3">
          {/* Check Icon */}
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          {/* Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Load & Trip Details</h3>
            <p className="text-gray-500 text-sm">
              Add your Load & Trip Details
            </p>
            <button
              onClick={() => setPageNo(3)}
              className="mt-2 px-3 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-100"
            >
              Edit Load
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillComponentPage4;
