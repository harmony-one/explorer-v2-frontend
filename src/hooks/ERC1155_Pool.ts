import { useState } from "react";
import { singletonHook } from "react-singleton-hook";

const initValue: ERC1155_Pool = {};

let globalSetMode = () => {
  return {};
};

export const useERC1155Pool = singletonHook(initValue, () => {
  const pool =
    (JSON.parse(
      window.localStorage.getItem("ERC1155_Pool") || "{}"
    ) as ERC1155_Pool) || initValue;

  const [mode, setMode] = useState<ERC1155_Pool>(pool);
  //@ts-ignore
  globalSetMode = setMode;
  return mode;
});

export const setERC1155Pool = (pool: ERC1155_Pool) => {
  //@ts-ignore
  globalSetMode(pool);
};

export interface ERC1155 {
  name: string;
  address: string;
  totalSupply: string;
  holders: string;
  decimals: number;
  symbol: string;
  meta?: any
}

export type ERC1155_Pool = Record<string, ERC1155>;
