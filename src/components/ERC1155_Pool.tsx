import React, { useEffect } from "react";
import { getAllERC1155 } from "src/api/client";
import { setERC1155Pool, ERC1155 } from "src/hooks/ERC1155_Pool";
import { getTabHidden, useWindowFocused } from "src/hooks/useWindowFocusHook";
import { IndexedDbKeyPath, IndexedDbStore, saveToIndexedDB } from "../utils/indexedDB";
import { isTokenBridged } from "../utils";

export function ERC1155_Pool() {
  const focus = useWindowFocused();

  useEffect(() => {
    let tId = 0;

    const getRates = async () => {
      if (getTabHidden()) {
        return; // ignore when tab is hidden
      }
      try {
        const erc1155Map = {} as Record<string, ERC1155>;
        let erc1155: ERC1155[] = await getAllERC1155();
        erc1155 = erc1155.map(item => {
          erc1155Map[item.address] = {
            ...item,
            isBridged: isTokenBridged(item.address)
          };
          return {
            [IndexedDbKeyPath]: item.address,
            ...item
          }
        })
        setERC1155Pool(erc1155Map);
        await saveToIndexedDB(IndexedDbStore.ERC1155Pool, erc1155)
        localStorage.setItem(IndexedDbStore.ERC1155Pool, '1')
        console.log(`ERC1155 tokens is updated, count: ${erc1155.length}`)
      } catch (e) {
        console.error('Cannot update ERC1155 tokens', (e as Error).message)
      } finally {
        clearTimeout(tId);
        tId = window.setTimeout(getRates, 10 * 60 * 1e3);
      }
    };

    tId = window.setTimeout(
      () => {
        getRates();
      },
      window.localStorage.getItem(IndexedDbStore.ERC1155Pool) ? 2200 : 0
    );

    return () => {
      clearTimeout(tId);
    };
  }, []);

  return null;
}
