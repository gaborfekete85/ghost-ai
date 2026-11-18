import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getProjects } from "@/libs/projects-data";

// Placeholder workspace: confirms the project exists and is accessible.
// The canvas / Liveblocks room (room ID === project ID) comes later.
async function Workspace({ params }: PageProps<"/editor/[projectId]">) {
  const { projectId } = await params;
  const project = (await getProjects()).find((p) => p.id === projectId);
  if (!project) notFound();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
      <h1 className="text-2xl font-semibold text-text-primary">
        {project.name}
      </h1>
      <p className="font-mono text-xs text-text-muted">{project.id}</p>
    </div>
  );
}

export default function WorkspacePage(props: PageProps<"/editor/[projectId]">) {
  return (
    <Suspense fallback={null}>
      <Workspace {...props} />
    </Suspense>
  );
}
