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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { usePathname } from "next/navigation";
import axios from "axios";

import BillComponentPage1 from "./BillComponentPage1";
import { DataFormProps } from "@/lib/interface";
import BillComponentPage2 from "./BillComponentPage2";
import BillComponentPage3 from "./BillComponentPage3";
import BillComponentPage4 from "./BillComponentPage4";
import { OnlineBiltyDetails } from "@/lib/createInterface";

const OnlineBiltyDialogComponent: React.FC<DataFormProps> = ({
  refresh,
  setRefresh,
}) => {
  const pathname = usePathname();
  const id = pathname.split("/")[2];

  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pageNo, setPageNo] = useState(1);

  const [onlineBiltyDetails, setOnlineBiltyDetails] =
    useState<OnlineBiltyDetails>({
      consigneeId: "",
      consignorId: "",
      tripId: id,
      material: "",
      weight: 0,
      unit: "",
      noOfPackages: 0,
      paidBy: "",
      gstPercentage: 0,
      gstPaidBy: "",
    });

  console.log(onlineBiltyDetails);
  let componentToRender;
  let footerToRender;
  let headerToRender;

  const handleCreateOnlineBilty = async () => {
    try {
      const response = await axios.post(
        `/api/trip/onlinebilty/${id}`,
        onlineBiltyDetails
      );
      if (response.data.message === "success") {
        toast({
          title: "Online Bilty created successfully",
          description: `Online Bilty Id: ${response.data.data.id}`,
        });
        setOpen(false);
      } else {
        toast({
          title: "Online Bilty creation failed",
          description: "Please try again.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the online bilty.",
      });
      console.error("Error while creating online bilty:", error);
    }
  };

  // Switch for rendering components based on the current page
  switch (pageNo) {
    case 1:
      headerToRender = (
        <h2 className="text-2xl font-bold text-center mb-4 text-black">
          Company Details
        </h2>
      );
      componentToRender = <BillComponentPage1 />;
      footerToRender = (
        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={() => setPageNo(2)} className="ml-2">
            Next
          </Button>
        </div>
      );
      break;

    case 2:
      headerToRender = (
        <h2 className="text-2xl font-bold text-center mb-4 text-black">
          LR & Consignor Consignee Details
        </h2>
      );
      componentToRender = (
        <BillComponentPage2
          setOnlineBiltyDetails={setOnlineBiltyDetails}
          onlineBiltyDetails={onlineBiltyDetails}
        />
      );
      footerToRender = (
        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPageNo(1)}
          >
            Back
          </Button>
          <Button type="button" onClick={() => setPageNo(3)} className="ml-2">
            Next
          </Button>
        </div>
      );

      break;

    case 3:
      headerToRender = (
        <h2 className="text-2xl font-bold text-center mb-4 text-black">
          Load & Trip Details
        </h2>
      );
      componentToRender = (
        <BillComponentPage3
          onlineBiltyDetails={onlineBiltyDetails}
          setOnlineBiltyDetails={setOnlineBiltyDetails}
        />
      );
      footerToRender = (
        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPageNo(2)}
          >
            Back
          </Button>
          <Button type="button" onClick={() => setPageNo(4)} className="ml-2">
            Next
          </Button>
        </div>
      );
      break;

    case 4:
      headerToRender = (
        <h2 className="text-2xl font-bold text-center mb-4 text-black">
          Online Bilty (LR)
        </h2>
      );

      componentToRender = <BillComponentPage4 setPageNo={setPageNo} />;
      footerToRender = (
        <div>
          <Button
            type="button"
            onClick={handleCreateOnlineBilty}
            className="ml-2"
          >
            Preview & Download
          </Button>
        </div>
      );
      break;

    default:
      headerToRender = null;
      componentToRender = <div>Error: Unknown page</div>;
      footerToRender = null;
  }

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={() => {
          setPageNo(1);
          setOpen(!open);
        }}
      >
        <DialogTrigger>
          <Button
            className="text-white bg-blue-500 hover:bg-blue-700"
            onClick={() => setOpen(true)}
          >
            Create LR
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl pb-5 border-b mb-5">
              {headerToRender}
            </DialogTitle>
            <DialogDescription>{componentToRender}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-end border-t pt-5">
            {footerToRender}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnlineBiltyDialogComponent;
