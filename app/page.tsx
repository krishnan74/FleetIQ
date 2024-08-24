import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoginButton } from "./auth";

const Page = () => {
  return (
    <div className={` bg-gradient-to-r from-blue-400 to-purple-600 text-white`}>
      <div className="flex flex-col items-center justify-center h-screen text-center px-6 py-12">
        <h1 className="text-5xl font-extrabold mb-6">Welcome to FleetIQ</h1>
        <p className="text-lg mb-8 max-w-lg mx-auto">
          FleetIQ is your ultimate fleet management solution. Optimize, track,
          and manage your fleet with ease.
        </p>
        <div className="flex gap-5">
          <LoginButton />
          <Link href="/register">
            <Button>Sign up</Button>
          </Link>
        </div>

        <div className="mt-8 text-sm">
          <p>© 2024 FleetIQ. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
