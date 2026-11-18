"use client";

import { useState, type ReactNode } from "react";

import { EditorActionsContext } from "@/components/editor/editor-actions-context";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { useProjectDialogs } from "@/components/editor/use-project-dialogs";

export function EditorShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dialogs = useProjectDialogs();

  return (
    <EditorActionsContext.Provider
      value={{ openCreateProject: dialogs.openCreate }}
    >
      <div className="flex min-h-full flex-1 flex-col">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          projects={dialogs.projects}
          onNewProject={dialogs.openCreate}
          onRenameProject={dialogs.openRename}
          onDeleteProject={dialogs.openDelete}
        />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
      <ProjectDialogs state={dialogs} />
    </EditorActionsContext.Provider>
  );
}
