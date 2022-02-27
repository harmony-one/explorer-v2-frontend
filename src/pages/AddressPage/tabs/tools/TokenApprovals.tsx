import { Box, Text } from "grommet";
import { useState } from "react";
import { ApprovalDetails, RPCTransactionHarmony } from "src/types";
import { HarmonyAddress } from "src/utils";
import { ApprovalsHeader } from "src/components/approvals/approvalsHeader";
import { Wallet } from "../../ContractDetails/ConnectWallets";
import { ApprovalsRenderer } from "src/components/approvals/approvalsRenderer";
import { revokePermission } from "src/utils/approvals";
import { ApiCache } from "src/api/ApiCache";
import { getAllApprovalsForTokens } from "src/api/rpc";
import { useERC1155Pool } from "src/hooks/ERC1155_Pool";
import { useERC20Pool } from "src/hooks/ERC20_Pool";
import { useERC721Pool } from "src/hooks/ERC721_Pool";

const ApprovalCache = new ApiCache({ key: "approvalsCache" }); // cache of approvals data mapped 

export function TokenApprovals(props: { contractAddress?: string }) {
    const [metamaskAddress, setMetamask] = useState("");
    const [chainId, setChainId] = useState(0);
    const [data, setData] = useState<ApprovalDetails[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const erc20Map = useERC20Pool();
    const erc721Map = useERC721Pool();
    const erc1155Map = useERC1155Pool();

    const isMainNet =
        process.env.REACT_APP_RPC_URL_SHARD0 === "https://a.api.s0.t.hmny.io/";

    const validChainId = isMainNet
        ? chainId === 1666600000
        : chainId === 1666700000;

    const loadTransactions = async ({ account = "", contractAddress = "" }) => {

        if (account === "" || !validChainId) {
            setIsLoading(false);
            return;
        }

        const harmonyAddress = new HarmonyAddress(account);
        const contractHarmonyAddr = contractAddress.length > 0 ? new HarmonyAddress(contractAddress) : null;

        const key = account + (contractHarmonyAddr ? contractAddress : "");
        const pageSize = 100;

        let pageIndex = ApprovalCache.get(account + "-" + key + "-index") || 0;
        let result: { txnHistory: ApprovalDetails[], dataObj: RPCTransactionHarmony[] } = { txnHistory: ApprovalCache.get(account + "-" + key + "-txnHistory") || [], dataObj: [] };
        try {
            do {
                result = await getAllApprovalsForTokens(harmonyAddress.basicHex, 
                    contractHarmonyAddr?.basicHex || "", 
                    pageIndex, 
                    pageSize, 
                    result.txnHistory, 
                    erc20Map, 
                    erc1155Map, 
                    erc721Map
                );
                // update the page index and the txn history on each refresh
                if (result.dataObj.length > 0) {
                    ApprovalCache.set(account + "-" + key + "-index", pageIndex);
                    ApprovalCache.set(account + "-" + key + "-txnHistory", result.txnHistory);
                }

                pageIndex++;

                if (result.dataObj.length > 0) { // update only when there is data
                    setData((prev: ApprovalDetails[]) => {
                        return [...result.txnHistory];
                    });
                }

            } while (result.dataObj.length >= pageSize);
        }
        catch (error) {
            // @ts-ignore
            setError(error.message);
        }

        setIsLoading(false);
    }

    const revokePermissions = async (tx: ApprovalDetails) => {
        const account = tx.account;
        const contractAddress = tx.assetAddress;

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

        await loadTransactions({ account, contractAddress });
    }

    return (
        <Box>
            <ApprovalsHeader />
            <Box margin={{ left: "10px", top: "medium" }}>
                <Wallet onSetMetamask={(addr: string) => {
                    if (addr?.length > 0) {
                        setIsLoading(true);
                        loadTransactions({ account: addr, contractAddress: props.contractAddress });
                    }
                    setMetamask(addr);
                }} onSetChainId={setChainId} />
                {error && (
                    <Text color='red' size='small' style={{ marginTop: 5 }}>
                        {error}
                    </Text>
                )}
                {metamaskAddress?.length > 0 &&
                    <ApprovalsRenderer data={data} isLoading={isLoading} revokeClicked={revokePermissions} account={metamaskAddress} contractAddress={props.contractAddress} />}

            </Box>
        </Box>
    );
}
