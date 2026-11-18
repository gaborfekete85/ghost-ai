"use client";

import type { FormEvent } from "react";

import { EditorDialog } from "@/components/editor/editor-dialog";
import type { ProjectDialogsState } from "@/components/editor/use-project-dialogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProjectDialogs({ state }: { state: ProjectDialogsState }) {
  const { dialog, name, setName, slug, isLoading, canSubmit, close, submit } =
    state;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void submit();
  }

  const cancel = (
    <Button
      type="button"
      variant="outline"
      onClick={close}
      disabled={isLoading}
    >
      Cancel
    </Button>
  );

  return (
    <>
      <EditorDialog
        open={dialog?.type === "create"}
        onOpenChange={(open) => !open && close()}
        title="Create project"
        description="Give your new architecture workspace a name."
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              aria-label="Project name"
              disabled={isLoading}
            />
            <p className="text-xs text-text-muted">
              Slug:{" "}
              <span className="font-mono text-text-secondary">
                {slug || "your-project"}
              </span>
            </p>
          </div>
          <div className="flex justify-end gap-2">
            {cancel}
            <Button type="submit" disabled={!canSubmit}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </EditorDialog>

      <EditorDialog
        open={dialog?.type === "rename"}
        onOpenChange={(open) => !open && close()}
        title="Rename project"
        description={
          dialog?.type === "rename"
            ? `Current name: ${dialog.project.name}`
            : undefined
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              aria-label="Project name"
              disabled={isLoading}
            />
            <p className="text-xs text-text-muted">
              Slug:{" "}
              <span className="font-mono text-text-secondary">
                {slug || "your-project"}
              </span>
            </p>
          </div>
          <div className="flex justify-end gap-2">
            {cancel}
            <Button type="submit" disabled={!canSubmit}>
              {isLoading ? "Saving..." : "Rename"}
            </Button>
          </div>
        </form>
      </EditorDialog>

      <EditorDialog
        open={dialog?.type === "delete"}
        onOpenChange={(open) => !open && close()}
        title="Delete project"
        description={
          dialog?.type === "delete"
            ? `Delete "${dialog.project.name}"? This action cannot be undone.`
            : undefined
        }
        footer={
          <>
            {cancel}
            <Button
              type="button"
              variant="destructive"
              onClick={() => void submit()}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      />
    </>
  );
}
