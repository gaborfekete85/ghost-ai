import { Lock } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 bg-bg-base px-4 text-center">
      <Lock className="size-8 text-text-muted" aria-hidden />
      <h1 className="text-xl font-semibold text-text-primary">Access denied</h1>
      <p className="max-w-sm text-sm text-text-muted">
        This project doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Button asChild>
        <Link href="/editor">Back to editor</Link>
      </Button>
    </div>
  );
}
