import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

async function Redirector(): Promise<null> {
  const { isAuthenticated } = await auth();
  redirect(isAuthenticated ? "/editor" : "/sign-in");
}

export default function Home() {
  return (
    <Suspense>
      <Redirector />
    </Suspense>
  );
}
