import React, { useEffect, useRef, useState } from "react";
import { Box, ColumnConfig, Text } from "grommet";
import { useParams } from "react-router-dom";
import {
  getByteCodeSignatureByHash,
  getRelatedTransactionsByType,
} from "src/api/client";
import { TransactionsTable } from "src/components/tables/TransactionsTable";
import {
  Address,
  ONEValue,
  DateTime,
} from "src/components/ui";
import {
  Filter,
  RelatedTransaction,
  RelatedTransactionType, RPCTransactionHarmony
} from "src/types";
import styled, { css } from "styled-components";
import { TRelatedTransaction } from "src/api/client.interface";
import { getERC20Columns } from "./erc20Columns";
import { getAddress, mapBlockchainTxToRelated } from "src/utils";
import {
  hmyv2_getStakingTransactionsCount,
  hmyv2_getStakingTransactionsHistory,
  hmyv2_getTransactionsCount,
  hmyv2_getTransactionsHistory
} from "../../../api/rpc";

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
          <DateTime
            date={data.timestamp}
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
          <DateTime date={data.timestamp} />
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

const usePrevious = (value: TRelatedTransaction) => {
  const ref = useRef();
  useEffect(() => {
    // @ts-ignore
    ref.current = value;
  });
  return ref.current;
};

export function Transactions(props: {
  type: TRelatedTransaction;
  rowDetails?: (row: any) => JSX.Element;
  onTxsLoaded?: (txs: RPCTransactionHarmony[]) => void;
}) {
  const limitValue = localStorage.getItem("tableLimitValue");

  const initFilter: Filter = {
    offset: 0,
    limit: limitValue ? +limitValue : 10,
    orderBy: "block_number",
    orderDirection: "desc",
    filters: [{ type: "gte", property: "block_number", value: 0 }],
  };
  const initFilterState = {
    transaction: { ...initFilter },
    staking_transaction: { ...initFilter },
    internal_transaction: { ...initFilter },
    erc20: { ...initFilter },
    erc721: { ...initFilter },
    erc1155: { ...initFilter },
  }
  const initTotalElements = 100
  const [cachedTxs, setCachedTxs] = useState<{ [name: string]: RelatedTransaction[]}>({})
  const [relatedTrxs, setRelatedTrxs] = useState<RelatedTransaction[]>([]);
  const [totalElements, setTotalElements] = useState<number>(initTotalElements)
  const [cachedTotalElements, setCachedTotalElements] = useState<{ [name: string]: number}>({})
  const [filter, setFilter] = useState<{ [name: string]: Filter }>(initFilterState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const prevType = usePrevious(props.type);

  // @ts-ignore
  let { id } = useParams();
  id = `${id}`.toLowerCase();
  id = id.slice(0, 3) === "one" ? getAddress(id).basicHex : id;
  const prevId = usePrevious(id);

  const { limit = 10, offset = 0 } = filter[props.type];

  const loadTransactions = async () => {
    setIsLoading(true)
    try {
      let txs = []
      if (props.type ==='transaction' || props.type === 'staking_transaction') {
        const pageSize = limit
        const pageIndex = Math.floor(offset / limit)
        const params = [{ address: id, pageIndex, pageSize }]
        txs = props.type ==='transaction'
          ? await hmyv2_getTransactionsHistory(params)
          : await hmyv2_getStakingTransactionsHistory(params)
        txs = txs.map(tx => mapBlockchainTxToRelated(tx))
      } else {
        txs = await getRelatedTransactionsByType([
          0,
          id,
          props.type,
          filter[props.type],
        ]);
      }
      // for transactions we display call method if any
      if (props.type === "transaction") {
        const methodSignatures = await Promise.all(
          txs.map((tx: any) => {
            return tx.input && tx.input.length > 10
              ? getByteCodeSignatureByHash([tx.input.slice(0, 10)])
              : Promise.resolve([]);
          })
        );

        txs = txs.map((l, i) => ({
          ...l,
          signatures: methodSignatures[i],
        }));
      }

      txs = txs.map((tx: any) => {
        tx.relatedAddress = id;
        return tx;
      });

      setRelatedTrxs(txs);
      if (props.type === 'transaction' || props.type === 'staking_transaction') {
        setCachedTxs({ ...cachedTxs, [props.type]: txs });
      }
      if (props.onTxsLoaded) {
        props.onTxsLoaded(txs)
      }
    } catch (e) {
      console.error('Cannot get or parse txs:', e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setCachedTxs({})
    setCachedTotalElements({})
    setFilter(initFilterState)
  }, [id])

  useEffect(() => {
    const getTxsCount = async () => {
      try {
        if (props.type ==='transaction' || props.type === 'staking_transaction') {
          if (typeof cachedTotalElements[props.type] !== 'undefined' && id === prevId) {
            setTotalElements(cachedTotalElements[props.type])
          } else {
            const count = props.type ==='transaction'
              ? await hmyv2_getTransactionsCount(id)
              : await hmyv2_getStakingTransactionsCount(id)
            setTotalElements(count)
            setCachedTotalElements({ ...cachedTotalElements, [props.type]: count })
          }
        } else {
          setTotalElements(initTotalElements)
        }
      } catch (e) {
        console.error('Cannot get txs count', (e as Error).message)
        setTotalElements(initTotalElements)
      }
    }
    getTxsCount()
  }, [props.type, id])

  useEffect(() => {
    if (prevType === props.type) {
      loadTransactions()
    }
  }, [filter[props.type], id]);

  useEffect(() => {
    if (cachedTxs[props.type]) {
      setRelatedTrxs(cachedTxs[props.type]);
    } else {
      loadTransactions()
    }
  }, [props.type])

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
        totalElements={totalElements}
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
        showPages={totalElements > 0 && (props.type ==='transaction' || props.type === 'staking_transaction')}
      />
    </Box>
  );
}
