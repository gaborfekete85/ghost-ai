import { auth } from "@clerk/nextjs/server";

import { ROOM_ID_PATTERN } from "@/libs/projects";

export function jsonError(error: string, status: number) {
  return Response.json({ error }, { status });
}

/** Returns the Clerk user ID, or null when the request is unauthenticated. */
export async function getUserId() {
  const { userId } = await auth();
  return userId;
}

/** Parses an optional project name from unknown JSON input. */
export function parseName(body: unknown): string | undefined | null {
  if (typeof body !== "object" || body === null || !("name" in body)) {
    return undefined;
  }
  const { name } = body;
  if (typeof name !== "string") return null;
  return name.trim() || undefined;
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}

/** Parses an optional caller-supplied project ID (used as the Liveblocks room ID). */
export function parseId(body: unknown): string | undefined | null {
  if (typeof body !== "object" || body === null || !("id" in body)) {
    return undefined;
  }
  const { id } = body;
  if (id === undefined) return undefined;
  if (typeof id !== "string" || id.length > 100 || !ROOM_ID_PATTERN.test(id)) {
    return null;
  }
  return id;
}
