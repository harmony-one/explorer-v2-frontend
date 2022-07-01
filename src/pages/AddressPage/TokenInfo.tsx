import React, { useEffect, useState } from "react";
import { Box, Text, Tip } from "grommet";
import {
  Address,
  formatNumber,
  TipContent,
  TokenValue,
} from "src/components/ui";
import { Dropdown } from "src/components/dropdown/Dropdown";
import { BinancePairs } from "src/hooks/BinancePairHistoricalPrice";
import Big from "big.js";
import { useERC20Pool } from "src/hooks/ERC20_Pool";
import { useERC721Pool } from "src/hooks/ERC721_Pool";
import { TokenValueBalanced } from "src/components/ui/TokenValueBalanced";
import { useThemeMode } from "src/hooks/themeSwitcherHook";
import { useCurrency } from "src/hooks/ONE-ETH-SwitcherHook";
import { getAddress } from "src/utils/getAddress/GetAddress";
import { useHistory } from "react-router-dom";
import { useERC1155Pool } from "../../hooks/ERC1155_Pool";
import { Alert } from "grommet-icons";
import { getERC20Balance } from "../../web3/erc20Methods";

interface Token {
  balance: string;
  tokenAddress: string;
  ownerAddress: string;
  isERC20?: boolean;
  isERC721?: boolean;
  isERC1155?: boolean;
  symbol: string;
  tokenID?: string;
}

export function TokensInfo(props: { value: Token[] }) {
  const erc20Map = useERC20Pool();
  const erc721Map = useERC721Pool();
  const erc1155Map = useERC1155Pool();
  const themeMode = useThemeMode();
  const currency = useCurrency();
  const history = useHistory();

  const [tokensList, setTokensList] = useState(props.value)
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [isNodeBalancesLoaded, setNodeBalancesLoaded] = useState(false)

  // Tokens list was updated from parent component
  useEffect(() => {
    setTokensList(props.value)
    setNodeBalancesLoaded(false)
  }, [props.value])

  useEffect(() => {
    const loadErc20BalancesFromNode = async () => {
      try {
        const balances = await Promise.all(tokensList.map(async token => {
          const balance = await getERC20Balance(token.ownerAddress, token.tokenAddress)
          return {
            ...token,
            balance
          }
        }))
        setTokensList(balances)
        setNodeBalancesLoaded(true)
        console.log('ERC20 node balances updated')
      } catch (e) {
        console.error('Cannot update node balances', (e as Error).message)
      }
    }
    if (isDropdownVisible && !isNodeBalancesLoaded) {
      loadErc20BalancesFromNode()
    }
  }, [isDropdownVisible])

  if (!tokensList.filter((i) => filterWithBalance(i.balance)).length) {
    return <span>—</span>;
  }

  const erc20Tokens = tokensList
    .filter((i) => filterWithBalance(i.balance))
    .filter((i) => i.isERC20 && erc20Map[i.tokenAddress])
    .map((item) => ({
      ...item,
      symbol: erc20Map[item.tokenAddress].symbol,
      name: erc20Map[item.tokenAddress].name,
    }))
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  const erc721Tokens = tokensList
    .filter((i) => filterWithBalance(i.balance))
    .filter((i) => i.isERC721 && erc721Map[i.tokenAddress])
    .map((item) => ({
      ...item,
      symbol: erc721Map[item.tokenAddress].symbol,
      name: erc721Map[item.tokenAddress].name,
    }));

  const erc1155Tokens = tokensList
    .filter((i) => filterWithBalance(i.balance))
    .filter((i) => i.isERC1155 && erc1155Map[i.tokenAddress])
    .map((item) => ({
      ...item,
      symbol: erc1155Map[item.tokenAddress].symbol,
      name: erc1155Map[item.tokenAddress].name,
    }));

  const data = [...erc20Tokens, ...erc721Tokens, ...erc1155Tokens];

  return (
    <Box>
      <Box style={{ width: "550px" }}>
        <Dropdown<Token>
          keyField={"tokenID"}
          itemHeight={"55px"}
          itemStyles={{ padding: "5px", marginBottom: "10px" }}
          searchable={(item, searchText) => {
            const outPutAddress =
              currency === "ONE"
                ? getAddress(item.tokenAddress).bech32
                : item.tokenAddress;

            searchText = searchText.toLowerCase();

            if (item.tokenAddress.toLowerCase().includes(searchText)) {
              return true;
            }

            if (outPutAddress.toLowerCase().includes(searchText)) {
              return true;
            }

            if (item.symbol.toLowerCase().includes(searchText)) {
              return true;
            }

            return false;
          }}
          themeMode={themeMode}
          items={data}
          onClickItem={(item) => {
            history.push(`/address/${item.tokenAddress}`);
          }}
          renderItem={(item) => {
            const symbol =
              erc20Map[item.tokenAddress]?.symbol ||
              erc721Map[item.tokenAddress]?.symbol ||
              erc1155Map[item.tokenAddress]?.symbol;

            return (
              <Box
                direction="column"
                style={{
                  width: "100%",
                  flex: "0 0 auto",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  padding: "5px",
                }}
              >
                <Box direction={"row"}>
                  <Box style={{ flex: "1 1 50%" }} direction={"row"}>
                    <Address
                      address={item.tokenAddress}
                      style={{ flex: "1 1 50%" }}
                    />
                    <Text
                      size={"small"}
                      color={"minorText"}
                      style={{ marginLeft: "5px" }}
                    >
                      ({symbol})
                    </Text>
                  </Box>
                  <TokenValueBalanced
                    value={item.balance}
                    tokenAddress={item.tokenAddress}
                    style={{ flex: "1 1 50%", wordBreak: "break-word" }}
                  />
                  {item.isERC1155 && (item as any).needUpdate ? (
                    <Tip
                      dropProps={{ align: { left: "right" } }}
                      content={<TipContent message={"Outdated"} />}
                    >
                      <span>
                        <Alert size="small" />
                      </span>
                    </Tip>
                  ) : null}
                </Box>
                {item.isERC1155 ? (
                  <Text size={"small"} color={"minorText"}>
                    Token ID: {item.tokenID}{" "}
                  </Text>
                ) : null}
              </Box>
            );
          }}
          renderValue={() => (
            <Box direction={"row"} style={{ paddingTop: "3px" }}>
              {erc20Tokens.length ? (
                <Box style={{ marginRight: "10px" }} direction={"row"}>
                  HRC20{" "}
                  <Box
                    background={"backgroundBack"}
                    style={{
                      minWidth: "20px",
                      height: "20px",
                      marginLeft: "5px",
                      textAlign: "center",
                      borderRadius: "4px",
                    }}
                  >
                    {erc20Tokens.length}
                  </Box>
                </Box>
              ) : null}
              {erc721Tokens.length ? (
                <Box direction={"row"}>
                  HRC721{" "}
                  <Box
                    background={"backgroundBack"}
                    style={{
                      minWidth: "20px",
                      height: "20px",
                      marginLeft: "5px",
                      textAlign: "center",
                      borderRadius: "4px",
                    }}
                  >
                    {erc721Tokens.length}
                  </Box>
                </Box>
              ) : null}
              {erc1155Tokens.length ? (
                <Box direction={"row"}>
                  HRC1155{" "}
                  <Box
                    background={"backgroundBack"}
                    style={{
                      minWidth: "20px",
                      height: "20px",
                      marginLeft: "5px",
                      textAlign: "center",
                      borderRadius: "4px",
                    }}
                  >
                    {erc1155Tokens.length}
                  </Box>
                </Box>
              ) : null}
            </Box>
          )}
          group={[
            {
              groupBy: "isERC20",
              renderGroupItem: () => (
                <Box
                  style={{
                    minHeight: "35px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    marginTop: "10px",
                  }}
                  pad={"xsmall"}
                  background={"backgroundBack"}
                >
                  <Text>HRC20 tokens</Text>
                </Box>
              ),
            },
            {
              groupBy: "isERC721",
              renderGroupItem: () => (
                <Box
                  style={{
                    minHeight: "35px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    marginTop: "10px",
                  }}
                  pad={"xsmall"}
                  background={"backgroundBack"}
                >
                  <Text>HRC721 tokens</Text>
                </Box>
              ),
            },
            {
              groupBy: "isERC1155",
              renderGroupItem: () => (
                <Box
                  style={{
                    minHeight: "35px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    marginTop: "10px",
                  }}
                  pad={"xsmall"}
                  background={"backgroundBack"}
                >
                  <Text>HRC1155 tokens</Text>
                </Box>
              ),
            },
          ]}
          onToggle={(isVisible: boolean) => setDropdownVisible(isVisible)}
        />
      </Box>
    </Box>
  );
}

function TokenInfo(props: { value: Token }) {
  const { value } = props;

  return (
    <Box
      direction="row"
      style={{ minWidth: "500px", maxWidth: "550px", flex: "0 0 auto" }}
      margin={{ bottom: "3px" }}
      gap="medium"
    >
      <Address address={value.tokenAddress} style={{ flex: "1 1 50%" }} />
      <TokenValue
        value={value.balance}
        tokenAddress={value.tokenAddress}
        style={{ flex: "1 1 50%", wordBreak: "break-word" }}
      />
    </Box>
  );
}

function filterWithBalance(balance: string) {
  return !!+balance;
}
