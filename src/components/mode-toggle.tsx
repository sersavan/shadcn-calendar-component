"use client";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "lucide-react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <SunIcon className="h-[1.5rem] w-[1.3rem] dark:hidden" />
      <MoonIcon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ModeToggle;
