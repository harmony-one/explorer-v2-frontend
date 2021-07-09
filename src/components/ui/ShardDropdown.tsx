import { Box } from "grommet";
import React from "react";
import { useThemeMode } from "src/hooks/themeSwitcherHook";
import { Dropdown } from "../dropdown/Dropdown";

export function ShardDropdown(props: {
  allShardsAvailable?: boolean;
  selected: string;
  onClick: (selected: string) => void;
}) {
  const themeMode = useThemeMode();

  return (
    <Dropdown
      themeMode={themeMode}
      itemHeight={"0px"}
      padDataList={"none"}
      items={
        [
props.allShardsAvailable ? { value: "All Shards" } : undefined,
          ...(process.env.REACT_APP_AVAILABLE_SHARDS?.split(",").map(
            (item) => ({
              value: item,
            })
          ) || []),
        ].filter((_) => _) as { value: string }[]
      }
      renderValue={(dataItem) => (
        <Box justify={"center"} style={{ paddingTop: "2px" }}>
          {dataItem.value === "All Shards"
            ? dataItem.value
            : `Shard ${dataItem.value}`}
        </Box>
      )}
      renderItem={(dataItem) => (
        <Box
          direction={"row"}
          align={"baseline"}
          style={{ 
            paddingLeft: "7px",
            marginBottom: "5px",
            marginTop: dataItem.value === "All Shards" ? "5px" : "0px",
          }}
        >
          {dataItem.value === "All Shards"

            ? dataItem.value
            : `Shard ${dataItem.value}`}
        </Box>
      )}
      onClickItem={(item) => props.onClick(item.value)}
      value={{ value: props.selected }}
      itemStyles={{}}
      keyField={"value"}
    />
  );
}
