import React, { useEffect, useState } from "react";
import { Box, Heading, Text } from "grommet";
import { BasePage, BaseContainer } from "src/components/ui";
import { TransactionsTable } from "../../components/tables/TransactionsTable";
import { Filter, RPCTransactionHarmony } from "../../types";
import { useHistory } from "react-router";
import { getTransactions, getCount } from "src/api/client";
import { ShardDropdown } from "src/components/ui/ShardDropdown";
import { useParams } from "react-router-dom";

export function AllTransactionsPage() {
  const initFilter: Filter = {
    offset: 0,
    limit: localStorage.getItem("tableLimitValue")
      ? +(localStorage.getItem("tableLimitValue") as string)
      : 10,
    orderBy: "block_number",
    orderDirection: "desc",
    filters: [{ type: "gte", property: "block_number", value: 0 }],
  };

  const [trxs, setTrxs] = useState<RPCTransactionHarmony[]>([]);
  const [count, setCount] = useState<string>("");
  const [filter, setFilter] = useState<Filter>(initFilter);

  // @ts-ignore
  const { shardNumber } = useParams();

  const history = useHistory();

  useEffect(() => {
    const getRes = async () => {
      try {
        let res = await getCount([+shardNumber, "transactions"]);
        setCount(res.count);
      } catch (err) {
        console.log(err);
      }
    };

    getRes().then(() => {
      const newFilter = JSON.parse(JSON.stringify(filter)) as Filter;
      const innerFilter = newFilter.filters.find(
        (i) => i.property === "block_number"
      );
      if (innerFilter && count) {
        innerFilter.value = +count;
      }

      setFilter(newFilter);
    });
  }, [shardNumber]);

  useEffect(() => {
    const getElements = async () => {
      try {
        let trxs = await getTransactions([+shardNumber, filter]);

        setTrxs(trxs as RPCTransactionHarmony[]);
      } catch (err) {
        console.log(err);
      }
    };
    getElements();
  }, [filter, shardNumber]);

  const { limit = 10 } = filter;

  return (
    <BaseContainer pad={{ horizontal: "0" }}>
      <Heading size="small" margin={{ bottom: "medium", top: "0" }}>
        Transactions
      </Heading>
      <BasePage pad={"small"} style={{ overflow: "inherit" }}>
        <Box style={{ width: "200px" }} direction={"row"} align={"center"}>
          <Text>Filter: </Text>
          <ShardDropdown
            selected={shardNumber}
            onClick={(shardNumber) =>
              history.push(`/transactions/shard/${shardNumber}`)
            }
          />
        </Box>
      </BasePage>
      <BasePage>
        <TransactionsTable
          data={trxs}
          totalElements={+count}
          limit={+limit}
          filter={filter}
          setFilter={(newFilter) => {
            if (newFilter.limit !== initFilter.limit) {
              localStorage.setItem("tableLimitValue", `${newFilter.limit}`);
            }

            setFilter(newFilter);
          }}
          primaryKey={"hash"}
        />
      </BasePage>
    </BaseContainer>
  );
}
