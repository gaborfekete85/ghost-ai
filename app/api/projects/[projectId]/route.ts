import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getUserId, jsonError, parseName, readJson } from "@/libs/api";

type Context = { params: Promise<{ projectId: string }> };

/** Resolves the project and enforces ownership; returns an error Response otherwise. */
async function authorize(projectId: string) {
  const userId = await getUserId();
  if (!userId) return { error: jsonError("Unauthorized", 401) };

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { error: jsonError("Project not found", 404) };
  if (project.ownerId !== userId) return { error: jsonError("Forbidden", 403) };

  return { project };
}

export async function PATCH(req: Request, { params }: Context) {
  const { projectId } = await params;
  const { error } = await authorize(projectId);
  if (error) return error;

  const name = parseName(await readJson(req));
  if (!name) return jsonError("A non-empty name is required", 400);

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { name },
  });
  revalidatePath("/editor", "layout");
  return Response.json({ project });
}

export async function DELETE(_req: Request, { params }: Context) {
  const { projectId } = await params;
  const { error } = await authorize(projectId);
  if (error) return error;

  await prisma.project.delete({ where: { id: projectId } });
  revalidatePath("/editor", "layout");
  return new Response(null, { status: 204 });
}
