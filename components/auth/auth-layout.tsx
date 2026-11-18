import type { ReactNode } from "react";
import { FileText, Share2, Sparkles, type LucideIcon } from "lucide-react";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Sparkles,
    title: "AI Architecture Generation",
    description: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-base font-sans text-text-primary">
      <aside className="hidden w-1/2 flex-col justify-between border-r border-border-default bg-bg-surface p-8 lg:flex">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-accent-primary" aria-hidden />
          <span className="text-base font-semibold">Ghost AI</span>
        </div>

        <div className="flex max-w-xl flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              Design systems at the speed of thought.
            </h1>
            <p className="text-base leading-relaxed text-text-muted">
              Describe your architecture in plain English. Ghost AI maps it to a
              shared canvas your whole team can refine in real time.
            </p>
          </div>

          <ul className="flex flex-col gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border-default bg-accent-primary-dim text-accent-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{title}</span>
                  <span className="text-sm text-text-muted">{description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-text-faint">
          © Ghost AI. All rights reserved.
        </p>
      </aside>

      <main className="flex w-full flex-1 items-center justify-center px-4 py-8 lg:w-1/2">
        {children}
      </main>
    </div>
  );
}
