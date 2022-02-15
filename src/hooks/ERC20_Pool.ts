import { useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";
import { IndexedDbStore, loadFromIndexedDB } from "../utils/indexedDB";
import { isTokenBridged } from "../utils";

const initValue: ERC20_Pool = {};

let globalSetMode = () => {
  return {};
};

export const useERC20Pool = singletonHook(initValue, () => {
  const getPool = async () => {
    try {
      const erc20 = await loadFromIndexedDB(IndexedDbStore.ERC20Pool)
      const erc20Map = {} as Record<string, Erc20>;
      erc20.forEach(item => {
        erc20Map[item.address] = {
          ...item,
          isBridged: isTokenBridged(item.address)
        };
      })
      setMode(erc20Map)
    } catch (e) {
      console.error('Cannot get ERC20 records: ', (e as Error).message)
    }
  }

  useEffect(() => {
    getPool()
  }, [])

  const [mode, setMode] = useState<ERC20_Pool>(initValue);
  //@ts-ignore
  globalSetMode = setMode;
  return mode;
});

export const setERC20Pool = (pool: ERC20_Pool) => {
  //@ts-ignore
  globalSetMode(pool);
};

export interface Erc20 {
  name: string;
  address: string;
  totalSupply: string;
  circulatingSupply: string
  holders: string;
  decimals: number;
  symbol: string;
  lastUpdateBlockNumber: string
  meta?: {
    name?: string
    image?: string;
  };
  isBridged: boolean;
}

export type ERC20_Pool = Record<string, Erc20>;
