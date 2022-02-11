import { Box, ColumnConfig, Text } from "grommet";
import React, { useEffect, useState } from "react";
import { getERC20TokenHolders } from "src/api/client";
import { IHoldersInfo, IUserERC721Assets } from "src/api/client.interface";
import { TransactionsTable } from "src/components/tables/TransactionsTable";
import { Address, TokenValue } from "src/components/ui";
import { useERC1155Pool } from "src/hooks/ERC1155_Pool";
import { useERC20Pool } from "src/hooks/ERC20_Pool";
import { useERC721Pool } from "src/hooks/ERC721_Pool";
import { Filter } from "src/types";
import Big from "big.js";

const getColumns = (
  id: string,
  type: "erc20" | "erc721" | "erc1155"
): ColumnConfig<IHoldersInfo>[] => {
  const columns = [
    {
      property: "rank",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300, width: "30px" }}
        >
          Rank
        </Text>
      ),
      render: (data: any) => <div>{data.rank}</div>,
    },
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
      render: (data: any) => {
        return type === "erc1155" ? (
          <>{data.balance}</>
        ) : (
          <TokenValue value={data.balance} tokenAddress={id} />
        );
      },
    },
  ];

  if (type === 'erc20' || type === 'erc721') {
    columns.push(    {
      property: "percentage",
      header: (
        <Text
          color="minorText"
          size="small"
          style={{ fontWeight: 300 }}
        >
          Percentage
        </Text>
      ),
      render: (data: any) => <div>{data.percentage}</div>,
    })
  }

  return columns
};

export function HoldersTab(props: {
  id: string;
  type: "erc20" | "erc721" | "erc1155";
  inventory?: IUserERC721Assets[];
}) {
  const erc20Map = useERC20Pool();
  const erc721Map = useERC721Pool();
  const erc1155Map = useERC1155Pool();

  const holdersTotal =
    erc20Map[props.id]?.holders ||
    erc721Map[props.id]?.holders ||
    erc1155Map[props.id]?.holders;

  const totalSupply =
    erc20Map[props.id]?.totalSupply ||
    erc721Map[props.id]?.totalSupply ||
    erc1155Map[props.id]?.totalSupply;

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

        holdersData = holdersData.map((item, index) => {
          return {
            ...item,
            rank: filter.offset + index + 1,
            percentage: totalSupply && +totalSupply > 0
              ? Big(item.balance).div(Big(totalSupply)).mul(100).toFixed(4) + '%'
              : ''
          }
        })

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
        columns={getColumns(props.id, props.type)}
        filter={filter}
        hideCounter={false}
        setFilter={setFilter}
        limit={filter.limit || 10}
        data={holders}
        totalElements={+holdersTotal}
        noScrollTop
        minWidth="1266px"
        showPages={true}
        textType={"holder"}
      />
    </Box>
  );
}
