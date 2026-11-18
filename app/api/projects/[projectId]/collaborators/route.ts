import { revalidatePath } from "next/cache";

import { Prisma } from "@/generated/prisma/client";
import { enrichCollaborators } from "@/lib/collaborators";
import { prisma } from "@/lib/prisma";
import { getIdentity, getProjectRole } from "@/lib/project-access";
import { jsonError, readJson } from "@/libs/api";

type Context = { params: Promise<{ projectId: string }> };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function authorize(projectId: string, ownerOnly: boolean) {
  const identity = await getIdentity();
  if (!identity) return { error: jsonError("Unauthorized", 401) };

  const { exists, role } = await getProjectRole(projectId, identity);
  if (!exists) return { error: jsonError("Project not found", 404) };
  if (!role || (ownerOnly && role !== "owner")) {
    return { error: jsonError("Forbidden", 403) };
  }
  return { identity, role };
}

async function listCollaborators(projectId: string) {
  const rows = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true },
  });
  return enrichCollaborators(rows);
}

/** Owners and collaborators can view the list. */
export async function GET(_req: Request, { params }: Context) {
  const { projectId } = await params;
  const { error, role } = await authorize(projectId, false);
  if (error) return error;

  return Response.json({ role, collaborators: await listCollaborators(projectId) });
}

/** Owner only: invite a collaborator by email. */
export async function POST(req: Request, { params }: Context) {
  const { projectId } = await params;
  const { error, identity } = await authorize(projectId, true);
  if (error) return error;

  const body = await readJson(req);
  const raw =
    typeof body === "object" && body !== null && "email" in body
      ? (body as { email: unknown }).email
      : undefined;
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return jsonError("A valid email is required", 400);
  }
  if (email === identity.email?.toLowerCase()) {
    return jsonError("You already own this project", 400);
  }

  try {
    await prisma.projectCollaborator.create({ data: { projectId, email } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("This person already has access", 409);
    }
    throw err;
  }

  revalidatePath("/editor", "layout");
  return Response.json(
    { collaborators: await listCollaborators(projectId) },
    { status: 201 },
  );
}
