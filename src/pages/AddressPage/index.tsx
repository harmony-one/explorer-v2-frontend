import React, { useEffect, useState } from "react";
import { Text, Tabs, Tab, Box } from "grommet";
import { BasePage, BaseContainer } from "src/components/ui";
import { AddressDetailsDisplay, getType } from "./AddressDetails";
import {
  getContractsByField,
  getUserERC20Balances,
  getUserERC721Assets,
  getTokenERC721Assets,
  getTokenERC1155Assets,
  getUserERC1155Balances,
  getERC20TokenHolders,
  getTokenERC1155Balances,
} from "src/api/client";
import { useHistory, useParams } from "react-router-dom";
import { useERC20Pool } from "src/hooks/ERC20_Pool";
import { useERC721Pool } from "src/hooks/ERC721_Pool";
import { useERC1155Pool } from "src/hooks/ERC1155_Pool";
import { Transactions } from "./tabs/Transactions";
import {
  IUserERC721Assets,
  TRelatedTransaction,
} from "src/api/client.interface";
import { Inventory } from "./tabs/inventory/Inventory";
import { getAllBalance, getBalance } from "src/api/rpc";
import { ISourceCode, loadSourceCode } from "../../api/explorerV1";
import { AddressDetails, RPCTransactionHarmony } from "../../types";
import { ContractDetails } from "./ContractDetails";
import { ERC1155Icon } from "src/components/ui/ERC1155Icon";
import { getAddress } from "src/utils";
import { useCurrency } from "src/hooks/ONE-ETH-SwitcherHook";
import { HoldersTab } from "./tabs/holders/HoldersTab";
import { parseHexToText } from "../../web3/parseHex";
import { EventsTab } from "./tabs/events/Events";
import { ToolsTab } from "./tabs/tools";

export function AddressPage() {
  const history = useHistory();
  const tabParamName = "activeTab=";
  const oldTabParamName = "txType=";
  let activeTab = 0;

  try {
    const newValue = +history.location.search.slice(
      history.location.search.indexOf("activeTab=") + tabParamName.length
    );

    const oldTxType = history.location.search.slice(
      history.location.search.indexOf(oldTabParamName) + oldTabParamName.length
    );

    activeTab = isNaN(newValue) ? 0 : newValue;

    switch (oldTxType) {
      case "regular": {
        activeTab = 0;
        break;
      }

      case "staking": {
        activeTab = 1;
        break;
      }

      case "hrc20": {
        activeTab = 3;
        break;
      }

      case "hrc721": {
        activeTab = 4;

        break;
      }

      case "hrc721Assets": {
        activeTab = 5;
        break;
      }

      default: {
      }
    }

    if (activeTab === 0 && history.location.hash === "#code") {
      activeTab = 7; // note how do i derive this active tab? its a bit hard coded atm
    }
  } catch {
    activeTab = 0;
  }

  const [contracts, setContracts] = useState<AddressDetails | null>(null);
  const [sourceCode, setSourceCode] = useState<ISourceCode | null>(null);
  const [balance, setBalance] = useState<any>([]);
  const [addressDescription, setAddressDescription] = useState('')

  const [tokens, setTokens] = useState<any>(null);
  const [inventory, setInventory] = useState<IUserERC721Assets[]>([]);
  const [inventoryHolders, setInventoryForHolders] = useState<
    IUserERC721Assets[]
  >([]);
  const [activeIndex, setActiveIndex] = useState(+activeTab);
  const erc20Map = useERC20Pool();
  const erc721Map = useERC721Pool();
  const erc1155Map = useERC1155Pool();
  const currency = useCurrency();

  //TODO remove hardcode
  // @ts-ignore
  let { id } = useParams();
  id = `${id}`.toLowerCase();
  id = id.slice(0, 3) === "one" ? getAddress(id).basicHex : id;

  const erc20Token = erc20Map[id] || null;

  let type = erc721Map[id]
    ? "erc721"
    : erc1155Map[id]
      ? "erc1155"
      : getType(contracts, erc20Token);

  useEffect(() => {
    const getActiveIndex = () => {
      setActiveIndex(activeTab || 0);
    };
    getActiveIndex();
  }, [id]);

  useEffect(() => {
    const getBal = async () => {
      let bal: string[] = [];
      try {
        bal = await getAllBalance([id, "latest"]);
      } catch {
        bal = [];
      }

      setBalance(bal);
    };
    getBal();
  }, [id]);

  useEffect(() => {
    // contract defined and contract address same as id
    // note: when we toggle there is scenarios where the id are not the same
    // @ts-ignore
    if (!!contracts && contracts?.address === id) {
      loadSourceCode(id)
        .then((res) => setSourceCode(res))
        .catch((except) => {
          console.log(except);
          setSourceCode(null)
        });
    }
  }, [id, contracts]);

  useEffect(() => {
    const getContracts = async () => {
      try {
        let contracts: any = await getContractsByField([0, "address", id]);

        const mergedContracts: AddressDetails = erc721Map[contracts.address]
          ? { ...contracts, ...erc721Map[contracts.address] }
          : contracts;

        setContracts(mergedContracts);
      } catch (err) {
        setContracts(null);
      }
    };
    getContracts();
  }, [id]);

  useEffect(() => {
    const getInventory = async () => {
      try {
        if (type === "erc721" || type === "erc1155") {
          let inventory =
            type === "erc721"
              ? await getTokenERC721Assets([id])
              : await (
                await getTokenERC1155Assets([id])
              ).map((item) => {
                if (item.meta && item.meta.image) {
                  item.meta.image = `${process.env.REACT_APP_INDEXER_IPFS_GATEWAY}${item.meta.image}`;
                }
                return item;
              });

          let inventoryHolders1155 = [] as any[];

          if (type === "erc1155") {
            inventoryHolders1155 = await getTokenERC1155Balances([id]);
          }

          setInventoryForHolders(inventoryHolders1155);

          setInventory(
            inventory
              .filter((item) => item.meta)
              .map((item) => {
                item.type = type;
                return item;
              })
          );
        } else {
          setInventory([]);
        }
      } catch (err) {
        setInventory([]);
      }
    };
    getInventory();
  }, [id, erc721Map]);

  useEffect(() => {
    const getTokens = async () => {
      try {
        let erc721Tokens = await getUserERC721Assets([id]);
        let tokens = await getUserERC20Balances([id]);
        let erc1155tokens = await getUserERC1155Balances([id]);

        const erc721BalanceMap = erc721Tokens.reduce((prev, cur) => {
          if (prev[cur.tokenAddress]) {
            prev[cur.tokenAddress]++;
          } else {
            prev[cur.tokenAddress] = 1;
          }

          return prev;
        }, {} as { [token: string]: number });

        setTokens([
          ...tokens.map((token) => ({ ...token, isERC20: true })),
          ...erc721Tokens.map((token) => ({
            ...token,
            balance: erc721BalanceMap[token.tokenAddress].toString(),
            isERC721: true,
          })),
          ...erc1155tokens.map((item) => ({
            ...item,
            balance: item.amount,
            isERC1155: true,
          })),
        ]);
      } catch (err) {
        setTokens(null);
      }
    };
    getTokens();
  }, [id]);

  const renderTitle = () => {
    const erc1155 = erc1155Map[id] || {};
    const { meta = {}, ...restErc1155 } = erc1155;
    const data = {
      ...contracts,
      ...erc20Token,
      address: id,
      token: tokens,
      ...meta,
    };

    if (type === "erc20") {
      return `HRC20 ${data.name}`;
    }

    if (type === "erc721") {
      return `ERC721 ${data.name}`;
    }

    if (type === "erc1155") {
      const title = `HRC1155 ${data.name || ""}`;
      return meta.image ? (
        <Box direction={"row"} align={"center"}>
          <ERC1155Icon imageUrl={meta.image} />
          &nbsp;
          {title}
        </Box>
      ) : (
        title
      );
    }

    if (type === "contract") {
      return "Contract";
    }

    return "Address";
  };

  const tabs: TRelatedTransaction[] = [
    "transaction",
    "staking_transaction",
    "internal_transaction",
    "erc20",
    "erc721",
    "erc1155",
  ];

  const txsCommonProps = {
    onTxsLoaded: (txs: RPCTransactionHarmony[]) => {
      let description = ''
      if (activeIndex === 0) {
        const inputWithText = txs.find(tx => parseHexToText(tx.input))
        if (inputWithText) {
          description = 'One or more inbound transactions contains a message'
        }
      }
      setAddressDescription(description)
    }
  }

  return (
    <BaseContainer pad={{ horizontal: "0" }}>
      <Text size="xlarge" weight="bold" margin={{ bottom: "medium" }}>
        {renderTitle()}
      </Text>
      <BasePage margin={{ vertical: "0" }} style={{ overflow: "inherit" }}>
        <AddressDetailsDisplay
          address={id}
          addressDescription={addressDescription}
          contracts={contracts}
          tokens={tokens}
          balance={balance}
        />
      </BasePage>
      <BasePage margin={{ top: "15px" }}>
        <Tabs
          alignControls="start"
          justify="start"
          activeIndex={activeIndex}
          onActive={(newActive) => {
            history.replace(
              `${history.location.pathname}?activeTab=${newActive}`
            );
            setActiveIndex(newActive);
          }}
        >
          <Tab title={<Text size="small">Transactions</Text>}>
            <Transactions {...txsCommonProps} type={"transaction"} />
          </Tab>

          <Tab title={<Text size="small">Staking</Text>}>
            <Transactions {...txsCommonProps} type={"staking_transaction"} />
          </Tab>

          <Tab title={<Text size="small">Internal</Text>}>
            <Transactions {...txsCommonProps} type={"internal_transaction"} />
          </Tab>

          <Tab title={<Text size="small">HRC20 Transfers</Text>}>
            <Transactions {...txsCommonProps} type={"erc20"} />
          </Tab>

          <Tab title={<Text size="small">NFT Transfers</Text>}>
            <Transactions {...txsCommonProps} type={"erc721"} />
          </Tab>

          {type === "erc721" || type === "erc1155" || type === "erc20" ? (
            <Tab title={<Text size="small">Holders</Text>}>
              <HoldersTab
                id={id}
                type={type}
                inventory={
                  inventoryHolders.length ? inventoryHolders : inventory
                }
              />
            </Tab>
          ) : null}

          {(type === "erc721" || type === "erc1155") && inventory.length ? (
            <Tab
              title={<Text size="small">Inventory ({inventory.length})</Text>}
            >
              <Inventory inventory={inventory} />
            </Tab>
          ) : null}

          {!!contracts || !!sourceCode ? (
            <Tab title={<Text size="small">Contract</Text>}>
              <ContractDetails
                address={id}
                contracts={contracts}
                sourceCode={sourceCode}
              />
            </Tab>
          ) : null}

          {type === "erc20" &&
            <Tab title={<Text size="small">Events</Text>}>
              <EventsTab id={id} />
            </Tab>
          }

          {(type === "erc721" || type === "erc1155" || type === "erc20") ? (
            <Tab title={<Text size="small">Tools</Text>}>
              <ToolsTab contractAddress={id} showTools={true} />
            </Tab>
          ) : null}

          {/*{type === "erc1155" && inventory.length ? (*/}
          {/*  <Tab*/}
          {/*    title={<Text size="small">Inventory ({inventory.length})</Text>}*/}
          {/*  >*/}
          {/*    <Inventory inventory={inventory} />*/}
          {/*  </Tab>*/}
          {/*) : null}*/}
        </Tabs>
      </BasePage>
    </BaseContainer>
  );
}
