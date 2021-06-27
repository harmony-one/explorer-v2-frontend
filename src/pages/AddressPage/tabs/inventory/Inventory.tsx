import React, { useState } from "react";
import { Box } from "grommet";

import { IUserERC721Assets } from "src/api/client.interface";
import { InventoryItem } from "./InventoryItem";
import { Pagination } from "src/components/pagination/Pagination";

export interface IInventoryProps {
  inventory: IUserERC721Assets[];
}

export function Inventory(props: IInventoryProps) {
  const [page, setPage] = useState<number>(0);

  const { inventory } = props;
  const pageSize = 10;
  const maxPage = Math.ceil(inventory.length / pageSize);
  const renderedInventory = inventory.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  return (
    <Box style={{ padding: "10px" }}>
      <Box direction={'row'} justify={'end'}>
        <Pagination
          disablePrev={page === 0}
          disableNext={page === maxPage - 1}
          onClickPrev={() => setPage(page - 1)}
          onClickNext={() => {
            setPage(page + 1);
          }}
        />
      </Box>
      <Box direction={"row"} wrap={true} justify={'center'}>
        {renderedInventory.map((item) => {
          return <InventoryItem key={item.tokenID} item={item} />;
        })}
      </Box>
    </Box>
  );
}
