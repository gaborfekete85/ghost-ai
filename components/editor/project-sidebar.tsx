"use client";

import { FolderOpen, Plus, Users, X } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/libs/utils";

type ProjectSidebarProps = {
  isOpen: boolean;
  onClose?: () => void;
  onNewProject?: () => void;
};

function EmptyState({ icon, message }: { icon: ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center text-text-muted">
      {icon}
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onNewProject,
}: ProjectSidebarProps) {
  return (
    <aside
      aria-label="Projects"
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={cn(
        "fixed top-12 bottom-0 left-0 z-40 flex w-72 flex-col border-r border-border-default bg-bg-surface shadow-xl transition-transform duration-200 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border-default px-4">
        <h2 className="text-sm font-semibold text-text-primary">Projects</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close sidebar"
          className="text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
        >
          <X />
        </Button>
      </div>

      <Tabs defaultValue="my-projects" className="min-h-0 flex-1 gap-0 p-3">
        <TabsList className="w-full bg-bg-elevated">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent value="my-projects">
          <EmptyState
            icon={<FolderOpen className="size-6" />}
            message="No projects yet"
          />
        </TabsContent>
        <TabsContent value="shared">
          <EmptyState
            icon={<Users className="size-6" />}
            message="No shared projects"
          />
        </TabsContent>
      </Tabs>

      <div className="shrink-0 border-t border-border-default p-3">
        <Button className="w-full" onClick={onNewProject}>
          <Plus />
          New Project
        </Button>
      </div>
    </aside>
  );
}
