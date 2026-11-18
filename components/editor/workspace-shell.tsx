"use client";

import { PanelRightClose, PanelRightOpen, Share2 } from "lucide-react";
import { useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ShareDialog } from "@/components/editor/share-dialog";
import { Button } from "@/components/ui/button";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { Project } from "@/libs/projects";
import { cn } from "@/libs/utils";

type WorkspaceShellProps = {
  projects: Project[];
  /** The open project; its ID doubles as the room ID. */
  project: Project;
};

export function WorkspaceShell({ projects, project }: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const actions = useProjectActions();
  const AiIcon = isAiOpen ? PanelRightClose : PanelRightOpen;

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        title={project.name}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsShareOpen(true)}
            >
              <Share2 />
              Share
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAiOpen((open) => !open)}
              aria-label={isAiOpen ? "Close AI sidebar" : "Open AI sidebar"}
              aria-expanded={isAiOpen}
              className="text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
            >
              <AiIcon />
            </Button>
          </>
        }
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={projects}
        currentRoomId={project.id}
        onNewProject={actions.openCreate}
        onRenameProject={actions.openRename}
        onDeleteProject={actions.openDelete}
      />

      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 items-center justify-center bg-bg-base">
          <p className="text-sm text-text-muted">Canvas coming soon</p>
        </main>
        <aside
          aria-label="AI assistant"
          aria-hidden={!isAiOpen}
          inert={!isAiOpen}
          className={cn(
            "w-80 shrink-0 flex-col border-l border-border-default bg-bg-surface",
            isAiOpen ? "flex" : "hidden",
          )}
        >
          <div className="flex h-12 shrink-0 items-center border-b border-border-default px-4">
            <h2 className="text-sm font-semibold text-text-primary">
              AI Assistant
            </h2>
          </div>
          <div className="flex flex-1 items-center justify-center px-4 text-center">
            <p className="text-sm text-text-muted">AI chat coming soon</p>
          </div>
        </aside>
      </div>

      <ProjectDialogs state={actions} />
      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        projectId={project.id}
        isOwner={project.isOwner}
      />
    </div>
  );
}
