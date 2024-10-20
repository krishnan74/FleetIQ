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

const OnlineBiltyDialogComponent: React.FC<DataFormProps> = ({
  refresh,
  setRefresh,
}) => {
  const pathname = usePathname();
  const id = pathname.split("/")[2];

  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pageNo, setPageNo] = useState(1);

  const handleSubmit = () => {
    // Handle form submission or finalization logic
    toast({ description: "Form submitted successfully!" });
    setOpen(false); // Close the dialog after submission
  };

  let componentToRender;
  let footerToRender;

  // Switch for rendering components based on the current page
  switch (pageNo) {
    case 1:
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
      componentToRender = <BillComponentPage2 />;
      footerToRender = (
        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPageNo(1)}
          >
            Back
          </Button>
          <Button type="button" onClick={handleSubmit} className="ml-2">
            Submit
          </Button>
        </div>
      );
      break;

    default:
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
              Company Details
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
