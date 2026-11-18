import { Suspense } from "react";
import { SignUp } from "@clerk/nextjs";

import { AuthLayout } from "@/components/auth/auth-layout";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <Suspense>
        <SignUp />
      </Suspense>
    </AuthLayout>
  );
}
