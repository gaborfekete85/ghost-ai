import "server-only";

import { clerkClient } from "@clerk/nextjs/server";

import type { Collaborator } from "@/libs/projects";

type Row = { id: string; email: string };

/** Enriches stored collaborator emails with Clerk display name + avatar (email-only fallback). */
export async function enrichCollaborators(rows: Row[]): Promise<Collaborator[]> {
  const byEmail = new Map<string, { name: string | null; imageUrl: string | null }>();

  if (rows.length > 0) {
    try {
      const client = await clerkClient();
      // Clerk accepts up to 100 emails per query.
      for (let i = 0; i < rows.length; i += 100) {
        const emails = rows.slice(i, i + 100).map((r) => r.email);
        const { data } = await client.users.getUserList({
          emailAddress: emails,
          limit: emails.length,
        });
        for (const user of data) {
          const name =
            [user.firstName, user.lastName].filter(Boolean).join(" ") ||
            user.username ||
            null;
          for (const address of user.emailAddresses) {
            byEmail.set(address.emailAddress.toLowerCase(), {
              name,
              imageUrl: user.hasImage ? user.imageUrl : null,
            });
          }
        }
      }
    } catch (err) {
      // Enrichment is best-effort: fall back to showing emails only.
      console.error("Clerk collaborator lookup failed", err);
    }
  }

  return rows.map(({ id, email }) => ({
    id,
    email,
    ...(byEmail.get(email.toLowerCase()) ?? { name: null, imageUrl: null }),
  }));
}
