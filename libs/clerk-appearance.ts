import { dark } from "@clerk/ui/themes";

// Clerk's dark theme as the base, overridden with the app's CSS variables.
export const clerkAppearance = {
  theme: dark,
  variables: {
    colorBackground: "var(--color-bg-surface)",
    colorInput: "var(--color-bg-elevated)",
    colorForeground: "var(--color-text-primary)",
    colorMutedForeground: "var(--color-text-muted)",
    colorInputForeground: "var(--color-text-primary)",
    colorPrimary: "var(--color-accent-primary)",
    colorPrimaryForeground: "var(--color-bg-base)",
    colorNeutral: "var(--color-text-primary)",
    colorBorder: "var(--color-border-default)",
    colorDanger: "var(--color-state-error)",
    colorSuccess: "var(--color-state-success)",
    colorWarning: "var(--color-state-warning)",
    fontFamily: "var(--font-sans)",
    borderRadius: "var(--radius)",
  },
};
