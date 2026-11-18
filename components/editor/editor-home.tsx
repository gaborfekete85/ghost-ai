"use client";

import { Plus } from "lucide-react";

import { useEditorActions } from "@/components/editor/editor-actions-context";
import { Button } from "@/components/ui/button";

export function EditorHome() {
  const { openCreateProject } = useEditorActions();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold text-text-primary">
        Create a project or open an existing one
      </h1>
      <p className="max-w-md text-sm text-text-muted">
        Start a new architecture workspace, or choose a project from the
        sidebar.
      </p>
      <Button onClick={openCreateProject}>
        <Plus />
        New Project
      </Button>
    </div>
  );
}
