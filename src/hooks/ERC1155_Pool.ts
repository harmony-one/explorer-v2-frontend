import { useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";
import { IndexedDbStore, loadFromIndexedDB } from "../utils/indexedDB";
import { isTokenBridged } from "../utils";

const initValue: ERC1155_Pool = {};

let globalSetMode = () => {
  return {};
};

export const useERC1155Pool = singletonHook(initValue, () => {
  const getPool = async () => {
    try {
      const erc1155 = await loadFromIndexedDB(IndexedDbStore.ERC1155Pool)
      const erc1155Map = {} as Record<string, ERC1155>;
      erc1155.forEach(item => {
        erc1155Map[item.address] = {
          ...item,
          isBridged: isTokenBridged(item.address)
        };
      })
      setMode(erc1155Map)
    } catch (e) {
      console.error('Cannot get ERC1155 records: ', (e as Error).message)
    }
  }

  useEffect(() => {
    getPool()
  }, [])

  const [mode, setMode] = useState<ERC1155_Pool>(initValue);
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
  meta?: any;
  isBridged: boolean;
}

export type ERC1155_Pool = Record<string, ERC1155>;
