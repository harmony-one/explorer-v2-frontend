import React, { useEffect, useRef, useState } from "react";
import { Box } from "grommet";
import { useParams } from "react-router-dom";
import {
  getByteCodeSignatureByHash,
  getRelatedTransactionsByType,
  getRelatedTransactionsCountByType
} from "src/api/client";
import { TransactionsTable } from "src/components/tables/TransactionsTable";
import {
  Address,
  ONEValue,
  DateTime, ONEValueWithInternal, TipContent
} from "src/components/ui";
import {
  Filter,
  RelatedTransaction,
  RelatedTransactionType, RPCTransactionHarmony
} from "src/types";
import { TRelatedTransaction } from "src/api/client.interface";
import { getAddress, mapBlockchainTxToRelated } from "src/utils";
import { ExportToCsvButton } from "../../../components/ui/ExportToCsvButton";
import {
  hmyv2_getStakingTransactionsCount, hmyv2_getStakingTransactionsHistory,
  hmyv2_getTransactionsCount,
  hmyv2_getTransactionsHistory
} from "../../../api/rpc";
import { getColumns, getERC20Columns, getNFTColumns, getStackingColumns } from "./txsColumns";

const internalTxsBlocksFrom = 23000000

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
  onTxsLoaded?: (txs: RelatedTransaction[]) => void;
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

  const getTransactionsFromRPC = async (): Promise<RelatedTransaction[]> => {
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
      const txsFilter = {...filter[props.type]}
      if (props.type === 'internal_transaction') {
        txsFilter.filters = [{ type: "gte", property: "block_number", value: internalTxsBlocksFrom }]
      }
      txs = await getRelatedTransactionsByType([
        0,
        id,
        props.type,
        txsFilter,
      ]);
    }
    return txs
  }

  const loadTransactions = async () => {
    setIsLoading(true)
    try {
      let txs = await getTransactionsFromRPC()
      // let txs = []
      // const txsFilter = {...filter[props.type]}
      // if (props.type === 'internal_transaction') {
      //   txsFilter.filters = [{ type: "gte", property: "block_number", value: internalTxsBlocksFrom }]
      // }
      // txs = await getRelatedTransactionsByType([
      //   0,
      //   id,
      //   props.type,
      //   txsFilter,
      // ]);

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
    const getTxsCountFromRPC = async () => {
      try {
        if (props.type ==='transaction' || props.type === 'staking_transaction') {
          const count = props.type ==='transaction'
            ? await hmyv2_getTransactionsCount(id)
            : await hmyv2_getStakingTransactionsCount(id)
          setTotalElements(count)
          setCachedTotalElements({ ...cachedTotalElements, [props.type]: count })
        } else {
          setTotalElements(0)
        }
      } catch (e) {
        console.error('Cannot get txs count', (e as Error).message)
        setTotalElements(initTotalElements)
      }
    }

    const getTxsCount = async () => {
      try {
        const countFilter = {...filter[props.type]}
        // Note: internal_transactions index from & to supported only for block_number >= internalTxsBlocksFrom
        if (props.type === 'internal_transaction') {
          countFilter.filters = [{ type: "gte", property: "block_number", value: internalTxsBlocksFrom }]
        }
        const txsCount = await getRelatedTransactionsCountByType([
          0,
          id,
          props.type,
          countFilter,
        ])
        setTotalElements(txsCount)
        setCachedTotalElements({
          ...cachedTotalElements,
          [props.type]: txsCount
        })
      } catch (e) {
        console.error('Cannot get txs count', (e as Error).message)
        setTotalElements(initTotalElements)
      }
    }

    const cachedValue = cachedTotalElements[props.type]

    if (cachedValue && id === prevId) {
      setTotalElements(cachedValue)
    } else {
      getTxsCountFromRPC()
    }
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

    case "erc721": {
      columns = getNFTColumns(id)
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
        showPages={totalElements > 0}
      />
      {props.type === 'transaction' &&
        <Box style={{ alignItems: 'flex-end' }}>
          <ExportToCsvButton address={id} type={'transactions'} />
        </Box>
      }
    </Box>
  );
}
