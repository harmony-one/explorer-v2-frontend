import { Heading } from "grommet";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTokenERC1155Assets, getTokenERC721Assets } from "src/api/client";
import { IUserERC721Assets } from "src/api/client.interface";
import { BasePage } from "src/components/ui";
import { useERC1155Pool } from "src/hooks/ERC1155_Pool";
import { useERC721Pool } from "src/hooks/ERC721_Pool";

export function InventoryDetailsPage() {
  const erc721Map = useERC721Pool();
  const erc1155Map = useERC1155Pool();
  const [inventory, setInventory] = useState<IUserERC721Assets>({} as any);

  //  @ts-ignore
  const { address, tokenID, type } = useParams();

  const item = erc721Map[address] || erc1155Map[address] || {};
  const name = item.name || "";

  useEffect(() => {
    const getInventory = async () => {
      try {
        if (type === "erc721" || type === "erc1155") {
          let inventory =
            type === "erc721"
              ? await getTokenERC721Assets([address])
              : await getTokenERC1155Assets([address]);

          setInventory(inventory.filter((item) => item.tokenID === tokenID)[0]);
        } else {
          setInventory({} as any);
        }
      } catch (err) {
        setInventory({} as any);
      }
    };
    getInventory();
  }, [address]);

  let meta = "";
  try {
    meta = JSON.stringify(inventory.meta, null, 4);
  } catch {
    meta = "";
  }

  return (
    <>
      <Heading size="xsmall" margin={{ top: "0" }}>
        {name} {tokenID} {inventory.meta?.name || ""}
      </Heading>
      <BasePage>
        <pre>{meta}</pre>
      </BasePage>
    </>
  );
}
