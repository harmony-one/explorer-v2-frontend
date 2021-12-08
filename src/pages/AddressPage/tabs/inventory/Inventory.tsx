import React, { useState } from "react";
import { Box, Spinner, Text } from "grommet";

import { IUserERC721Assets } from "src/api/client.interface";
import { InventoryItem } from "./InventoryItem";
import { Pagination } from "src/components/pagination/Pagination";
import styled from 'styled-components';
export interface IInventoryProps {
  inventory: IUserERC721Assets[] | null;
  emptyText?: string
}

const LoaderBox = styled(Box)`
  height: 700px;
`;

const EmptyBox = styled(Box)`
  height: 700px;
`;

export function Inventory(props: IInventoryProps) {
  const [page, setPage] = useState<number>(0);
  const { inventory, emptyText = 'No data to display' } = props;

  if (!inventory) {
    return (
      <LoaderBox justify="center" align="center">
        <Spinner size="large" />
      </LoaderBox>
    );
  }

  if (!inventory.length) {
    <EmptyBox justify="center" align="center">
      <Text size="small">{emptyText}</Text>
    </EmptyBox>
  }

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
