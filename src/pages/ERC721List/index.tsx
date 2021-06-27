import { BasePage, TPaginationAction } from "src/components/ui";

import React, { useEffect, useState } from "react";
import { Box, Heading, Spinner, Text, TextInput } from "grommet";
import { Filter } from "src/types";
import { ERC721, useERC721Pool } from "src/hooks/ERC721_Pool";
import { useThemeMode } from "src/hooks/themeSwitcherHook";
import { ERC721Table } from "./ERC721Table";
import { Search } from "grommet-icons";

const initFilter: Filter = {
  offset: 0,
  limit: 10,
  orderBy: "block_number",
  orderDirection: "desc",
  filters: [{ type: "gte", property: "block_number", value: 0 }],
};

export const ERC721List = () => {
  const [data, setData] = useState<ERC721[]>([]);
  const [filter, setFilter] = useState<Filter>(initFilter);
  const [search, setSearch] = useState<string>("");
  const erc721 = useERC721Pool();
  const themeMode = useThemeMode();
  const erc721Tokens = Object.values(erc721);

  const searchedTokenLength = erc721Tokens.filter(
    filterWithFields(["name", "symbol"], search)
  ).length;

  useEffect(() => {
    setData(
      erc721Tokens
        .filter(filterWithFields(["name", "symbol"], search))
        .sort(sortWithHolders)
        //@ts-ignore
        .slice(filter.offset, filter.offset + filter.limit)
    );
  }, [erc721, filter, search]);

  useEffect(() => {
    setFilter({ ...filter, offset: 0 });
  }, [search]);

  const onChangeFilter = (newFilter: Filter, action?: TPaginationAction) => {
    //@ts-ignore
    if (action === "prevPage" && filter.offset > 0) {
      //@ts-ignore
      newFilter.offset = Math.max(0, filter.offset - filter.limit);
    }

    if (
      action === "nextPage" &&
      //@ts-ignore
      filter.offset + filter.limit <
        (!!search ? searchedTokenLength : erc721Tokens.length)
    ) {
      newFilter.offset = Math.min(
        //@ts-ignore
        erc721Tokens.length,
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
        HRC721 Tokens
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
            placeholder="Search by Name / Symbol"
          />
        </Box>
        {!erc721Tokens.length && !search && (
          <Box height="40vh" justify="center" align="center">
            <Spinner />
          </Box>
        )}
        {!erc721Tokens.length && search && (
          <Box justify="center">
            <Text>No tokens for this search</Text>
          </Box>
        )}
        {!!erc721Tokens.length && (
          <ERC721Table
            data={data}
            limit={limit}
            filter={filter}
            setFilter={onChangeFilter}
            totalElements={!!search ? searchedTokenLength : erc721Tokens.length}
            minWidth="620px"
          />
        )}
      </BasePage>
    </>
  );
};

function filterWithFields(fields: Array<keyof ERC721>, search: string) {
  return (erc721: ERC721) => {
    return fields.some((field) =>
      erc721[field].toString().toLowerCase().includes(search.toLowerCase())
    );
  };
}

function sortWithHolders(a: ERC721, b: ERC721) {
  return +b.holders - +a.holders;
}
