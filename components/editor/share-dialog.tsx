"use client";

import { Check, Link2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { EditorDialog } from "@/components/editor/editor-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Collaborator } from "@/libs/projects";

type ShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  /** Only owners can invite and remove; collaborators get a read-only list. */
  isOwner: boolean;
};

async function api(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

function Avatar({ person }: { person: Collaborator }) {
  if (person.imageUrl) {
    return (
      // Clerk-hosted avatar; a plain img avoids configuring remote image hosts.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={person.imageUrl}
        alt=""
        className="size-8 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-subtle text-xs font-medium uppercase text-text-secondary"
    >
      {(person.name ?? person.email).charAt(0)}
    </span>
  );
}

export function ShareDialog({
  open,
  onOpenChange,
  projectId,
  isOwner,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const base = `/api/projects/${projectId}/collaborators`;

  // Fetch the list each time the dialog opens.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    api(base)
      .then((data) => {
        if (cancelled) return;
        setCollaborators(data.collaborators);
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load collaborators");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingList(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, base]);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/editor/${projectId}`,
      );
      setCopied(true);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy the link");
    }
  }

  async function invite(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || isInviting) return;
    setIsInviting(true);
    setError(null);
    try {
      const data = await api(base, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setCollaborators(data.collaborators);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not invite");
    } finally {
      setIsInviting(false);
    }
  }

  async function remove(id: string) {
    setRemovingId(id);
    setError(null);
    try {
      await api(`${base}/${id}`, { method: "DELETE" });
      setCollaborators((current) => current.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Share project"
      description={
        isOwner
          ? "Invite people by email to collaborate on this project."
          : "People with access to this project."
      }
    >
      <div className="flex flex-col gap-4">
        {isOwner ? (
          <form onSubmit={invite} className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              aria-label="Collaborator email"
              disabled={isInviting}
            />
            <Button type="submit" disabled={isInviting || !email.trim()}>
              {isInviting ? "Inviting..." : "Invite"}
            </Button>
          </form>
        ) : null}

        {error ? (
          <p role="alert" className="text-xs text-state-error">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Collaborators
          </h3>
          {isLoadingList && collaborators.length === 0 ? (
            <p className="py-4 text-center text-sm text-text-muted">Loading...</p>
          ) : collaborators.length === 0 ? (
            <p className="py-4 text-center text-sm text-text-muted">
              No collaborators yet
            </p>
          ) : (
            <ul className="flex max-h-60 flex-col gap-1 overflow-y-auto">
              {collaborators.map((person) => (
                <li
                  key={person.id}
                  className="flex items-center gap-3 rounded-md px-1 py-1.5"
                >
                  <Avatar person={person} />
                  <div className="min-w-0 flex-1">
                    {person.name ? (
                      <p className="truncate text-sm text-text-primary">
                        {person.name}
                      </p>
                    ) : null}
                    <p
                      className={
                        person.name
                          ? "truncate text-xs text-text-muted"
                          : "truncate text-sm text-text-primary"
                      }
                    >
                      {person.email}
                    </p>
                  </div>
                  {isOwner ? (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => void remove(person.id)}
                      disabled={removingId === person.id}
                      aria-label={`Remove ${person.email}`}
                      className="hover:text-state-error"
                    >
                      <Trash2 />
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button variant="outline" onClick={() => void copyLink()}>
          {copied ? <Check /> : <Link2 />}
          {copied ? "Copied!" : "Copy link"}
        </Button>
      </div>
    </EditorDialog>
  );
}
