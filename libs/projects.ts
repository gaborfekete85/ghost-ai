export type Project = {
  /** Also the Liveblocks room ID. */
  id: string;
  name: string;
  /** Owned projects can be renamed/deleted; shared ones cannot. */
  isOwner: boolean;
};

export function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Room ID = slugified name + short unique suffix, e.g. `payments-platform-k3x9a2`. */
export function createRoomId(name: string, suffix: string): string {
  return [slugify(name), suffix].filter(Boolean).join("-");
}

export function generateSuffix(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 6);
}

export const ROOM_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** A shared user. Name/avatar come from Clerk and are null when no Clerk user matches the email. */
export type Collaborator = {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
};
