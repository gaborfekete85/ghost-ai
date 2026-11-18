"use client";

import { FolderOpen, Pencil, Plus, Trash2, Users, X } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project } from "@/libs/projects";
import { cn } from "@/libs/utils";

type ProjectSidebarProps = {
  isOpen: boolean;
  onClose?: () => void;
  onNewProject?: () => void;
  projects: Project[];
  onRenameProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
};

function EmptyState({ icon, message }: { icon: ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center text-text-muted">
      {icon}
      <p className="text-sm">{message}</p>
    </div>
  );
}

function ProjectItem({
  project,
  onRename,
  onDelete,
}: {
  project: Project;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
}) {
  return (
    <li className="group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-text-secondary hover:bg-bg-subtle hover:text-text-primary">
      <span className="min-w-0 flex-1 truncate">{project.name}</span>
      {project.isOwner ? (
        <div className="flex shrink-0 items-center md:opacity-0 md:transition-opacity md:group-focus-within:opacity-100 md:group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onRename(project)}
            aria-label={`Rename ${project.name}`}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(project)}
            aria-label={`Delete ${project.name}`}
            className="hover:text-state-error"
          >
            <Trash2 />
          </Button>
        </div>
      ) : null}
    </li>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onNewProject,
  projects,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const owned = projects.filter((p) => p.isOwner);
  const shared = projects.filter((p) => !p.isOwner);

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-x-0 top-12 bottom-0 z-30 bg-black/60 transition-opacity duration-200 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
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
            {owned.length === 0 ? (
              <EmptyState
                icon={<FolderOpen className="size-6" />}
                message="No projects yet"
              />
            ) : (
              <ul className="mt-2 flex flex-col gap-0.5">
                {owned.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    onRename={onRenameProject}
                    onDelete={onDeleteProject}
                  />
                ))}
              </ul>
            )}
          </TabsContent>
          <TabsContent value="shared">
            {shared.length === 0 ? (
              <EmptyState
                icon={<Users className="size-6" />}
                message="No shared projects"
              />
            ) : (
              <ul className="mt-2 flex flex-col gap-0.5">
                {shared.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    onRename={onRenameProject}
                    onDelete={onDeleteProject}
                  />
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>

        <div className="shrink-0 border-t border-border-default p-3">
          <Button className="w-full" onClick={onNewProject}>
            <Plus />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
