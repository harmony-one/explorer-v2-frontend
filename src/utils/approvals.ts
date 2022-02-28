import { HarmonyAddress } from "./getAddress/GetAddress";
import { ApprovalDetails, RPCTransactionHarmony, TokenType } from "../types/blockchain";
import Web3 from "web3";
import { AbiItem } from 'web3-utils';
import detectEthereumProvider from "@metamask/detect-provider";
import { ERC1155_Pool } from "src/hooks/ERC1155_Pool";
import { ERC20_Pool } from "src/hooks/ERC20_Pool";
import { ERC721_Pool } from "src/hooks/ERC721_Pool";

const approvalERC20ABI: AbiItem[] = [
    {
        constant: false,
        inputs: [
            {
                internalType: "address",
                name: "spender",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "tokens",
                type: "uint256"
            }
        ],
        name: "approve",
        outputs: [
            {
                internalType: "bool",
                name: "success",
                type: "bool"
            }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    }
];

const approvalNonFungibleABI: AbiItem[] = [
    { "constant": false, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" },
    { "constant": false, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }
];

export const convertTxnToObj = (tx: any, type: TokenType): ApprovalDetails => {
    const assetAddress = new HarmonyAddress(tx.to).basicHex;

    const approvedObj: ApprovalDetails = {
        hash: tx.hash,
        lastUpdated: new Date(+tx.timestamp * 1000),
        assetAddress: assetAddress,
        spender: "0x" + tx.input.substring(34, 74),
        allowance: allowanceAmount(tx),
        action: "action",
        account: new HarmonyAddress(tx.from).basicHex,
        contract: tx.to,
        type: type
    };
    const amount = tx.input.substring(74);

    if (type === "ERC1155" || type === "ERC721") {
        if (!matchesApproveAllNonFungible(tx)) {
            approvedObj.tokenId = parseInt(amount, 16); // get the token id
            approvedObj.isFullApproval = false;
            approvedObj.action = "approve";
        }
        else {
            approvedObj.tokenId = undefined; // this marks full approval
            approvedObj.isFullApproval = true;
            approvedObj.action = "setApproveForAll";
        }
        // else its full approval so this is null
    }
    else {
        approvedObj.isFullApproval = approvedObj.allowance === "Unlimited";
        approvedObj.action = "approve";

        if (!approvedObj.isFullApproval) {
            approvedObj.tokenAmount = parseInt(amount, 16);
        }
    }

    return approvedObj;
}

const approval20Hash = "0x095ea7b3";
const approval721Hash = "0x095ea7b3"; // address of approval and id
const approvalAll721Hash = "0xa22cb465"; // setApprovalForAll - but check if the approve is true/false for second arg

const approval1155Hash = "0x095ea7b3"; // address of approval and id, if address is 0 then remove from list
const approvalAll1155Hash = "0xa22cb465"; // setApprovalForAll - this allows full approval ...
const unlimitedAllowance = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";


export const matchesApproveAllNonFungible = (tx: RPCTransactionHarmony): boolean => {
    return tx.input.includes(approvalAll1155Hash) || tx.input.includes(approvalAll721Hash);
}

export const matchesApprovalMethod = (tx: RPCTransactionHarmony): boolean => {

    return tx.input.includes(approval20Hash) ||
        tx.input.includes(approval721Hash) ||
        tx.input.includes(approval1155Hash) ||
        tx.input.includes(approvalAll1155Hash) ||
        tx.input.includes(approvalAll721Hash);
}

export const filterTransactions = (tx: RPCTransactionHarmony,
    txnHistory: ApprovalDetails[],
    spender: string,
    erc20: ERC20_Pool = {},
    erc1155: ERC1155_Pool = {},
    erc721: ERC721_Pool = {}): ApprovalDetails[] => {
    // filter txn history. if erc20 then just remove
    const to = new HarmonyAddress(tx.to).basicHex;
    if (erc20[to]) {
        // remove any other occurrence of the spender and the contract in the list of txn (current tx is latest)
        txnHistory = txnHistory.filter(transaction => !(transaction.spender === spender && transaction.contract === tx.to));
        return txnHistory;
    }
    else if (erc1155[to] || erc721[to]) {
        if (matchesApproveAllNonFungible(tx)) {
            // it is a match on the spend all
            // we need to find the token id that is currently approved and remove it
            // approve all matches on spender
            return txnHistory.filter(transaction => !(transaction.spender === spender && transaction.contract === tx.to))
        }
        else {
            // if it is spend on a specific target token then we need to find the previous target token txn
            // erc115 token approval only allows a single address to have approved token access. therefore we need to find
            // and remove the last token that was approved
            const tokenId = parseInt(tx.input.substring(74), 16); // approve on a specific token id
            return txnHistory.filter(transaction => !(transaction.tokenId === tokenId && transaction.contract === tx.to))

        }

    }
    return txnHistory;
}


export const hasAllowance = (tx: RPCTransactionHarmony, spender: string, type: TokenType): boolean => {
    if (type === "ERC20" && tx.input.includes(approval20Hash)) {
        const allowance = tx.input.substring(74);
        return parseInt(allowance, 16) !== 0;
    }
    else if (tx.input.includes(approvalAll1155Hash) || tx.input.includes(approvalAll721Hash)) {
        // depend on second argument of approvalAll
        return parseInt(tx.input.substring(74)) !== 0; // bool argument, 0 means we revoke, 1 means we approve
    }
    else if (type === "ERC721" || type === "ERC1155") {
        // check the address component, if it is 0x0... then there is no allowance 
        // 
        return !Web3.utils.toBN(spender).isZero();
    }
    return false;
}

export const allowanceAmount = (tx: RPCTransactionHarmony): string => {
    if (tx.input.includes(approval20Hash)) {
        const allowance = tx.input.substring(74);
        if (allowance.includes(unlimitedAllowance)) {
            return "Unlimited";
        }
        return "Limited";
    }
    else if (tx.input.includes(approvalAll1155Hash) || tx.input.includes(approvalAll721Hash)) {
        return "Unlimited";
    }
    return "Limited";
}

export const revokePermission = async (tx: ApprovalDetails) => {
    const account = tx.account;
    const spender = tx.spender;
    const contractAddress = tx.assetAddress;
    const web3Provider: any = await detectEthereumProvider(); // can't be null; Wallet would fail first

    // web3.eth.abi.encodeFunctionSignature

    const hmyWeb3 = new Web3(web3Provider);

    if (tx.type === "ERC20") {
        const contract = new hmyWeb3.eth.Contract(approvalERC20ABI, contractAddress);
        await contract.methods.approve(spender, 0).send({ from: account });
    }
    else if (tx.type === "ERC1155" || tx.type === "ERC721") {
        if (tx.isFullApproval) {
            const contract = new hmyWeb3.eth.Contract(approvalNonFungibleABI, contractAddress);
            await contract.methods.setApprovalForAll(spender, false).send({ from: account }); // clear approvals for all
        }
        else {
            const contract = new hmyWeb3.eth.Contract(approvalNonFungibleABI, contractAddress);
            await contract.methods.approve(EMPTY_ADDRESS, tx.tokenId).send({ from: account }); // clear approval for tokenId
        }
    }
}

