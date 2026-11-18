import "server-only";

import { prisma } from "@/lib/prisma";
import { getIdentity } from "@/lib/project-access";
import type { Project } from "@/libs/projects";

/** Owned projects plus projects shared with the user's email (flagged `isOwner: false`). */
export async function getProjects(): Promise<Project[]> {
  const identity = await getIdentity();
  if (!identity) return [];
  const { userId, email } = identity;

  const [owned, shared] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    }),
    email
      ? prisma.project.findMany({
          where: {
            ownerId: { not: userId },
            collaborators: { some: { email: { equals: email, mode: "insensitive" } } },
          },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  return [
    ...owned.map(({ id, name }) => ({ id, name, isOwner: true })),
    ...shared.map(({ id, name }) => ({ id, name, isOwner: false })),
  ];
}
