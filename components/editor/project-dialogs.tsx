"use client";

import type { FormEvent } from "react";

import { EditorDialog } from "@/components/editor/editor-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProjectActionsState } from "@/hooks/use-project-actions";

export function ProjectDialogs({ state }: { state: ProjectActionsState }) {
  const {
    dialog,
    name,
    setName,
    roomId,
    isLoading,
    error,
    canSubmit,
    close,
    submit,
  } = state;

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
              Room ID:{" "}
              <span className="font-mono text-text-secondary">
                {roomId || "your-project"}
              </span>
            </p>
          </div>
          {error ? (
            <p role="alert" className="text-xs text-state-error">
              {error}
            </p>
          ) : null}
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
          </div>
          {error ? (
            <p role="alert" className="text-xs text-state-error">
              {error}
            </p>
          ) : null}
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
            {error ? (
              <p role="alert" className="mr-auto text-xs text-state-error">
                {error}
              </p>
            ) : null}
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
