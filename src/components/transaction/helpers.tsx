import { IHexSignature, RPCTransactionHarmony } from "../../types";
import {
    FormNextLink
} from "grommet-icons";
import React from "react";
import {
    Address,
    BlockHash,
    BlockNumber,
    Timestamp,
    TransactionHash,
    ONEValue,
    StakingTransactionTypeValue,
    DateTime
} from "../ui";
import {Box} from "grommet";
import {CopyBtn} from "../ui/CopyBtn";
import { TxInput } from "./TransactionInput";

export const todo = {};

export type TransactionSubType =
    | "__staking"
    | "__delegated"
    | "__undelegated"
    | "";

export const transactionPropertyDisplayNames: Record<string, string> = {
  shardID: "Shard ID",
  hash: "Ethereum Hash",
  hash__staking: "Hash",
  hash_harmony: "Hash",
  value: "Value",
  blockNumber: "Block Number",
  from: "From",
  txnFee: "Txn fee",
  gasUsed: "Gas Limit & Usage by Txn",
  gasPrice: "Gas Price",
  transactionFee: "Transaction Fee",
  input: "Input",
  nonce: "Nonce",
  r: "r",
  s: "s",
  timestamp: "Timestamp",
  to: "To",
  toShardID: "To Shard ID",
  transactionIndex: "Transaction Index",
  v: "v",
  type: "Type",
  amount: "Amount",
  tokenTransfers: "Token Transfers",
  name: "Name",
  commissionRate: "Commission Rate",
  maxCommissionRate: "Max Commission Rate",
  maxChangeRate: "Max Change Rate",
  minSelfDelegation: "Min Self Delegation",
  maxTotalDelegation: "Max Total Delegation",
  website: "Website",
  identity: "Identity",
  securityContract: "Security Contract",
  details: "Details",
  slotPubKeys: "Details",

    slotPubKeyToAdd: "Slot Pub Key To Add",
    slotPubKeyToRemove: "Slot Pub Key To Remove",

    delegatorAddress: "Delegator Address",
    validatorAddress: "Validator Address"
};

export const transactionPropertySort: Record<string, number> = {
    shardID: 1000,
    hash: 900,
    hash_harmony: 950,
    value: 600,
    tokenTransfers: 599,
    blockNumber: 800,
    blockHash: 799,
    from: 700,
    to: 650,
    txnFee: 560,
    transactionFee: 550,
    gasUsed: 540,
    gasPrice: 500,
    input: 300,
    nonce: 350,
    r: 0,
    s: 0,
    timestamp: 750,
    toShardID: 1,
    transactionIndex: 350,
    v: 0
};

export const transactionPropertyDescriptions: Record<string, string> = {
    shardID: "The shard number where the transaction belongs.",
    blockNumber: "The number of the block in which the transaction was recorded.",
    hash: "A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed.",
    hash_harmony:
        "A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed. Shard ID is also involved in calculation of Harmony Hash.",
    from: "The sending party of the transaction (could be from a contract address).",
    to: "The receiving party of the transaction (could be a contract address).",
    value: "The value being transacted in ONE and fiat value.",
    txnFee: "Transaction fee",
    transactionFee: "Transaction fee",
    // gas: "The exact units of gas that was used for the transaction.",
    transactionIndex: "Transaction's number in the block",
    gasUsed: "The exact units of gas that was used for the transaction.",
    gasPrice:
        "Cost per unit of gas specified for the transaction, in ONE. The higher the gas price the higher chance of getting included in a block.",
    input: "Additional information that is required for the transaction.",
    gasLimit: "Total gas limit provided by all transactions in the block.",
    timestamp: "The date and time at which a transaction is mined.",
    difficulty:
        "The amount of effort required to mine a new block. The difficulty algorithm may adjust according to time.",
    nonce:
        "Sequential running number for an address, beginning with 0 for the first transaction. For example, if the nonce of a transaction is 10, it would be the 11th transaction sent from the sender's address",
    size: "The block size is actually determined by the block's gas limit.",
    v: "Value for the transaction's signature",
    r: "Value for the transaction's signature",
    s: "Value for the transaction's signature",
    validatorAddress: "Validator address",
    validatorAddress__delegated: "Delegation validator address",
    validatorAddress__undelegated: "Delegation delegator address",
    delegatorAddress: "Delegator address",
    delegatorAddress__delegated: "Delegator address",
    delegatorAddress__undelegated: "Undelegation delegator address",
    amount: "Stake amount for validator",
    amount__delegated: "Amount for delegation to validator",
    amount__undelegated: "Amount for undelegation to delegator",
    name: "Validator name",
    commissionRate: "Validator commission rate",
    maxCommissionRate: "Validator commission rate",
    maxChangeRate: "validator max commission rate change",
    minSelfDelegation: "Min how much validator self delegates",
    maxTotalDelegation: "Max total delegation to validator",
    website: "Validator website",
    identity: "Validator kyc identity",
    securityContact: "Validator security contact",
    details: "Additional validator info",
    slotPubKeys: "Validator bls pub keys",
    slotPubKeyToAdd: "Validator bls pub key to add",
    slotPubKeyToRemove: "Validator bls pub key to remove",
    tokenTransfers: "Token Transfers"
};

export const transactionPropertyDisplayValues: any = {
    // @ts-ignore
    blockNumber: (value: any, data: any) => (
        <BlockNumber number={value} hash={data["blockHash"]}/>
    ),
    from: (value: any) => <Address address={value}/>,
    value: (value: any, tx: any, internalTxs: any[]) => {
        const filteredInternalTxs = internalTxs.filter(t => {
            return (t.value !== value || internalTxs.length > 1)
        })

        const values = [{value}, ...filteredInternalTxs]
            .filter((internalTx, i) => +internalTx.value || i === 0)
            .map((internalTx, i) => {
                const v = internalTx.value
                const bi = BigInt(v) / BigInt(10 ** 14);
                const copyValue = parseInt(bi.toString()) / 10000;
                return (
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <CopyBtn value={'' + copyValue} showNotification={true} />
                        &nbsp;&nbsp;<ONEValue value={v} timestamp={tx.timestamp}/>
                        {i > 0 && <>
                          &nbsp;
                          <Address
                              isShort={true}
                              address={internalTx.from}/>
                          <div>
                            <FormNextLink size="small" color="brand"/>
                          </div>
                          <Address
                              isShort={true}
                              address={internalTx.to}/>
                          &nbsp;Internal
                        </>}
                    </div>
                )
            })

        return (<span>
            {values.length ? values : <ONEValue value={value} timestamp={tx.timestamp}/>}
        </span>)
    },
    to: (value: any) => <Address address={value}/>,
    hash: (value: any) => <TransactionHash hash={value}/>,
    hash__staking: (value: any) => (
        <TransactionHash hash={value} link="staking-tx"/>
    ),
    hash_harmony: (value: any) => <TransactionHash hash={value}/>,
    blockHash: (value: any) => <BlockHash hash={value}/>,
    timestamp: (value: any) => <DateTime date={value}/>,
    gasUsed: (value: any, tx: RPCTransactionHarmony) => (
        <span>
      {value}
            {/* {value} ({+value / +tx.gas}%){" "} */}
    </span>
    ),
    shardID: (value: any, tx: RPCTransactionHarmony) => (
        <span>
      {value}
            <FormNextLink size="small" color="brand"/>
            {tx.toShardID}
    </span>
    ),
    type: (value: any) => <StakingTransactionTypeValue type={value}/>,
    amount: (value: any, tx: any, internalTxs: any[]) => {
        return (
            <ONEValue value={value} timestamp={tx.timestamp}/>
        )
    },

    name: (value: any) => <span>{value}</span>,
    delegatorAddress: (value: any) => <Address address={value}/>,
    validatorAddress: (value: any) => <Address address={value}/>,
    commissionRate: (value: any) => <span>{value}</span>,
    maxCommissionRate: (value: any) => <span>{value}</span>,
    maxChangeRate: (value: any) => <span>{value}</span>,
    minSelfDelegation: (value: any) => <span>{value}</span>,
    maxTotalDelegation: (value: any) => <span>{value}</span>,
    website: (value: any) => <a href={value}>{value}</a>,
    identity: (value: any) => <span>{value}</span>,
    securityContact: (value: any) => <span>{value}</span>,
    details: (value: any) => <span>{value}</span>,
    slotPubKeys: (value: any) => <span>{value}</span>,
    slotPubKeyToAdd: (value: any) => <span>{value}</span>,
    slotPubKeyToRemove: (value: any) => <span>{value}</span>,
    tokenTransfers: (value: any) => <span>{value}</span>,
    transactionFee: (value: any, tx: any) => {
        return <>{value}</>;
    },
    input: (value: any, tx: RPCTransactionHarmony, _: any, inputSignature: IHexSignature) => <TxInput
      input={tx.input}
      inputSignature={inputSignature}
    />
};

export const transactionDisplayValues = (
    transaction: RPCTransactionHarmony,
    key: string,
    value: any,
    type: string,
    internalTxs: any[] = [],
    inputSignature: IHexSignature
) => {
    if (["blockHash", "toShardID", "msg"].includes(key)) {
        return;
    }

    const f: null | Function =
        transactionPropertyDisplayValues[key + type] ||
        transactionPropertyDisplayValues[key];

    let displayValue = value;

    if (f) {
        displayValue = f(value, transaction, internalTxs, inputSignature);
    } else {
        if (Array.isArray(value)) {
            displayValue = value.join(", ");
        }

        if (value && value.length && value.length > 66) {
            displayValue = value.slice(0, 63) + "...";
        }

        if (displayValue === "0x") {
            displayValue = null;
        }
    }

    if (displayValue === null || displayValue === undefined) {
        if (["success", "error"].find((nameKey) => nameKey === key)) {
            return;
        }
        displayValue = "—";
    }

    const text = typeof value === "string" ? value : <>{value}</>;
    const copyText =
        typeof text === "string" &&
        !["from", "to", "type", "delegatorAddress", "validatorAddress", "value", "input"]
          .find((item) => item === key)
            ? text
            : "";

    return (
        <Box direction="row" align="baseline" style={{ maxWidth: '700px' }}>
            {!["shardID"].includes(key) && ![0, "0", "—"].includes(displayValue) && (
                <>
                    {copyText
                      ? <CopyBtn value={copyText} showNotification={true} />
                      : null
                    }
                    &nbsp;
                </>
            )}
            {displayValue}
        </Box>
    );
};
