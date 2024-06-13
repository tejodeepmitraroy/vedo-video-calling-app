import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-3  items-center justify-center p-24">

      <div>Welcome Home</div>
      
      <Button variant={"destructive"}>Sign Out</Button>
    </main>
  );
}
