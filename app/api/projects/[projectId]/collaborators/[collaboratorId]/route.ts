import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getIdentity, getProjectRole } from "@/lib/project-access";
import { jsonError } from "@/libs/api";

type Context = {
  params: Promise<{ projectId: string; collaboratorId: string }>;
};

/** Owner only: remove a collaborator. */
export async function DELETE(_req: Request, { params }: Context) {
  const { projectId, collaboratorId } = await params;

  const identity = await getIdentity();
  if (!identity) return jsonError("Unauthorized", 401);

  const { exists, role } = await getProjectRole(projectId, identity);
  if (!exists) return jsonError("Project not found", 404);
  if (role !== "owner") return jsonError("Forbidden", 403);

  // Scoped to the project so an ID from another project can't be removed here.
  const { count } = await prisma.projectCollaborator.deleteMany({
    where: { id: collaboratorId, projectId },
  });
  if (count === 0) return jsonError("Collaborator not found", 404);

  revalidatePath("/editor", "layout");
  return new Response(null, { status: 204 });
}
