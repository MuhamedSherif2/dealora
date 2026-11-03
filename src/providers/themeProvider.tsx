"use client";

import type { ComponentProps } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      // on the server the script stays a normal script (so it runs and prevents the flash);
      // on the client React stops complaining about it
      scriptProps={typeof window === "undefined" ? undefined : { type: "application/json" }}
    />
  );
}