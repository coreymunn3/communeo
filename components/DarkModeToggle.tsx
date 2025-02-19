import React from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import { Button } from "./ui/button";

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();

  const setDarkTheme = () => setTheme("dark");
  const setLightTheme = () => setTheme("light");

  if (theme === "light") {
    return (
      <Button
        variant="ghost"
        onClick={setDarkTheme}
        className="hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        <MoonIcon />
      </Button>
    );
  }
  if (theme === "dark") {
    return (
      <Button
        variant="ghost"
        onClick={setLightTheme}
        className="hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        <SunIcon />
      </Button>
    );
  }
};

export default DarkModeToggle;
