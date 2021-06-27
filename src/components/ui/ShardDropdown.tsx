import { Box } from "grommet";
import React from "react";
import { useThemeMode } from "src/hooks/themeSwitcherHook";
import { Dropdown } from "../dropdown/Dropdown";

export function ShardDropdown(props: {
  selected: string;
  onClick: (selected: string) => void;
}) {
  const themeMode = useThemeMode();

  return (
    <Dropdown
      themeMode={themeMode}
      itemHeight={"30px"}
      items={
        process.env.REACT_APP_AVAILABLE_SHARDS?.split(",").map((item) => ({
          value: item,
        })) || []
      }
      renderValue={(dataItem) => (
        <Box
          justify={"center"}
          style={{ paddingTop: "2px" }}
        >{`Shard ${dataItem.value}`}</Box>
      )}
      renderItem={(dataItem) => <>{`Shard ${dataItem.value}`}</>}
      onClickItem={(item) => props.onClick(item.value)}
      value={{ value: props.selected }}
      itemStyles={{}}
      keyField={"value"}
    />
  );
}
