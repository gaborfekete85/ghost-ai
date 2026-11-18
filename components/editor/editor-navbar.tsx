"use client";

import { UserButton } from "@clerk/nextjs";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type EditorNavbarProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  /** Centered title, e.g. the current project name. */
  title?: string;
  /** Extra actions rendered before the user menu. */
  actions?: ReactNode;
};

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  title,
  actions,
}: EditorNavbarProps) {
  const ToggleIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-default bg-bg-base px-3">
      <div className="flex flex-1 items-center justify-start">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
          className="text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
        >
          <ToggleIcon />
        </Button>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-center">
        {title ? (
          <h1 className="truncate text-sm font-medium text-text-primary">
            {title}
          </h1>
        ) : null}
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        {actions}
        <UserButton />
      </div>
    </header>
  );
}
