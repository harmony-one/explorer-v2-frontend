import React, { FunctionComponent, useState } from "react";
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

const columns = [
  {
    property: "key",
    render: (e: any) => (
      <Box direction={"row"} align={"center"} justify={"start"}>
        <Tip
          dropProps={{ align: { left: "right" } }}
          content={<TipContent message={blockPropertyDescriptions[e.key]} />}
          plain
        >
          <span style={{ marginTop: "3px" }}>
            <CircleQuestion size="small" />
          </span>
        </Tip>
        &nbsp;{blockPropertyDisplayNames[e.key] || e.key}
      </Box>
    ),
    size: "1/3",
  },
  {
    property: "value",
    size: "2/3",
    render: (e: any) => (
      <Box align={"center"} justify={"start"} direction={"row"}>
        {e.value}
      </Box>
    ),
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
        blockDisplayValues(block, key, (block as any)[key])
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
