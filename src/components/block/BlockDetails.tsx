import React, { FunctionComponent, useEffect, useState } from "react";
import { Block } from "../../types";
import {
  blockPropertyDisplayNames,
  blockPropertySort,
  blockPropertyDescriptions,
  blockDisplayValues,
} from "./helpers";
import { TipContent } from "src/components/ui";
import { Box, DataTable, Tip, Anchor, Text } from "grommet";

import { CircleQuestion, CaretDownFill, CaretUpFill } from "grommet-icons";
import { useWindowFocused } from "src/hooks/useWindowFocusHook";

const columns = [
  {
    property: "key",
    render: (e: any) => (
      <div>
        <Tip
          dropProps={{ align: { left: "right" } }}
          content={<TipContent message={blockPropertyDescriptions[e.key]} />}
          plain
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
  blockNumber: number;
};
type tableEntry = {
  key: string;
  value: any;
};

export const BlockDetails: FunctionComponent<BlockDetailsProps> = ({
  block,
  blockNumber,
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

  const keys = Object.keys({ ...block, shard: blockNumber });
  const sortedKeys = keys.sort(
    (a, b) => blockPropertySort[b] - blockPropertySort[a]
  );
  // show 8 till gas used
  const filteredKeys = sortedKeys.filter((k, i) => showDetails || i < 8);
  const blockData = filteredKeys.reduce((arr, key) => {
    // @ts-ignore
    const value =
      key === "shard" ? (
        <Text size={"small"}>{blockNumber}</Text>
      ) : (
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
          step={10}
          border={{
            header: {
              color: "none",
            },
            body: {
              color: "border",
              side: "top",
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
