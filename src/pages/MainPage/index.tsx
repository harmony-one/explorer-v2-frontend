import React, { useEffect, useState } from "react";
import { Box, Text } from "grommet";
import { Button } from "src/components/ui";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { breakpoints } from "src/responsive/breakpoints";
import { BaseContainer, BasePage } from "src/components/ui";
import { Metrics } from "src/components/metrics";
import { LatestBlocksTable } from "./LatestBlocksTable";
import { LatestTransactionsTable } from "./LatestTransactionsTable";
import { Block } from "src/types";
import { getBlocks } from "src/api/client";
import { calculateSecondPerBlocks, calculateSecondsPerBlock } from "./helpers";
import { ShardDropdown } from "src/components/ui/ShardDropdown";
import { getTabHidden, useWindowFocused } from "src/hooks/useWindowFocusHook";

const filter = {
  offset: 0,
  limit: 10,
  orderBy: "number",
  orderDirection: "desc",
  value: 0,
  filters: [],
};

const ColumnHeader = (props: { children: JSX.Element }) => {
  return <Box
    height={'62px'}
    justify={"center"}
    pad={'16px'}
    border={{ size: "xsmall", side: "bottom" }}
  >
    {props.children}
  </Box>
}

export function MainPage() {
  const focus = useWindowFocused();

  const history = useHistory();
  const isLessDesktop = useMediaQuery({ maxDeviceWidth: breakpoints.desktop });

  const [selectedShard, setSelectedShard] = useState<string>("0");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockLatency, setBlockLatency] = useState<number>(2.01);

  const [blockLatencyMap, setBlockLatencyMap] = useState<number[]>([2.01]);
  const availableShards = (
    process.env.REACT_APP_AVAILABLE_SHARDS as string
  ).split(",");

  useEffect(() => {
    let tId = 0 as any;
    const exec = async () => {
      try {
        if (getTabHidden()) {
          // ignore if not focused, we don't load blocks ...
          return;
        }; 
        let allBlocks = [];
        let blocks = await Promise.all(
          selectedShard === "All Shards"
            ? availableShards.map((shardNumber) =>
                getBlocks([+shardNumber, filter])
              )
            : [getBlocks([+selectedShard, filter])]
        );

        if (selectedShard === "All Shards") {
          allBlocks = blocks;
        } else {
          allBlocks = await Promise.all(
            availableShards.map((shardNumber) =>
              getBlocks([+shardNumber, filter])
            )
          );
        }

        const blocksList = blocks.reduce((prev, cur, index) => {
          prev = [
            ...prev,
            ...cur.map((item) => ({
              ...item,
              shardNumber:
                selectedShard === "All Shards"
                  ? +availableShards[index]
                  : +selectedShard,
            })),
          ];
          return prev;
        }, []);

        setBlocks(
          blocksList
            .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
            .slice(0, 10)
        );

        setBlockLatency(calculateSecondPerBlocks(allBlocks));
        setBlockLatencyMap(calculateSecondsPerBlock(allBlocks));
      } catch (err) {
        console.log(err);
      }
    };

    exec();
    tId = window.setInterval(exec, 3000);

    return () => {
      clearTimeout(tId);
    };
  }, [selectedShard]);

  return (
    <BaseContainer pad="0">
      <Metrics latency={blockLatency} latencyPerBlock={blockLatencyMap} />
      <Box direction={isLessDesktop ? "column" : "row"} gap="medium">
        <BasePage style={{ flex: "1 1 100%" }} pad={'0'}>
          <ColumnHeader>
            <Box direction={"row"} align={"center"} justify={"between"}>
              <Text size="medium" weight="bold">Latest Blocks</Text>
              <Box style={{ maxWidth: "120px", minWidth: "120px" }} align={"start"}>
                <ShardDropdown
                  allShardsAvailable={true}
                  selected={selectedShard}
                  onClick={(shardNumber) => setSelectedShard(shardNumber)}
                />
              </Box>
            </Box>
          </ColumnHeader>
          <Box pad={'medium'}>
            <LatestBlocksTable blocks={blocks} />
            <Button
              margin={{ top: "medium" }}
              onClick={() => history.push("/blocks")}
            >
              VIEW ALL BLOCKS
            </Button>
          </Box>
        </BasePage>
        <BasePage style={{ flex: "1 1 100%" }} pad={'0'}>
          <ColumnHeader>
            <Box>
              <Text size="medium" weight="bold">Latest Transactions</Text>
            </Box>
          </ColumnHeader>
          <Box pad={'small'}>
            <LatestTransactionsTable />
            <Button
              margin={{ top: "medium" }}
              onClick={() => history.push("/transactions")}
            >
              VIEW ALL TRANSACTIONS
            </Button>
          </Box>
        </BasePage>
      </Box>
    </BaseContainer>
  );
}
