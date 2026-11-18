"use client";

import { createContext, useContext } from "react";

type EditorActions = { openCreateProject: () => void };

export const EditorActionsContext = createContext<EditorActions | null>(null);

export function useEditorActions(): EditorActions {
  const actions = useContext(EditorActionsContext);
  if (!actions) {
    throw new Error("useEditorActions must be used inside EditorShell");
  }
  return actions;
}
