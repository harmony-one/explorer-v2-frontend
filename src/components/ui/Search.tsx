import React, { useCallback, useState, useEffect } from "react";
import { Search } from "grommet-icons";
import { Box, TextInput, Text } from "grommet";
import { useHistory } from "react-router-dom";
import {
  getBlockByHash,
  getStakingTransactionByField,
  getTransactionByField,
} from "src/api/client";
import { useThemeMode } from "../../hooks/themeSwitcherHook";
import { getAddress } from "src/utils";
import { useERC20Pool } from "src/hooks/ERC20_Pool";
import { useERC721Pool } from "src/hooks/ERC721_Pool";
import { useERC1155Pool } from "src/hooks/ERC1155_Pool";

import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Address } from "./Address";
import { config } from "../../config";
import {getAddressByName} from "../../utils/oneCountry";
import {toaster} from "../../App";

let timeoutID: any | null = null;

export interface ISearchItem {
  symbol: string;
  name: string;
  type: "erc1155" | "erc20" | "erc721";
  item: any;
}

const oneCountryPostfix = {
  dotOne: '.1',
  dotCountry: '.country'
}

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const [readySubmit, setReadySubmit] = useState(false);
  const [focus, setFocus] = useState(false);
  const [results, setResults] = useState<ISearchItem[]>([]);
  const themeMode = useThemeMode();

  const erc20Map = useERC20Pool();
  const erc721Map = useERC721Pool();
  const erc1155Map = useERC1155Pool();

  const dataTest: ISearchItem[] = [
    ...Object.keys(erc1155Map).map((address) => ({
      symbol: erc1155Map[address].symbol,
      name: erc1155Map[address].name,
      type: "erc1155" as "erc1155",
      item: erc1155Map[address],
    })),
    ...Object.keys(erc20Map).map((address) => ({
      symbol: erc20Map[address].symbol,
      name: erc20Map[address].name,
      type: "erc20" as "erc20",
      item: erc20Map[address],
    })),
    ...Object.keys(erc721Map).map((address) => ({
      symbol: erc721Map[address].symbol,
      name: erc721Map[address].name,
      type: "erc721" as "erc721",
      item: erc721Map[address],
    })),
  ];

  const { availableShards } = config

  const history = useHistory();
  const onChange = useCallback((event) => {
    const { value: newValue } = event.target;

    setValue(newValue);
  }, []);

  useEffect(() => {
    setResults(
      dataTest.filter((item) => {
        if (
          item.name.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
          item.symbol.toLowerCase().indexOf(value.toLowerCase()) >= 0
        ) {
          return true;
        }
      })
    );
  }, [value]);

  useEffect(() => {
    const exec = async () => {
      // todo separate validation
      const v = value.split(" ").join("").toLowerCase();

      setReadySubmit(false);
      if ("" + +v === v && +v > 0) {
        // is block number
        history.push(`/block/${v}`);
        setValue("");
        return;
      }

      if(config.oneCountryContractAddress) {
        const onePostfix = v.endsWith(oneCountryPostfix.dotOne)
        const countryPostfix = v.endsWith(oneCountryPostfix.dotCountry)
        if(onePostfix || countryPostfix) {
          const [prefix] = v.split(onePostfix ? oneCountryPostfix.dotOne : oneCountryPostfix.dotCountry);
          if(prefix) {
            try {
              const address = await getAddressByName(prefix);
              if(address) {
                history.push(`/address/${address}`);
              } else {
                toaster.show({
                  message: () => (
                    <Box direction={"row"} align={"center"} pad={"small"}>
                      <Text size={"small"}>Address for "{v}" not found</Text>
                    </Box>
                  ),
                  time: 5000
                })
              }
            } catch (e) {
              console.log('Cannot get one country address', e)
            }
          }
        }
      }

      if (v.length !== 66 && v.length !== 42) {
        return;
      }
      if (v.length === 42 && /^0x[a-f0-9]+$/.test(v)) {
        // address
        history.push(`/address/${v}`);
        setValue("");
        return;
      }

      if (v.length === 42 && v.slice(0, 4) === "one1") {
        // address
        const ethAddress = getAddress(v).basicHex;

        history.push(`/address/${ethAddress}`);
        setValue("");
        return;
      }

      if (v.length === 66 && v[0] === "0" && v[1] === "x") {
        // is block hash or tx hash
        try {
          try {
            await Promise.all([
              getBlockByHash([0, v])
                .then((res) => {
                  if (!res) {
                    return;
                  }
                  history.push(`/block/${v}`);
                  setValue("");
                })
                .catch(),
              getTransactionByField([0, "hash", v])
                .then((res) => {
                  if (!res) {
                    return;
                  }
                  history.push(`/tx/${v}`);
                  setValue("");
                })
                .catch(),
              getStakingTransactionByField([0, "hash", v]).then((res) => {
                if (!res) {
                  return;
                }

                history.push(`/staking-tx/${v}`);
                setValue("");
              }),
            ]);
          } catch {
            await Promise.all(
              availableShards
                .filter((t) => t !== 0)
                .map((shard) => {
                  return Promise.all([
                    getBlockByHash([shard, v]).then((res) => {
                      if (!res) {
                        return;
                      }
                      history.push(`/block/${v}`);
                      setValue("");
                    }),
                    getTransactionByField([shard, "hash", v]).then((res) => {
                      if (!res) {
                        return;
                      }
                      history.push(`/tx/${v}`);
                      setValue("");
                    }),
                    getStakingTransactionByField([shard, "hash", v]).then(
                      (res) => {
                        if (!res) {
                          return;
                        }

                        history.push(`/staking-tx/${v}`);
                        setValue("");
                      }
                    ),
                  ]);
                })
            );
          }

          return;
        } catch (e) {}
      }
    };

    if(readySubmit) {
      exec();
    }
  }, [readySubmit]);

  const Row = (options: { index: number; style: any }) => {
    const { index, style } = options;
    return (
      <div style={style}>
        <Box
          key={`${results[index].item.address}_${results[index].type}`}
          direction={"row"}
          pad={"xsmall"}
          style={{
            cursor: "pointer",
            minHeight: "40px",
            borderStyle: "solid",
            borderBottomWidth: "1px",
            borderTopWidth: "0px",
            borderLeftWidth: "0px",
            borderRightWidth: "0px",
            paddingLeft: "10px",
          }}
          align={"center"}
          border={{
            color: "backgroundBack",
            size: "xsmall",
          }}
          onClick={() => {
            history.push(`/address/${results[index].item.address}`);
            setValue("");
          }}
        >
          <Box
            pad={"xxsmall"}
            background={"backgroundSuccess"}
            style={{
              borderRadius: "6px",
              marginRight: "10px",
              paddingLeft: "6px",
              paddingRight: "6px",
            }}
          >
            <Text size={"xsmall"}>{`H${results[index].type
              .slice(1)
              .toUpperCase()}`}</Text>
          </Box>
          <Text size={"small"} style={{ paddingRight: "5px" }}>
            {results[index].name} |
          </Text>
          <Text size={"small"} style={{ paddingRight: "5px" }}>
            {results[index].symbol} |
          </Text>
          <Address
            address={results[index].item.address}
            noHistoryPush
            displayHash
          />
        </Box>
      </div>
    );
  };

  return (
    <Box
      width="100%"
      pad={{ vertical: "medium" }}
      style={{ position: "relative" }}
    >
      <TextInput
        value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => {
          setTimeout(() => {
            setFocus(false);
          }, 100);
        }}
        onPaste={(evt) => {
          clearTimeout(timeoutID);
          timeoutID = setTimeout(() => setReadySubmit(true), 200);
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            clearTimeout(timeoutID);
            timeoutID = setTimeout(() => setReadySubmit(true), 200);
          }
        }}
        color="red"
        icon={<Search color="brand" />}
        style={{
          backgroundColor: themeMode === "light" ? "white" : "transparent",
          fontWeight: 500,
        }}
        placeholder="Search by Address / Transaction Hash / Block / Token"
      />
      {focus && results.length && value ? (
        <Box
          style={{
            borderRadius: "6px",
            position: "absolute",
            marginTop: "43px",
            width: "100%",
            zIndex: 9,
            maxHeight: "350px",
            minHeight: "350px",
            overflowY: "auto",
            overflowX: "hidden",
            boxShadow:
              themeMode === "light"
                ? "0 0 10px 1px rgba(0,0,0,0.05)"
                : "0 0 10px 1px rgba(255,255,255,0.09)",
          }}
          background={"background"}
        >
          <Box height={"40px"} pad={"small"}>
            <Text size={"small"}>
              <b>{results.length}</b> found
            </Text>
          </Box>
          <AutoSizer>
            {({ height, width }) => (
              <List
                className="List"
                height={height}
                itemCount={results.length}
                itemSize={40}
                width={width}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        </Box>
      ) : null}
    </Box>
  );
};
