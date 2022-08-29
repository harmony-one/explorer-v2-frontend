import React, { useEffect, useState } from "react";
import { Box, Heading, Tab, Tabs, Text } from "grommet";
import { BasePage, BaseContainer } from "src/components/ui";
import { TransactionsTable } from "../../components/tables/TransactionsTable";
import { ApprovalDetails, Filter, RPCTransactionHarmony } from "../../types";
import { useHistory } from "react-router-dom";
import { getTransactions, getCount } from "src/api/client";
import { ShardDropdown } from "src/components/ui/ShardDropdown";
import { useParams } from "react-router-dom";
import { ToolsTab } from "../AddressPage/tabs/tools";
import { ApprovalsRenderer } from "src/components/approvals/approvalsRenderer";
import { HarmonyAddress } from "src/utils";
import { ApiCache } from "src/api/ApiCache";
import { getAllApprovalsForTokens } from "src/api/rpc";
import { revokePermission } from "src/utils/approvals";
import { Wallet } from "../AddressPage/ContractDetails/ConnectWallets";
import { ApprovalsHeader } from "src/components/approvals/approvalsHeader";
import { useERC1155Pool } from "src/hooks/ERC1155_Pool";
import { useERC721Pool } from "src/hooks/ERC721_Pool";
import { useERC20Pool } from "src/hooks/ERC20_Pool";

const ApprovalCache = new ApiCache({ key: "approvalsCache" }); // cache of approvals data mapped


export function ApprovalPage() {
  const history = useHistory();

  const [activeIndex, setActiveIndex] = useState(0);
  const [metamaskAddress, setMetamask] = useState("");
  const [chainId, setChainId] = useState(0);
  const [data, setData] = useState<ApprovalDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const erc1155Pool = useERC1155Pool();
  const erc721Pool = useERC721Pool();
  const erc20Pool = useERC20Pool();

  const isMainNet =
    process.env.REACT_APP_RPC_URL_SHARD0 === "https://a.api.s0.t.hmny.io/";

  const validChainId = isMainNet
    ? chainId === 1666600000
    : (chainId === 1666700000 || chainId === 1666900000);

  const loadTransactions = async ({ account = "" }) => {

    if (account === "" || !validChainId) {
      setIsLoading(false);
      return;
    }

    const harmonyAddress = new HarmonyAddress(account);
    const key = account;

    let pageIndex = ApprovalCache.get(key + "-index") || 0;
    const pageSize = 100;
    let result: { txnHistory: ApprovalDetails[], dataObj: RPCTransactionHarmony[] } = { txnHistory: ApprovalCache.get(key + "-txnHistory") || [], dataObj: [] };
    try {
      do {
        result = await getAllApprovalsForTokens(harmonyAddress.basicHex,
          "",
          pageIndex,
          pageSize,
          result.txnHistory,
          erc20Pool,
          erc1155Pool,
          erc721Pool
        );
        console.log('result', result)
        // update the page index and the txn history on each refresh
        if (result.dataObj.length > 0) {
          ApprovalCache.set(key + "-index", pageIndex);
          ApprovalCache.set(key + "-txnHistory", result.txnHistory);
        }

        pageIndex++;

        setData((prev: ApprovalDetails[]) => {
          return [...result.txnHistory];
        });

      } while (result.dataObj.length >= pageSize);
    }
    catch (error) {
      // @ts-ignore
      setError(error.message);
    }

    setIsLoading(false);
  }

  const revokePermissions = async (tx:ApprovalDetails) => {
    const account = tx.account;

    setIsLoading((prev: boolean) => {
      return true;
    });
    setError((prev: string | null) => {
      return null;
    }); // clear error
    try {
      await revokePermission(tx);
    }
    catch (error) {
      // @ts-ignore
      setError(error.message);
      return;
    }
    setData((prev: ApprovalDetails[]) => {
      return [];
    }); // reset data

    await loadTransactions({ account });
  }

  // test user 0x5c57fec3e02e5b64f8c3b47b39942ef682e51459
  return (
    <BaseContainer pad={{ horizontal: "0" }}>
      <Heading size="small" margin={{ bottom: "medium", top: "0" }}>
        Harmony Token Approvals
      </Heading>
      <BasePage pad={"small"} style={{ overflow: "inherit" }}>
        <Box direction="column">
          <ApprovalsHeader />
          <Box margin={{ left: "10px", top: "medium" }}>
            <Wallet onSetMetamask={(addr: string) => {
              console.log("Address", addr);
              if (addr?.length > 0) {
                setIsLoading(true);
                loadTransactions({ account: addr });
              }
              setMetamask(addr);
            }} onSetChainId={setChainId} />
            {error && (
              <Text color='red' size='small' style={{ marginTop: 5 }}>
                {error}
              </Text>
            )}
            {metamaskAddress?.length > 0 && <Box>
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

                <Tab title={<Text size="small">HRC20</Text>}>
                </Tab>

                <Tab title={<Text size="small">HRC1155</Text>}>
                </Tab>

                <Tab title={<Text size="small">HRC721</Text>}>
                </Tab>

              </Tabs>
              <Box margin={{top: "small"}}>
                {
                  activeIndex === 0 &&
                  <ApprovalsRenderer data={data.filter(details => erc20Pool[details.assetAddress])} isLoading={isLoading} revokeClicked={revokePermissions} account={metamaskAddress} title="for all HRC20" />
                }

                {
                  activeIndex === 1 &&
                  <ApprovalsRenderer data={data.filter(details => erc1155Pool[details.assetAddress])} isLoading={isLoading} revokeClicked={revokePermissions} account={metamaskAddress} title="for all HRC1155" />
                }

                {
                  activeIndex === 2 &&
                  <ApprovalsRenderer data={data.filter(details => erc721Pool[details.assetAddress])} isLoading={isLoading} revokeClicked={revokePermissions} account={metamaskAddress} title="for all HRC721" />
                }
              </Box>
            </Box>}
          </Box>
        </Box>
      </BasePage>
    </BaseContainer>
  );
}
