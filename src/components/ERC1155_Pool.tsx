import React, { useEffect } from "react";
import { getAllERC1155 } from "src/api/client";
import { setERC1155Pool, ERC1155 } from "src/hooks/ERC1155_Pool";

export function ERC1155_Pool() {
  useEffect(() => {
    let tId = 0;

    const getRates = async () => {
      try {
        const erc1155: ERC1155[] = await getAllERC1155();
        const erc1155Map = {} as Record<string, ERC1155>;
        erc1155.forEach((i: any) => {
          erc1155Map[i.address] = i;
        });

        window.localStorage.setItem("ERC1155_Pool", JSON.stringify(erc1155Map));
        setERC1155Pool(erc1155Map);
      } finally {
        clearTimeout(tId);
        tId = window.setTimeout(getRates, 10 * 60 * 1e3);
      }
    };

    tId = window.setTimeout(
      () => {
        getRates();
      },
      window.localStorage.getItem("ERC1155_Pool") ? 2200 : 0
    );

    return () => {
      clearTimeout(tId);
    };
  }, []);

  return null;
}
