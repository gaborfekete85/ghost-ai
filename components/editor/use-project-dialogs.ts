"use client";

import { useState } from "react";

import { mockProjects, slugify, type Project } from "@/libs/projects";

export type ProjectDialog =
  | { type: "create" }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project }
  | null;

// Simulated latency so the loading state is exercised without an API.
const FAKE_DELAY_MS = 400;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [dialog, setDialog] = useState<ProjectDialog>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const slug = slugify(name);
  const canSubmit =
    !isLoading && (dialog?.type === "delete" || slug.length > 0);

  function openCreate() {
    setName("");
    setDialog({ type: "create" });
  }

  function openRename(project: Project) {
    setName(project.name);
    setDialog({ type: "rename", project });
  }

  function openDelete(project: Project) {
    setDialog({ type: "delete", project });
  }

  function close() {
    if (isLoading) return;
    setDialog(null);
  }

  async function submit() {
    if (!dialog || !canSubmit) return;
    const trimmed = name.trim();

    setIsLoading(true);
    await wait(FAKE_DELAY_MS);

    if (dialog.type === "create") {
      const project: Project = {
        id: crypto.randomUUID(),
        name: trimmed,
        slug,
        isOwner: true,
      };
      setProjects((current) => [project, ...current]);
    } else if (dialog.type === "rename") {
      const { id } = dialog.project;
      setProjects((current) =>
        current.map((p) => (p.id === id ? { ...p, name: trimmed, slug } : p)),
      );
    } else {
      const { id } = dialog.project;
      setProjects((current) => current.filter((p) => p.id !== id));
    }

    setIsLoading(false);
    setDialog(null);
  }

  return {
    projects,
    dialog,
    name,
    setName,
    slug,
    isLoading,
    canSubmit,
    openCreate,
    openRename,
    openDelete,
    close,
    submit,
  };
}

export type ProjectDialogsState = ReturnType<typeof useProjectDialogs>;
