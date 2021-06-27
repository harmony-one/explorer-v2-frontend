import { BlockDetails } from "src/components/block/BlockDetails";
import { Block } from "../types";
import { useParams } from "react-router-dom";
import { BasePage } from "src/components/ui";
import { getBlockByNumber, getBlockByHash } from "src/api/client";

import React, { useEffect, useState } from "react";
import { Heading } from "grommet";

export const BlockPage = () => {
  // hash or number
  // @ts-ignore
  const { id } = useParams();
  const [block, setBlock] = useState<Block | null>(null);
  const [blockNumber, setBlockNumber] = useState<number>(0);

  const availableShards = (process.env.REACT_APP_AVAILABLE_SHARDS as string)
    .split(",")
    .map((t) => +t);

  useEffect(() => {
    let cleanupFunction = false;

    const exec = async () => {
      let block;
      if ("" + +id === id) {
        try {
          block = await getBlockByNumber([0, +id]);
          setBlockNumber(0);
        } catch {
          try {
            if (!block && availableShards.find((i) => i === 1)) {
              block = await getBlockByNumber([1, +id]);
              setBlockNumber(1);
            }
          } catch {
            try {
              if (!block && availableShards.find((i) => i === 2)) {
                block = await getBlockByNumber([2, +id]);
                setBlockNumber(2);
              }
            } catch {
              if (!block && availableShards.find((i) => i === 3)) {
                block = await getBlockByNumber([3, +id]);
                setBlockNumber(3);
              }
            }
          }
        }
      } else {
        try {
          block = await getBlockByHash([0, id]);
          setBlockNumber(0);
        } catch {
          try {
            if (!block && availableShards.find((i) => i === 1)) {
              block = await getBlockByHash([1, id]);
              setBlockNumber(1);
            }
          } catch {
            try {
              if (!block && availableShards.find((i) => i === 2)) {
                block = await getBlockByHash([2, id]);
                setBlockNumber(2);
              }
            } catch {
              if (!block && availableShards.find((i) => i === 3)) {
                block = await getBlockByHash([3, id]);
                setBlockNumber(3);
              }
            }
          }
        }
      }
      if (!cleanupFunction) {
        setBlock(block as Block);
      }
    };
    exec();

    return () => {
      cleanupFunction = true;
    };
  }, [id]);

  if (!block) {
    return null;
  }

  return (
    <>
      <Heading size="xsmall" margin={{ top: "0" }}>
        Block <b>#{block.number}</b>
      </Heading>
      <BasePage>
        <BlockDetails block={block} blockNumber={blockNumber} />
      </BasePage>
    </>
  );
};
