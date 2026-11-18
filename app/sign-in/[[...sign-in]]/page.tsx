import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";

import { AuthLayout } from "@/components/auth/auth-layout";

export default function SignInPage() {
  return (
    <AuthLayout>
      <Suspense>
        <SignIn />
      </Suspense>
    </AuthLayout>
  );
}
