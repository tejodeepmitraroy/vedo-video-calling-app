"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";

export const SignOutButton = () => {
  const { signOut } = useClerk();

  return (
    // Clicking on this button will sign out a user
    // and reroute them to the "/" (home) page.
    <Button
      variant={"destructive"}
      onClick={() => signOut({ redirectUrl: "/sign-in" })}
    >
      Sign out
    </Button>
  );
};
