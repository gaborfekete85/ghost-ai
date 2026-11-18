"use client";

import { useState, type ReactNode } from "react";

import { EditorActionsContext } from "@/components/editor/editor-actions-context";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { Project } from "@/libs/projects";

export function EditorShell({
  children,
  projects,
}: {
  children: ReactNode;
  projects: Project[];
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dialogs = useProjectActions();

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
          projects={projects}
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
