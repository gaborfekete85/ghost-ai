import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceShell } from "@/components/editor/workspace-shell";
import { getAccessibleProject, getIdentity } from "@/lib/project-access";
import { getProjects } from "@/libs/projects-data";

async function Workspace({ params }: PageProps<"/editor/[roomId]">) {
  const { roomId } = await params;

  const identity = await getIdentity();
  if (!identity) redirect("/sign-in");

  const project = await getAccessibleProject(roomId, identity);
  if (!project) return <AccessDenied />;

  const projects = await getProjects();

  return (
    <WorkspaceShell
      projects={projects}
      project={{
        id: project.id,
        name: project.name,
        isOwner: project.ownerId === identity.userId,
      }}
    />
  );
}

export default function WorkspacePage(props: PageProps<"/editor/[roomId]">) {
  return (
    <Suspense fallback={null}>
      <Workspace {...props} />
    </Suspense>
  );
}
