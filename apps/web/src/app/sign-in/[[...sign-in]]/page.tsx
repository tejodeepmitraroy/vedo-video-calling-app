import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <SignIn path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}
