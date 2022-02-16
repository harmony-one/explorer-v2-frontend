import { BasePage, TPaginationAction } from "src/components/ui";

import React, { useEffect, useState } from "react";
import { Box, Heading, Spinner, Text, TextInput } from "grommet";
import { Filter } from "src/types";
import { Erc20, useERC20Pool } from "src/hooks/ERC20_Pool";
import { useThemeMode } from "src/hooks/themeSwitcherHook";
import { ERC20Table } from "./ERC20Table";
import { Search } from "grommet-icons";

export const ERC20List = () => {
  const limitValue = localStorage.getItem("tableLimitValue");

  const initFilter: Filter = {
    offset: 0,
    limit: limitValue ? +limitValue : 10,
    orderBy: "block_number",
    orderDirection: "desc",
    filters: [{ type: "gte", property: "block_number", value: 0 }],
  };

  const [data, setData] = useState<Erc20[]>([]);
  const [filter, setFilter] = useState<Filter>(initFilter);
  const [search, setSearch] = useState<string>("");
  const erc20 = useERC20Pool();
  const themeMode = useThemeMode();
  const erc20Tokens = Object.values(erc20);
  const searchableFields = ["name", "symbol", "address"] as Array<keyof Erc20>

  const searchedTokenLength = erc20Tokens.filter(
    filterWithFields(searchableFields, search)
  ).length;

  useEffect(() => {
    setData(
      erc20Tokens
        .filter(filterWithFields(searchableFields, search))
        .sort(sortWithHolders)
        //@ts-ignore
        .slice(filter.offset, filter.offset + filter.limit)
    );
  }, [erc20, filter, search]);

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
      (filter.offset + filter.limit < !!search
        ? searchedTokenLength
        : erc20Tokens.length)
    ) {
      newFilter.offset = Math.min(
        //@ts-ignore
        erc20Tokens.length,
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
        HRC20 Tokens
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
        {!erc20Tokens.length && !search && (
          <Box height="40vh" justify="center" align="center">
            <Spinner />
          </Box>
        )}
        {!erc20Tokens.length && search && (
          <Box justify="center">
            <Text>No tokens for this search</Text>
          </Box>
        )}
        {!!erc20Tokens.length && (
          <ERC20Table
            data={data}
            limit={limit}
            filter={filter}
            setFilter={onChangeFilter}
            totalElements={!!search ? searchedTokenLength : erc20Tokens.length}
            minWidth="620px"
          />
        )}
      </BasePage>
    </>
  );
};

function filterWithFields(fields: Array<keyof Erc20>, search: string) {
  return (erc20: Erc20) => {
    return fields.some((field) =>
      (erc20 as any)[field]
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  };
}

function sortWithHolders(a: Erc20, b: Erc20) {
  return +b.holders - +a.holders;
}
