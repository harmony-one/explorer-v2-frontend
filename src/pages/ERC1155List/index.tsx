import { BasePage, TPaginationAction } from "src/components/ui";

import React, { useEffect, useState } from "react";
import { Box, Heading, Spinner, Text, TextInput } from "grommet";
import { Filter } from "src/types";
import { useThemeMode } from "src/hooks/themeSwitcherHook";
import { ERC1155Table } from "./ERC1155Table";
import { Search } from "grommet-icons";
import { useERC1155Pool, ERC1155 } from "src/hooks/ERC1155_Pool";

export const ERC1155List = () => {
  const limitValue = localStorage.getItem("tableLimitValue");

  const initFilter: Filter = {
    offset: 0,
    limit: limitValue ? +limitValue : 10,
    orderBy: "block_number",
    orderDirection: "desc",
    filters: [{ type: "gte", property: "block_number", value: 0 }],
  };

  const [data, setData] = useState<ERC1155[]>([]);
  const [filter, setFilter] = useState<Filter>(initFilter);
  const [search, setSearch] = useState<string>("");
  const erc1155 = useERC1155Pool();
  const themeMode = useThemeMode();
  const erc1155Tokens = Object.values(erc1155);
  const searchableFields = ["name", "symbol", "address"] as Array<keyof ERC1155>

  const searchedTokenLength = erc1155Tokens.filter(
    filterWithFields(searchableFields, search)
  ).length;

  useEffect(() => {
    setData(
      erc1155Tokens
        .filter(filterWithFields(searchableFields, search))
        .sort(sortWithHolders)
        //@ts-ignore
        .slice(filter.offset, filter.offset + filter.limit)
    );
  }, [erc1155, filter, search]);

  useEffect(() => {
    setFilter({ ...filter, offset: 0 });
  }, [search]);

  const onChangeFilter = (newFilter: Filter, action?: TPaginationAction) => {
    //@ts-ignore
    if (action === "prevPage" && filter.offset > 0) {
      //@ts-ignore
      newFilter.offset = Math.max(0, filter.offset - filter.limit);
    }

    if (newFilter.limit !== initFilter.limit) {
      localStorage.setItem("tableLimitValue", `${newFilter.limit}`);
    }

    if (
      action === "nextPage" &&
      //@ts-ignore
      filter.offset + filter.limit <
        (!!search ? searchedTokenLength : erc1155Tokens.length)
    ) {
      newFilter.offset = Math.min(
        //@ts-ignore
        erc1155Tokens.length,
        //@ts-ignore
        filter.offset + filter.limit
      );
    }

    setFilter(newFilter);
  };

  const { limit = 10 } = filter;

  return (
    <>
      <Heading size="xsmall" margin={{ top: "0" }}>
        HRC1155 Tokens
      </Heading>
      <BasePage>
        <Box width="100%" pad={{ bottom: "medium" }}>
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            color="red"
            icon={<Search color="brand" />}
            style={{
              backgroundColor: themeMode === "light" ? "white" : "transparent",
              fontWeight: 500,
            }}
            placeholder="Search by Name / Symbol / Address"
          />
        </Box>
        {!erc1155Tokens.length && !search && (
          <Box height="40vh" justify="center" align="center">
            <Spinner />
          </Box>
        )}
        {!erc1155Tokens.length && search && (
          <Box justify="center">
            <Text>No tokens for this search</Text>
          </Box>
        )}
        {!!erc1155Tokens.length && (
          <ERC1155Table
            data={data}
            limit={limit}
            filter={filter}
            setFilter={onChangeFilter}
            totalElements={
              !!search ? searchedTokenLength : erc1155Tokens.length
            }
            minWidth="620px"
          />
        )}
      </BasePage>
    </>
  );
};

function filterWithFields(fields: Array<keyof ERC1155>, search: string) {
  return (erc721: ERC1155) => {
    return fields.some((field) =>
      erc721[field].toString().toLowerCase().includes(search.toLowerCase())
    );
  };
}

function sortWithHolders(a: ERC1155, b: ERC1155) {
  return +b.holders - +a.holders;
}
