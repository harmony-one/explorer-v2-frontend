import React, { useEffect, useState } from "react";
import { Box, ColumnConfig, Text } from "grommet";
import { FormNextLink } from "grommet-icons";
import { useParams } from "react-router-dom";
import {
  getByteCodeSignatureByHash,
  getRelatedTransactions,
  getRelatedTransactionsByType,
} from "src/api/client";
import { TransactionsTable } from "src/components/tables/TransactionsTable";
import {
  Address,
  CalculateFee,
  ONEValue,
  RelativeTimer,
} from "src/components/ui";
import {
  Filter,
  RelatedTransaction,
  RelatedTransactionType,
  RPCTransaction,
} from "src/types";
import styled, { css } from "styled-components";
import { TRelatedTransaction } from "src/api/client.interface";
import { getERC20Columns } from "./erc20Columns";
import { getAddress } from "src/utils";

const Marker = styled.div<{ out: boolean }>`
  border-radius: 2px;
  padding: 5px;

  text-align: center;
  font-weight: bold;

  ${(props) =>
    props.out
      ? css`
          background: rgb(239 145 62);
          color: #fff;
        `
      : css`
          background: rgba(105, 250, 189, 0.8);
          color: #1b295e;
        `};
`;

const NeutralMarker = styled(Box)`
  border-radius: 2px;
  padding: 5px;

  text-align: center;
  font-weight: bold;
`;

function getColumns(id: string): ColumnConfig<any>[] {
  return [
    // {
    //   property: "type",
    //   size: "",
    //   header: (
    //     <Text
    //       color="minorText"
    //       size="small"
    //       style={{ fontWeight: 300, width: "140px" }}
    //     >
    //       Type
    //     </Text>
    //   ),
    //   render: (data: RelatedTransaction) => (
    //     <Text size="small" style={{ width: "140px" }}>
    //       {relatedTxMap[data.transactionType] || data.transactionType}
    //     </Text>
    //   ),
    // },
    {
      property: "hash",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "95px" }}
        >
          Hash
        </Text>
      ),
      render: (data: any) => (
        <Address
          address={data.transactionHash || data.hash}
          type="tx"
          isShort
        />
      ),
    },
    {
      property: "method",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Method
        </Text>
      ),
      render: (data: any) => {
        let signature;

        try {
          // @ts-ignore
          signature =
            data.signatures &&
            data.signatures.map((s: any) => s.signature)[0].split("(")[0];
        } catch (err) {}

        if (!signature && data.value !== "0") {
          signature = "transfer";
        }

        if (!signature && data.input.length >= 10) {
          signature = data.input.slice(2, 10);
        }

        if (!signature) {
          return <Text size="small">{"—"}</Text>;
        }

        return (
          <Text size="12px">
            <NeutralMarker background={"backgroundBack"}>
              {signature}
            </NeutralMarker>
          </Text>
        );
      },
    },
    // {
    //   property: "shard",
    //   header: (
    //     <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
    //       Shard
    //     </Text>
    //   ),
    //   render: (data: RelatedTransaction) => (
    //     <Box direction="row" gap="3px" align="center">
    //       <Text size="small">{0}</Text>
    //       <FormNextLink
    //         size="small"
    //         color="brand"
    //         style={{ marginBottom: "2px" }}
    //       />
    //       <Text size="small">{0}</Text>
    //     </Box>
    //   ),
    // },
    {
      property: "from",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "320px" }}
        >
          From
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          <Address address={data.from} />
        </Text>
      ),
    },
    {
      property: "marker",
      header: <></>,
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          <Marker out={data.from === id}>
            {data.from === id ? "OUT" : "IN"}
          </Marker>
        </Text>
      ),
    },
    {
      property: "to",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "320px" }}
        >
          To
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          <Address address={data.to} />
        </Text>
      ),
    },
    {
      property: "value",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "120px" }}
        >
          Value
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Box justify="center">
          <ONEValue value={data.value} timestamp={data.timestamp} />
        </Box>
      ),
    },

    {
      property: "timestamp",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "140px" }}
        >
          Timestamp
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Box direction="row" gap="xsmall" justify="end">
          <RelativeTimer
            date={data.timestamp}
            updateInterval={1000}
            style={{ minWidth: "auto" }}
          />
        </Box>
      ),
    },
  ];
}

const getStackingColumns = (id: string): ColumnConfig<any>[] => {
  return [
    {
      property: "hash",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "95px" }}
        >
          Hash
        </Text>
      ),
      render: (data: any) => (
        <Address
          address={data.transactionHash || data.hash}
          type="staking-tx"
          isShort
        />
      ),
    },
    {
      property: "type",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "140px" }}
        >
          Type
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Text size="small" style={{ width: "140px" }}>
          {data.type}
        </Text>
      ),
    },
    {
      property: "validator",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "320px" }}
        >
          Validator
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          {data.msg?.validatorAddress ? (
            <Address address={data.msg?.validatorAddress || data.from} />
          ) : (
            "—"
          )}
        </Text>
      ),
    },
    {
      property: "marker",
      header: <></>,
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          <Marker out={data.from === id}>
            {data.from === id ? "OUT" : "IN"}
          </Marker>
        </Text>
      ),
    },
    {
      property: "delegator",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "320px" }}
        >
          Delegator
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Text size="12px">
          {data.msg?.delegatorAddress ? (
            <Address address={data.msg?.delegatorAddress} />
          ) : (
            "—"
          )}
        </Text>
      ),
    },
    {
      property: "value",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "220px" }}
        >
          Value
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Box justify="center">
          {data.msg?.amount ? (
            <ONEValue value={data.msg?.amount} timestamp={data.timestamp} />
          ) : data.amount ? (
            <ONEValue value={data.amount} timestamp={data.timestamp} />
          ) : (
            "—"
          )}
        </Box>
      ),
    },
    {
      property: "timestamp",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "140px" }}
        >
          Timestamp
        </Text>
      ),
      render: (data: RelatedTransaction) => (
        <Box direction="row" gap="xsmall" justify="end">
          <RelativeTimer
            date={data.timestamp}
            updateInterval={1000}
            style={{ minWidth: "auto" }}
          />
        </Box>
      ),
    },
  ];
};

const relatedTxMap: Record<RelatedTransactionType, string> = {
  transaction: "Transaction",
  internal_transaction: "Internal Transaction",
  stacking_transaction: "Staking Transaction",
};

export function Transactions(props: {
  type: TRelatedTransaction;
  rowDetails?: (row: any) => JSX.Element;
}) {
  const limitValue = localStorage.getItem("tableLimitValue");

  const initFilter: Filter = {
    offset: 0,
    limit: limitValue ? +limitValue : 10,
    orderBy: "block_number",
    orderDirection: "desc",
    filters: [{ type: "gte", property: "block_number", value: 0 }],
  };

  const [relatedTrxs, setRelatedTrxs] = useState<RelatedTransaction[]>([]);
  const [filter, setFilter] = useState<{ [name: string]: Filter }>({
    transaction: { ...initFilter },
    staking_transaction: { ...initFilter },
    internal_transaction: { ...initFilter },
    erc20: { ...initFilter },
    erc721: { ...initFilter },
    erc1155: { ...initFilter },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { limit = 10 } = filter[props.type];

  // @ts-ignore
  let { id } = useParams();
  id = `${id}`.toLowerCase();
  id = id.slice(0, 3) === "one" ? getAddress(id).basicHex : id;

  useEffect(() => {
    const getElements = async () => {
      setIsLoading(true);
      try {
        let relatedTransactions = await getRelatedTransactionsByType([
          0,
          id,
          props.type,
          filter[props.type],
        ]);

        // for transactions we display call method if any
        if (props.type === "transaction") {
          const methodSignatures = await Promise.all(
            relatedTransactions.map((tx: any) => {
              return tx.input && tx.input.length > 10
                ? getByteCodeSignatureByHash([tx.input.slice(0, 10)])
                : Promise.resolve([]);
            })
          );

          relatedTransactions = relatedTransactions.map((l, i) => ({
            ...l,
            signatures: methodSignatures[i],
          }));
        }

        relatedTransactions = relatedTransactions.map((tx: any) => {
          tx.relatedAddress = id;
          return tx;
        });

        setIsLoading(false);
        setRelatedTrxs(relatedTransactions);
      } catch (err) {
        console.log(err);
      }
    };
    getElements();
  }, [filter[props.type], id, props.type]);

  let columns = [];

  switch (props.type) {
    case "staking_transaction": {
      columns = getStackingColumns(id);
      break;
    }
    case "erc20": {
      columns = getERC20Columns(id);
      break;
    }

    default: {
      columns = getColumns(id);
      break;
    }
  }

  return (
    <Box style={{ padding: "10px" }}>
      <TransactionsTable
        columns={columns}
        data={relatedTrxs}
        totalElements={100}
        limit={+limit}
        filter={filter[props.type]}
        isLoading={isLoading}
        setFilter={(value) => {
          if (value.limit !== filter[props.type].limit) {
            localStorage.setItem("tableLimitValue", `${value.limit}`);
          }
          setFilter({ ...filter, [props.type]: value });
        }}
        noScrollTop
        minWidth="1266px"
        hideCounter
        rowDetails={props.rowDetails}
      />
    </Box>
  );
}
