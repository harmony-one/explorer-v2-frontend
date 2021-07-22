import { Box, ColumnConfig, Text } from "grommet";
import React, { useEffect, useState } from "react";
import { getERC20TokenHolders } from "src/api/client";
import { IHoldersInfo, IUserERC721Assets } from "src/api/client.interface";
import { TransactionsTable } from "src/components/tables/TransactionsTable";
import { Address } from "src/components/ui";
import { Filter } from "src/types";

const getColumns = (): ColumnConfig<IHoldersInfo>[] => {
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
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "140px" }}
        >
          Balance
        </Text>
      ),
      render: (data) => (
        <Text size="small" style={{ width: "140px" }}>
          {data.balance}
        </Text>
      ),
    },
    {
      property: "Updated",
      header: (
        <Text color="minorText" size="small" style={{ fontWeight: 300 }}>
          Updated
        </Text>
      ),
      render: (data) => (
        <Text size="12px">
          {data.lastUpdateBlockNumber ? data.lastUpdateBlockNumber : "—"}
        </Text>
      ),
    },
  ];
};

export function HoldersTab(props: {
  id: string;
  type: "erc20" | "erc721" | "erc1155";
  inventory?: IUserERC721Assets[];
}) {
  const limitValue = localStorage.getItem("tableLimitValue");

  const initFilter: Partial<Filter> = {
    offset: 0,
    limit: limitValue ? +limitValue : 10,
  };

  const [filter, setFilter] = useState<Filter>({
    ...(initFilter as any),
  });

  const [holders, setHolders] = useState<any>([]);

  useEffect(() => {
    const getHolders = async () => {
      try {
        let holdersData: IHoldersInfo[] = [];

        if (props.type === "erc20") {
          holdersData = await getERC20TokenHolders([
            props.id,
            filter.limit || 10,
            filter.offset,
          ]);
        } else {
          if (props.inventory) {
            const existed = {} as any;
            holdersData = props.inventory
              .map((item) => {
                return {
                  tokenAddress: item.tokenAddress,
                  ownerAddress: item.ownerAddress || item.tokenID,
                  tokenID: item.tokenID,
                  needUpdate: item.needUpdate,
                  lastUpdateBlockNumber: item.lastUpdateBlockNumber,
                  balance:
                    props.inventory?.filter(
                      (inventory) =>
                        (inventory.ownerAddress || inventory.tokenID) ===
                        item.ownerAddress
                    ).length || 0,
                };
              })
              .filter((item) => {
                if (existed[item.ownerAddress || item.tokenID]) {
                  return false;
                } else {
                  existed[item.ownerAddress || item.tokenID] = true;
                  return true;
                }
              })
              .sort((a, b) => b.balance - a.balance)
              .slice(filter.offset, (filter.limit || 10) + filter.offset);
          } else {
            holdersData = [];
          }
        }

        setHolders(holdersData);
      } catch (err) {
        setHolders([]);
      }
    };
    getHolders();
  }, [props.id, filter.limit, filter.offset, props.inventory]);

  return (
    <Box style={{ padding: "10px" }}>
      <TransactionsTable
        columns={getColumns()}
        filter={filter}
        setFilter={setFilter}
        limit={filter.limit || 10}
        data={holders}
        totalElements={filter.limit || 10}
        noScrollTop
        minWidth="1266px"
      />
    </Box>
  );
}
