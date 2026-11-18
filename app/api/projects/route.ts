import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getUserId, jsonError, parseId, parseName, readJson } from "@/libs/api";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return jsonError("Unauthorized", 401);

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });
  return Response.json({ projects });
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return jsonError("Unauthorized", 401);

  const body = await readJson(req);
  const name = parseName(body);
  if (name === null) return jsonError("Invalid name", 400);
  const id = parseId(body);
  if (id === null) return jsonError("Invalid id", 400);

  try {
    const project = await prisma.project.create({
      data: { id, ownerId: userId, name: name ?? "Untitled Project" },
    });
    revalidatePath("/editor", "layout");
    return Response.json({ project }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("A project with this ID already exists", 409);
    }
    throw err;
  }
}
