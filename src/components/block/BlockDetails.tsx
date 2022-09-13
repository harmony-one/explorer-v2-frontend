import React, { FunctionComponent, useEffect, useState } from "react";
import { Block } from "../../types";
import {
  blockPropertyDisplayNames,
  blockPropertySort,
  blockPropertyDescriptions,
  blockDisplayValues,
} from "./helpers";
import { TipContent } from "src/components/ui";
import {Box, DataTable, Tip, Anchor, Text, Select} from "grommet";
import { CircleQuestion, CaretDownFill, CaretUpFill } from "grommet-icons";
import { useWindowFocused } from "src/hooks/useWindowFocusHook";
import { config } from "../../config";
const { availableShards } = config

const columns = [
  {
    property: "key",
    render: (e: any) => (
      <div>
        <Tip
          dropProps={{ align: { left: "right" } }}
          content={<TipContent message={blockPropertyDescriptions[e.key]} />}
        >
          <span>
            <CircleQuestion size="small" />
          </span>
        </Tip>
        &nbsp;{blockPropertyDisplayNames[e.key] || e.key}
      </div>
    ),
    size: "1/3",
  },
  {
    property: "value",
    size: "2/3",
    render: (e: any) => e.value,
  },
];

type BlockDetailsProps = {
  block: Block;
  blockShardId: number;
  isShardIdSelectAvailable?: boolean;
  onSelectShardId?: (shardId: number) => void;
};
type tableEntry = {
  key: string;
  value: any;
};

interface ShardIdSelectProps {
  blockShardId: number
  onSelectShardId?: (shardId: number) => void
}

const ShardIdSelect = (props: ShardIdSelectProps) => {
  const {blockShardId, onSelectShardId = () => {}} = props
  const value = blockShardId.toString()
  const options = availableShards.map((id) => id.toString())
  const renderOption = (option: string) => <Box pad={'small'}><Text size={'small'}>Shard {option}</Text></Box>

  return <Box width={'xsmall'} style={{ fontSize: 'small' }}>
    <Select
        options={options}
        value={value}
        onChange={({ option }) => onSelectShardId(+option)}
        disabled={false}
    >
      {renderOption}
    </Select>
  </Box>
}

export const BlockDetails: FunctionComponent<BlockDetailsProps> = ({
  block,
  blockShardId,
  isShardIdSelectAvailable = false,
  onSelectShardId
}) => {
  const [showDetails, setShowDetails] = useState(true);
  const [isNewAddress, setIsNewAddress] = useState<boolean>(false);
  const focus = useWindowFocused();

  useEffect(() => {
    let tId = 0;
    const getActiveIndex = () => {
      setIsNewAddress(true);
      tId = window.setTimeout(() => setIsNewAddress(false), 1000);
    };
    getActiveIndex();

    return () => clearTimeout(tId);
  }, [block]);

  const keys = Object.keys({ ...block, shard: blockShardId });
  const sortedKeys = keys.sort(
    (a, b) => blockPropertySort[b] - blockPropertySort[a]
  );
  const shardIdView = isShardIdSelectAvailable
      ? <ShardIdSelect blockShardId={blockShardId} onSelectShardId={onSelectShardId} />
      : <Text size={"small"}>{blockShardId}</Text>
  // show 8 till gas used
  const filteredKeys = sortedKeys.filter((k, i) => showDetails || i < 8);
  const blockData = filteredKeys.reduce((arr, key) => {
    // @ts-ignore
    const value =
      key === "shard"
          ? shardIdView
          : (
        blockDisplayValues(block, key, (block as any)[key], isNewAddress)
      );

    arr.push({ key, value } as tableEntry);
    return arr;
  }, [] as tableEntry[]);

  return (
    <>
      <Box
        flex
        align="stretch"
        justify="start"
        margin={{ top: "-42px" }}
        style={{ overflow: "auto" }}
      >
        <DataTable
          className={"g-table-body-last-col-right"}
          style={{ width: "100%", minWidth: "698px" }}
          columns={columns}
          data={blockData}
          step={50}
          border={{
            header: false,
            body: {
              color: "border",
              side: "bottom",
              size: "1px",
            },
          }}
        />
        <Box align="center" justify="center">
          <Anchor
            onClick={() => setShowDetails(!showDetails)}
            margin={{ top: "medium" }}
          >
            {showDetails ? (
              <>
                Show less&nbsp;
                <CaretUpFill size="small" />
              </>
            ) : (
              <>
                Show more&nbsp;
                <CaretDownFill size="small" />
              </>
            )}
          </Anchor>
        </Box>
      </Box>
    </>
  );
};
