"use client";
import { Button } from "@/components/ui/button";

import { signIn, signOut } from "next-auth/react";

export const LoginButton = () => {
  return (
    <Button
      onClick={() =>
        signIn(undefined, {
          callbackUrl: "/dashboard",
        })
      }
    >
      Sign in
    </Button>
  );
};

export const LogoutButton = () => {
  return (
    <Button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</Button>
  );
};
