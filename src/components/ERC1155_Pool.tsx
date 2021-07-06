import React, { useEffect } from "react";
import { getAllERC1155 } from "src/api/client";
import { setERC1155Pool, ERC1155 } from "src/hooks/ERC1155_Pool";

export function ERC1155_Pool() {
  useEffect(() => {
    const getRates = async () => {
      const erc1155: ERC1155[] = await getAllERC1155();
      const erc1155Map = {} as Record<string, ERC1155>;
      erc1155.forEach((i: any) => {
        erc1155Map[i.address] = i;
      });

      window.localStorage.setItem("ERC1155_Pool", JSON.stringify(erc1155Map));
      setERC1155Pool(erc1155Map);
    };

    let tId = 0;

    setTimeout(() => {
      getRates();
      tId = window.setInterval(getRates, 10 * 60 * 1e3);
    }, 2200);

    return () => {
      clearTimeout(tId);
    };
  }, []);

  return null;
}
