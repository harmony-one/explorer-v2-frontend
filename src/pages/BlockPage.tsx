import { BlockDetails } from "src/components/block/BlockDetails";
import { Block } from "../types";
import { useParams } from "react-router-dom";
import { BasePage } from "src/components/ui";
import { getBlockByNumber, getBlockByHash } from "src/api/client";

import React, { useEffect, useState } from "react";
import { Heading } from "grommet";
import { config } from "../config";
const { availableShards } = config

export const BlockPage = () => {
  // hash or number
  // @ts-ignore
  const { id } = useParams();
  const [isBlockLoading, setBlockLoading] = useState(false);
  const [block, setBlock] = useState<Block | null>(null);
  const [blockShardId, setBlockShardId] = useState<null | number>(null)

  const isIdParamNumber = "" + +id === id

  useEffect(() => {
    let isBlockFetching = true;

    const findBlock = async () => {
      const shardsList = blockShardId === null
          ? [...availableShards]  // Search in all available shards
          : [blockShardId]        // Search in specific shardId
      setBlock(null)
      setBlockLoading(true)
      for(let i=0; i < shardsList.length; i++) { // Search block on each shard until it will be found or not
        const shardId = shardsList[i]
        try {
          if (isBlockFetching) {
            const blockData = isIdParamNumber
                ? await getBlockByNumber([shardId, +id])
                : await getBlockByHash([shardId, id]);
            setBlock(blockData as Block);
            setBlockShardId(shardId);
            break
          } else {
            break
          }
        } catch (e) {
          console.log(`Block with id/hash "${id}" not found on shard "${shardId}"`)
        }
      }
      setBlockLoading(false)
    }

    findBlock();

    return () => {
      isBlockFetching = false
    };
  }, [id, blockShardId]);

  if (!block) {
    if (!isIdParamNumber) {
      return null
    }
    const blockDetails = { number: id } as Block
    return (
        <>
          <Heading size="xsmall" margin={{ top: "0" }}>
            Block <b>#{id}</b>
          </Heading>
          <BasePage>
            <BlockDetails
                block={blockDetails}
                blockShardId={blockShardId || 0}
                isShardIdSelectAvailable={isIdParamNumber}
                onSelectShardId={(shardId: number) => setBlockShardId(shardId)}
            />
          </BasePage>
        </>
    );
  }

  return (
    <>
      <Heading size="xsmall" margin={{ top: "0" }}>
        Block <b>#{block.number}</b>
      </Heading>
      <BasePage>
        <BlockDetails
            block={block}
            blockShardId={blockShardId || 0}
            isShardIdSelectAvailable={isIdParamNumber}
            onSelectShardId={(shardId: number) => setBlockShardId(shardId)}
        />
      </BasePage>
    </>
  );
};
