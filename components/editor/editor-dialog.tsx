"use client";

import type { ComponentProps, ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/libs/utils";

type EditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Dialog body, rendered between the header and the footer. */
  children?: ReactNode;
  /** Footer actions, typically `Button`s. */
  footer?: ReactNode;
  className?: string;
} & Pick<ComponentProps<typeof DialogContent>, "showCloseButton">;

/**
 * Reusable dialog pattern: title, description, body and footer actions,
 * styled with the project color tokens from `globals.css`.
 */
export function EditorDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  showCloseButton,
}: EditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(
          "border-border-default bg-bg-elevated text-text-primary",
          className,
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-text-primary">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-text-muted">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}
