import { useState } from "react";
import { singletonHook } from "react-singleton-hook";

const initTheme: themeType = "light";

let globalSetMode = () => {
  throw new Error("you must useDarkMode before setting its state");
};

export const useThemeMode = singletonHook(initTheme, () => {
  const currentTheme = window.localStorage.getItem('themeMode') as themeType || initTheme;

  const [mode, setMode] = useState<themeType>(currentTheme);
  //@ts-ignore
  globalSetMode = setMode;
  return mode;
});


export const setThemeMode = (mode: themeType) =>  {
  //@ts-ignore
  globalSetMode(mode);
  window.localStorage.setItem('themeMode', mode);
};

export type themeType = "light" | "dark";
