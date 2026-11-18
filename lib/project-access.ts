import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export type Identity = { userId: string; email: string | null };

/** Current Clerk identity: user ID + primary email, or null when signed out. */
export async function getIdentity(): Promise<Identity | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  return { userId, email: user?.primaryEmailAddress?.emailAddress ?? null };
}

/**
 * Returns the project if the identity owns it or is a collaborator (by email),
 * otherwise null. Missing projects also return null so existence isn't leaked.
 */
export async function getAccessibleProject(
  projectId: string,
  { userId, email }: Identity,
) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: userId },
        ...(email
          ? [
              {
                collaborators: {
                  some: { email: { equals: email, mode: "insensitive" as const } },
                },
              },
            ]
          : []),
      ],
    },
  });
}

export type ProjectRole = "owner" | "collaborator";

/**
 * Looks up the identity's role on a project. `exists` distinguishes a missing
 * project (404) from one the identity may not touch (403).
 */
export async function getProjectRole(
  projectId: string,
  identity: Identity,
): Promise<{ exists: boolean; role: ProjectRole | null }> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });
  if (!project) return { exists: false, role: null };
  if (project.ownerId === identity.userId) return { exists: true, role: "owner" };

  const accessible = await getAccessibleProject(projectId, identity);
  return { exists: true, role: accessible ? "collaborator" : null };
}
