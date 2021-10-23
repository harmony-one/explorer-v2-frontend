import { Box, ColumnConfig, Text } from "grommet";
import React, { useState } from "react";
import { useWorker } from "@koale/useworker";
import useDeepCompareEffect from 'use-deep-compare-effect'
import { getERC20TokenHolders } from "src/api/client";
import { IHoldersInfo, IUserERC721Assets } from "src/api/client.interface";
import { TransactionsTable } from "src/components/tables/TransactionsTable";
import { Address, TokenValue } from "src/components/ui";
import { useERC1155Pool } from "src/hooks/ERC1155_Pool";
import { useERC20Pool } from "src/hooks/ERC20_Pool";
import { useERC721Pool } from "src/hooks/ERC721_Pool";
import { getHoldersFromInventory } from "src/utils";
import { Filter } from "src/types";

const getColumns = (
  id: string,
  type: "erc20" | "erc721" | "erc1155"
): ColumnConfig<IHoldersInfo>[] => {
  return [
    {
      property: "ownerAddres",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "320px" }}
        >
          Address
        </Text>
      ),
      render: (data: any) => <Address address={data.ownerAddress} />,
    },
    {
      property: "balance",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Balance
        </Text>
      ),
      render: (data) => {
        return type === "erc1155" ? (
          <>{data.balance}</>
        ) : (
          <TokenValue value={data.balance} tokenAddress={id} />
        );
      },
    },
  ];
};

export function HoldersTab(props: {
  id: string;
  type: "erc20" | "erc721" | "erc1155";
  inventory?: IUserERC721Assets[] | null;
}) {
  const erc20Map = useERC20Pool();
  const erc721Map = useERC721Pool();
  const erc1155Map = useERC1155Pool();

  const holdersTotal =
    erc20Map[props.id]?.holders ||
    erc721Map[props.id]?.holders ||
    erc1155Map[props.id]?.holders;

  const limitValue = localStorage.getItem("tableLimitValue");

  const [loadHoldersFromInventory] = useWorker(getHoldersFromInventory);

  const initFilter: Partial<Filter> = {
    offset: 0,
    limit: limitValue ? +limitValue : 10,
  };

  const [filter, setFilter] = useState<Filter>({
    ...(initFilter as any),
  });

  const [holders, setHolders] = useState<any>([]);
  const [holdersInventory, setHoldersInventory] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(props.type !== "erc20");

  useDeepCompareEffect(() => {
    const getHoldersInventory = async () => {
      if (props.inventory) {
        const holdersData = await loadHoldersFromInventory({
          inventory: props.inventory
        })
        setHoldersInventory(holdersData);
      }
    }
    getHoldersInventory();
  },[props.inventory]);

  useDeepCompareEffect(() => {
    const getHolders = async () => {
      try {
        let holdersData: IHoldersInfo[] = [];
        if (props.type === "erc20") {
          setIsLoading(true);
          holdersData = await getERC20TokenHolders([
            props.id,
            filter.limit || 10,
            filter.offset,
          ]);
          setIsLoading(false);
        } else {
          if (holdersInventory.length > 0) {
            holdersData = holdersInventory.slice(filter.offset, (filter.limit || 10) + filter.offset);
            setIsLoading(false);
          } else {
            holdersData = [];
          }
        }
        setHolders(holdersData);
      } catch (err) {
        setHolders([]);
        setIsLoading(false);
      }
    };
    getHolders();
  }, [props.id, props.type, filter.limit, filter.offset, holdersInventory]);

  return (
    <Box style={{ padding: "10px" }}>
      <TransactionsTable
        columns={getColumns(props.id, props.type)}
        filter={filter}
        hideCounter={false}
        setFilter={setFilter}
        limit={filter.limit || 10}
        data={holders}
        totalElements={+holdersTotal}
        noScrollTop
        minWidth="1266px"
        isLoading={isLoading}
        showPages={true}
        textType={"holder"}
      />
    </Box>
  );
}
