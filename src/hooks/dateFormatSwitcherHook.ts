import { useState } from "react";
import { singletonHook } from "react-singleton-hook";

export enum DateFormat {
  RELATIVE= 'relative',
  EXACT = 'exact'
}

const defaultDateFormat: DateFormat = DateFormat.EXACT;

let globalSetMode = () => {
  throw new Error("you must useDarkMode before setting its state");
};

const ITEM_NAME = 'dateFormat';

export const setDateFormatMode = (mode: DateFormat) => {
  //@ts-ignore
  globalSetMode(mode);
  window.localStorage.setItem(ITEM_NAME, mode);
};

export const useDateFormatMode = singletonHook<DateFormat>(
  (window.localStorage.getItem(ITEM_NAME) || defaultDateFormat) as DateFormat,
  () => {
    const currentDateFormat =
      (window.localStorage.getItem(ITEM_NAME) as DateFormat) || defaultDateFormat;

    const [mode, setMode] = useState<DateFormat>(currentDateFormat);
    //@ts-ignore
    globalSetMode = setMode;
    return mode;
  }
);


