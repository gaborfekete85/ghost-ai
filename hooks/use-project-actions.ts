"use client";

import { usePathname, useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import {
  createRoomId,
  generateSuffix,
  type Project,
} from "@/libs/projects";

export type ProjectDialog =
  | { type: "create" }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project }
  | null;

async function request(url: string, init: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res;
}

export function useProjectActions() {
  const router = useRouter();
  const pathname = usePathname();

  const [dialog, setDialog] = useState<ProjectDialog>(null);
  const [name, setName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roomId = createRoomId(name, suffix);
  const canSubmit =
    !isLoading &&
    (dialog?.type === "delete" ||
      (dialog?.type === "rename" ? name.trim().length > 0 : roomId !== suffix));

  function open(next: ProjectDialog, initialName = "") {
    setName(initialName);
    setError(null);
    setDialog(next);
  }

  function openCreate() {
    setSuffix(generateSuffix());
    open({ type: "create" });
  }

  const openRename = (project: Project) =>
    open({ type: "rename", project }, project.name);
  const openDelete = (project: Project) => open({ type: "delete", project });

  function close() {
    if (isLoading) return;
    setDialog(null);
  }

  /** Navigate, then refresh so the layout-fetched sidebar list is re-queried for the new route. */
  function navigateAndRefresh(href: string) {
    startTransition(() => {
      router.push(href);
      router.refresh();
    });
  }

  async function submit() {
    if (!dialog || !canSubmit) return;
    setIsLoading(true);
    setError(null);

    try {
      if (dialog.type === "create") {
        // Project ID and Liveblocks room ID are the same value.
        await request("/api/projects", {
          method: "POST",
          body: JSON.stringify({ id: roomId, name: name.trim() }),
        });
        setDialog(null);
        navigateAndRefresh(`/editor/${roomId}`);
      } else if (dialog.type === "rename") {
        await request(`/api/projects/${dialog.project.id}`, {
          method: "PATCH",
          body: JSON.stringify({ name: name.trim() }),
        });
        setDialog(null);
        router.refresh();
      } else {
        const { id } = dialog.project;
        await request(`/api/projects/${id}`, { method: "DELETE" });
        setDialog(null);
        if (pathname === `/editor/${id}`) navigateAndRefresh("/editor");
        else router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    dialog,
    name,
    setName,
    roomId,
    isLoading,
    error,
    canSubmit,
    openCreate,
    openRename,
    openDelete,
    close,
    submit,
  };
}

export type ProjectActionsState = ReturnType<typeof useProjectActions>;
