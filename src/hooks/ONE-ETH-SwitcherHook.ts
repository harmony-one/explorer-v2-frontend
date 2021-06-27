import { useState } from "react";
import { singletonHook } from "react-singleton-hook";

const initCurrency: currencyType = "ONE";

let globalSetMode = () => {
  throw new Error("you must useDarkMode before setting its state");
};

export const useCurrency = singletonHook(initCurrency, () => {
  const currentTheme = window.localStorage.getItem('currency') as currencyType || initCurrency;

  const [mode, setMode] = useState<currencyType>(currentTheme);
  //@ts-ignore
  globalSetMode = setMode;
  return mode;
});


export const setCurrency = (mode: currencyType) =>  {
  //@ts-ignore
  globalSetMode(mode);
  window.localStorage.setItem('currency', mode);
};

export type currencyType = "ONE" | "ETH";
