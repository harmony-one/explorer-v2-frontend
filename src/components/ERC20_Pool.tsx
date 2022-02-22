import React, { useEffect } from "react";
import { getAllERC20 } from "src/api/client";
import { setERC20Pool, Erc20 } from "src/hooks/ERC20_Pool";
import { getTabHidden, useWindowFocused } from "src/hooks/useWindowFocusHook";
import { IndexedDbKeyPath, IndexedDbStore, saveToIndexedDB } from "../utils/indexedDB";
import { isTokenBridged } from "../utils";

export function ERC20_Pool() {
  const focus = useWindowFocused();
  useEffect(() => {
    let tId = 0;

    const getRates = async () => {
      if (getTabHidden()) {
        return; // hidden tab, ignore the refresh request
      }
      try {
        let erc20: Erc20[] = await getAllERC20();
        const erc20Map = {} as Record<string, Erc20>;
        erc20 = erc20.map((item) => {
          erc20Map[item.address] = {
            ...item,
            isBridged: isTokenBridged(item.address)
          };
          return {
            [IndexedDbKeyPath]: item.address,
            ...item
          }
        });
        setERC20Pool(erc20Map);
        await saveToIndexedDB(IndexedDbStore.ERC20Pool, erc20)
        localStorage.setItem(IndexedDbStore.ERC20Pool, '1')
        console.log(`ERC20 tokens updated, count: ${erc20.length}`)
      } catch (e) {
        console.error('Cannot update ERC20 tokens', (e as Error).message)
      } finally {
        window.clearTimeout(tId);
        tId = window.setTimeout(getRates, 10 * 60 * 1e3);
      }
    };

    tId = window.setTimeout(
      () => {
        getRates();
      },
      window.localStorage.getItem(IndexedDbStore.ERC20Pool) ? 2000 : 0
    );

    return () => {
      clearTimeout(tId);
    };
  }, []);

  return null;
}
