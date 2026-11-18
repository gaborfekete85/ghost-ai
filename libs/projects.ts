export type Project = {
  id: string;
  name: string;
  slug: string;
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

// Mock data only: no API calls or persistence yet.
export const mockProjects: Project[] = [
  { id: "p1", name: "Payments Platform", slug: "payments-platform", isOwner: true },
  { id: "p2", name: "Realtime Chat", slug: "realtime-chat", isOwner: true },
  { id: "p3", name: "Data Pipeline", slug: "data-pipeline", isOwner: true },
  { id: "p4", name: "Auth Service", slug: "auth-service", isOwner: false },
  { id: "p5", name: "Mobile Backend", slug: "mobile-backend", isOwner: false },
];
