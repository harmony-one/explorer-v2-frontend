import React, { useEffect, useRef, useState } from "react";
import { Box } from "grommet";
import { useParams, useHistory } from "react-router-dom";
import {
  getByteCodeSignatureByHash,
  getRelatedTransactionsByType,
  getRelatedTransactionsCountByType
} from "src/api/client";
import { TransactionsTable } from "src/components/tables/TransactionsTable";
import {
  Filter, FilterProperty, FilterType,
  RelatedTransaction,
} from "src/types";
import { TRelatedTransaction } from "src/api/client.interface";
import {getAddress} from "src/utils";
import { ExportToCsvButton } from "../../../../components/ui/ExportToCsvButton";
import { getColumns, getERC20Columns, getNFTColumns, getStakingColumns } from "./columns";
import useQuery from "../../../../hooks/useQuery";

const internalTxsBlocksFrom = 23000000
const allowedLimits = [10, 25, 50, 100]

const prepareFilter = (type: TRelatedTransaction, filter: Filter) => {
  if (type === 'internal_transaction') {
    filter.filters = [...filter.filters, {
      type: "gte", property: "block_number", value: internalTxsBlocksFrom
    }]
  }

  return {
    ...filter,
    filters: filter.filters.map(item => {
      if(item.property === 'to') {
        const value = item.value as string
        let address = value
        if(value.startsWith('one1')) { // convert one1 to 0x before send request to backend
          try {
            address = getAddress(value as string).basicHex
          } catch (e) {}
        }
        return {
          ...item,
          value: `'${address}'`
        }
      }
      return item
    })
  }
}

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
  const history = useHistory()
  const queryParams = useQuery();
  let limitParam = +(queryParams.get('limit') || localStorage.getItem("tableLimitValue") || allowedLimits[0]);
  const offsetParam = +(queryParams.get('offset') || 0)
  const toParam = queryParams.get('to') || ''

  if (!allowedLimits.includes(limitParam)) {
    limitParam = allowedLimits[0]
  }

  const initFilter: Filter = {
    offset: offsetParam,
    limit: limitParam,
    orderBy: "block_number",
    orderDirection: "desc",
    filters: [],
  };

  const initFilterState = {
    transaction: { ...initFilter },
    staking_transaction: { ...initFilter },
    internal_transaction: { ...initFilter },
    erc20: { ...initFilter },
    erc721: { ...initFilter },
    erc1155: { ...initFilter },
  }

  const filterOnLoad = {...initFilterState}

  if(toParam) {
    filterOnLoad[props.type].filters.push({
      type: 'eq' as FilterType,
      property: 'to' as FilterProperty,
      value: toParam.toLowerCase()
    })
  }

  const initTotalElements = 100
  const [cachedTxs, setCachedTxs] = useState<{ [name: string]: RelatedTransaction[]}>({})
  const [relatedTrxs, setRelatedTrxs] = useState<RelatedTransaction[]>([]);
  const [totalElements, setTotalElements] = useState<number>(initTotalElements)
  const [cachedTotalElements, setCachedTotalElements] = useState<{ [name: string]: number}>({})
  const [filter, setFilter] = useState<{ [name: string]: Filter }>(filterOnLoad);
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
      const txsFilter = prepareFilter(props.type, filter[props.type])
      txs = await getRelatedTransactionsByType([
        0,
        id,
        props.type,
        txsFilter,
      ]);

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
    const getTxsCount = async () => {
      try {
        const countFilter = prepareFilter(props.type, filter[props.type])
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
      getTxsCount()
    }
  }, [props.type, id])

  // Change active tab
  useEffect(() => {
    // If tab changed (and not initially loaded), drop offset to zero
    if (prevType) {
      setFilter({
        ...initFilterState,
        [props.type]: {
          ...initFilter,
          offset: 0
        }
      })
    }
    if (cachedTxs[props.type]) {
      setRelatedTrxs(cachedTxs[props.type]);
    } else {
      loadTransactions()
    }
  }, [props.type])

  // Change params: offset, limit
  useEffect(() => {
    if (prevType === props.type) {
      loadTransactions()
    }
  }, [filter[props.type], id]);

  let columns = [];
  const filterTo = filter[props.type].filters.find(item => item.property === 'to')

  switch (props.type) {
    case "staking_transaction": {
      columns = getStakingColumns(id);
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
      columns = getColumns(id, {
        'to': {
          value: filterTo ? filterTo.value.toString() : '',
          onApply: (value = '') => {
            const filters = filter[props.type].filters.filter(item => item.property !== 'to')
            if (value) {
              filters.push({
                type: 'eq' as FilterType,
                property: 'to' as FilterProperty,
                value: value.toLowerCase()
              })
            }
            onFilterChanged({
              ...filter[props.type],
              filters
            })
          }
        }
      });
      break;
    }
  }

  const onFilterChanged = (value: Filter) => {
    const { offset, limit, filters } = value
    if (limit !== filter[props.type].limit) {
      localStorage.setItem("tableLimitValue", `${limit}`);
    }
    setFilter({ ...filter, [props.type]: value });
    const activeTab = queryParams.get('activeTab') || 0

    let historyUrl = `?activeTab=${activeTab}&offset=${offset}&limit=${limit}`

    const filterTo = filters.find(item => item.property === 'to')
    if(filterTo) {
      historyUrl += `&to=${filterTo.value}`
    }

    history.push(historyUrl)
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
        setFilter={onFilterChanged}
        noScrollTop
        minWidth="1266px"
        hideCounter
        rowDetails={props.rowDetails}
        showPages={totalElements > 0}
      />
      {['transaction', 'erc20', 'erc721', 'erc1155'].includes(props.type) &&
        <Box style={{ alignItems: 'flex-end' }}>
          <ExportToCsvButton address={id} type={props.type} />
        </Box>
      }
    </Box>
  );
}
