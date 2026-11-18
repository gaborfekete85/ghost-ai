import { Suspense, type ReactNode } from "react";

import { EditorShell } from "@/components/editor/editor-shell";
import { getProjects } from "@/libs/projects-data";

// Fetched on the server; the sidebar lives in this layout so every editor
// page (home and workspaces) shares the same real project list.
async function EditorWithProjects({ children }: { children: ReactNode }) {
  const projects = await getProjects();
  return <EditorShell projects={projects}>{children}</EditorShell>;
}

export default function EditorLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <EditorWithProjects>{children}</EditorWithProjects>
    </Suspense>
  );
}
