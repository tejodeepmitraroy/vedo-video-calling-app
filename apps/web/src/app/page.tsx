"use client"
import FetchArea from "@/components/FetchArea";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from "@clerk/nextjs";

export default function Home() {
   const { isLoaded, userId, sessionId, getToken } = useAuth();

  return (
    <main className="flex min-h-screen flex-col gap-3  items-center justify-center p-24">
      <div className="fixed w-full top-0 flex p-5 ">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>
      </div>
      <div>Welcome in VEDO, the video calling app!</div>
      
      <div>
        <FetchArea />
      </div>
    </main>
  );
}
