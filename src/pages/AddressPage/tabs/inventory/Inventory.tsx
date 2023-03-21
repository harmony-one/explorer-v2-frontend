import React, { useState } from "react";
import {Box, TextInput} from "grommet";
import { useThemeMode } from "../../../../hooks/themeSwitcherHook";
import { IUserERC721Assets } from "src/api/client.interface";
import { InventoryItem } from "./InventoryItem";
import { Pagination } from "src/components/pagination/Pagination";
import {Search} from "grommet-icons";
import {debounce} from "chart.js/helpers";

export interface IInventoryProps {
  inventory: IUserERC721Assets[];
}

export function Inventory(props: IInventoryProps) {
  const { inventory } = props;

  const themeMode = useThemeMode();
  const [page, setPage] = useState<number>(0);
  const [filteredInventory, setFilteredInventory] = useState([...inventory])

  const pageSize = 10;
  const maxPage = Math.ceil(filteredInventory.length / pageSize);
  const renderedInventory = filteredInventory.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  const onSearch = (event: { target: { value: any; }; }) => {
    const value = event.target.value.toLowerCase()

    if(value) {
      const values = inventory.filter(item => {
        const { ownerAddress, tokenID, meta } = item
        let name = meta && meta.name ? meta.name.toLowerCase() : ''

        return ownerAddress.toLowerCase().includes(value)
          || tokenID.toLowerCase().includes(value)
          || name.includes(value)
      })
      setFilteredInventory(values)
    } else {
      setFilteredInventory(inventory)
    }
  }

  return (
    <Box style={{ padding: "10px" }}>
      <Box direction={'row'} justify={'between'} margin={{ top: '8px' }}>
        <Box width={'450px'}>
          <TextInput
            icon={<Search color="minorText" size={'14px'} />}
            placeholder="Search by Token ID / Name / Owner"
            style={{
              backgroundColor: themeMode === "light" ? "white" : "transparent",
              fontWeight: 500,
              borderRadius: '8px'
            }}
            onChange={onSearch}
          />
        </Box>
        <Box direction={'row'}>
          <Pagination
            disablePrev={page === 0}
            disableNext={page === maxPage - 1}
            onClickPrev={() => setPage(page - 1)}
            onClickNext={() => {
              setPage(page + 1);
            }}
          />
        </Box>
      </Box>
      <Box direction={"row"} wrap={true} justify={'start'} margin={{ top: '4px' }}>
        {renderedInventory.map((item) => {
          return <InventoryItem key={item.tokenID} item={item} />;
        })}
      </Box>
    </Box>
  );
}
