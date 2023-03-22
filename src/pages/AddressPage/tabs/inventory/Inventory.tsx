import React, { useState } from "react";
import {Box, TextInput, Text} from "grommet";
import { useThemeMode } from "../../../../hooks/themeSwitcherHook";
import { IUserERC721Assets } from "src/api/client.interface";
import { InventoryItem } from "./InventoryItem";
import { Pagination } from "src/components/pagination/Pagination";
import {Search} from "grommet-icons";
import {useDebounce} from "../../../../hooks/debounce";

export interface IInventoryProps {
  inventory: IUserERC721Assets[];
}

const pageSize = 24;

export function Inventory(props: IInventoryProps) {
  const { inventory } = props;

  const themeMode = useThemeMode();
  const [page, setPage] = useState<number>(0);
  const [filteredInventory, setFilteredInventory] = useState([...inventory])

  const maxPage = Math.ceil(filteredInventory.length / pageSize);
  const renderedInventory = filteredInventory.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  const onSearch = (event: { target: { value: any; }; }) => {
    const value = event.target.value.toLowerCase()

    if(value) {
      const values = inventory.filter(item => {
        const { ownerAddress = '', tokenID, meta } = item
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

  const onSearchDebounce = useDebounce(onSearch, 300)

  return (
    <Box style={{ padding: "10px" }}>
      <Box direction={'row'} justify={'between'} margin={{ top: '8px' }}>
        <Box width={'450px'}>
          <TextInput
            icon={<Search color="minorText" size={'14px'} />}
            placeholder="Search by Token ID / Owner / Name"
            style={{
              backgroundColor: themeMode === "light" ? "white" : "transparent",
              fontWeight: 500,
              borderRadius: '8px'
            }}
            onChange={onSearchDebounce}
          />
        </Box>
        <Box direction={'row'} align={'center'}>
          <Pagination
            disablePrev={page === 0}
            disableNext={page === maxPage - 1 || maxPage === 0}
            onClickPrev={() => setPage(page - 1)}
            onClickNext={() => {
              setPage(page + 1);
            }}
          />
        </Box>
      </Box>
      <Box direction={"row"} wrap={true} justify={'start'} margin={{ top: '24px' }} style={{ minHeight: '240px' }}>
        {renderedInventory.map((item) => {
          return <InventoryItem key={item.tokenID} item={item} />;
        })}
        {renderedInventory.length === 0 &&
            <Box justify={'center'} width={'100%'} align={'center'}>
                <Text>No inventory found</Text>
            </Box>
        }
      </Box>
    </Box>
  );
}
