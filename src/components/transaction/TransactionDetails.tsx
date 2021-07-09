import React, { FunctionComponent, useState } from "react";
import { Log, RPCStakingTransactionHarmony } from "src/types";

import {
  transactionPropertyDisplayNames,
  transactionDisplayValues,
  transactionPropertySort,
  transactionPropertyDescriptions,
} from "./helpers";
import {
  Address,
  CalculateFee,
  CalculateTransactionFee,
  TipContent,
} from "src/components/ui";
import { Anchor, Box, DataTable, Text, Tip } from "grommet";
import { TransactionSubType } from "src/components/transaction/helpers";
import { parseSuggestedEvent, DisplaySignature } from "src/web3/parseByteCode";

import { CaretDownFill, CaretUpFill, CircleQuestion } from "grommet-icons";
import { ERC20Value } from "../ERC20Value";
import { TokenValueBalanced } from "../ui/TokenValueBalanced";
import { TxStatusComponent } from "../ui/TxStatusComponent";

const getColumns = ({ type = "" }) => [
  {
    property: "key",
    render: (e: any) => (
      <div>
        <Tip
          dropProps={{ align: { left: "right" } }}
          content={
            <TipContent
              message={
                transactionPropertyDescriptions[e.key + type] ||
                transactionPropertyDescriptions[e.key]
              }
            />
          }
          plain
        >
          <span>
            <CircleQuestion size="small" />
          </span>
        </Tip>
        &nbsp;
        {transactionPropertyDisplayNames[e.key + type] ||
          transactionPropertyDisplayNames[e.key] ||
          e.key}
      </div>
    ),
    size: "1/3",
  },
  {
    property: "value",
    size: "2/3",
    render: (e: any) => e.value,
  },
];

type TransactionDetailsProps = {
  transaction: RPCStakingTransactionHarmony;
  type?: TransactionSubType;
  logs?: Log[];
  errorMsg: string | undefined;
  shorMoreHide?: boolean;
};

type tableEntry = {
  key: string;
  value: any;
};

// todo move out to a service to support any custom ABI
const erc20TransferTopic =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

const tokenTransfers = (logs: Log[]) => {
  const erc20Logs = logs.filter((l) => l.topics.includes(erc20TransferTopic));
  const events = erc20Logs
    .map((l) =>
      parseSuggestedEvent("Transfer(address,address,uint256)", l.data, l.topics)
    )
    .filter((e) => e && e.parsed);

  if (!events.length) {
    return <>—</>;
  }

  return (
    <>
      {events.map((e: any, index) => {
        const val = e.parsed["$2"];
        const address = erc20Logs[index].address;

        return (
          <Box
            direction={"column"}
            align={"start"}
            pad={"xxsmall"}
            style={{ borderRadius: "6px", marginBottom: "3px" }}
          >
            <Box direction={"row"}>
              <Text size="small" color="minorText">
                From :&nbsp;
              </Text>
              <Address address={e.parsed["$0"].toLowerCase()} />
              &nbsp;
              <Text size="small" color="minorText">
                To :&nbsp;
              </Text>
              <Address address={e.parsed["$1"].toLowerCase()} />
            </Box>
            <Box align={"center"} direction={"row"}>
              <Text size="small" color="minorText">
                Value : &nbsp;
              </Text>
              <TokenValueBalanced
                value={val}
                tokenAddress={address}
                direction={"row"}
              />
            </Box>
          </Box>
        );
      })}
    </>
  );
};

export const TransactionDetails: FunctionComponent<TransactionDetailsProps> = ({
  transaction,
  type,
  logs = [],
  errorMsg,
  shorMoreHide,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const newTransaction = {
    Status:
      errorMsg === undefined ? (
        +transaction.shardID > 0 ? (
          <TxStatusComponent msg={""} />
        ) : (
          <> </>
        )
      ) : (
        <TxStatusComponent msg={errorMsg} />
      ),
    ...transaction,
    tokenTransfers: tokenTransfers(logs),
    transactionFee: (
      <Box justify="center">{CalculateTransactionFee(transaction)}</Box>
    ),
    gasPrice: <Box justify="center">{CalculateFee(transaction)}</Box>,
  };

  const keys = Object.keys(newTransaction).filter((key) => key !== "gas");
  const sortedKeys = keys
    .sort((a, b) => transactionPropertySort[b] - transactionPropertySort[a])
    .filter((k) => showDetails || ["r", "s", "v"].indexOf(k) === -1);

  const txData = sortedKeys.reduce((arr, key) => {
    // @ts-ignore
    const value = transactionDisplayValues(
      // @ts-ignore
      newTransaction,
      key,
      // @ts-ignore
      newTransaction[key],
      type
    );

    if (value === undefined) {
      return arr;
    }

    arr.push({ key, value } as tableEntry);
    return arr;
  }, [] as tableEntry[]);

  return (
    <>
      <Box flex align="start" justify="start" style={{ overflow: "auto" }}>
        <DataTable
          className={"g-table-body-last-col-right g-table-no-header"}
          style={{ width: "100%", minWidth: "698px" }}
          columns={getColumns({ type })}
          data={txData}
          step={10}
          border={{
            header: {
              color: "none",
            },
            body: {
              color: "border",
              side: "top",
              size: "1px",
            },
          }}
        />
      </Box>
      {shorMoreHide ? null : (
        <Box align="center" justify="center" style={{ userSelect: "none" }}>
          <Anchor
            onClick={() => setShowDetails(!showDetails)}
            margin={{ top: "medium" }}
          >
            {showDetails ? (
              <>
                Show less&nbsp;
                <CaretUpFill size="small" />
              </>
            ) : (
              <>
                Show more&nbsp;
                <CaretDownFill size="small" />
              </>
            )}
          </Anchor>
        </Box>
      )}
    </>
  );
};
