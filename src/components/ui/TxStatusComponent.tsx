import React from "react";
import { Box, Text } from "grommet";
import { CircleAlert, StatusGood } from "grommet-icons";

export function TxStatusComponent(props: { msg?: string }) {
  const { msg } = props;
  return msg ? (
    <Box direction={"row"} align={"center"}>
      <Box
        align={"center"}
        direction={"row"}
        background="backgroundError"
        style={{ borderRadius: "6px", marginRight: "10px", padding: "3px 8px" }}
      >
        <CircleAlert color={"errorText"} size={"small"} />
        <Text color={"errorText"} size={"small"} style={{ marginLeft: "5px" }}>
          Error
        </Text>
      </Box>
      <Text color={"errorText"} size={"xsmall"}>
        {msg}
      </Text>
    </Box>
  ) : (
    <Box
      direction={"row"}
      align={"center"}
      background={"backgroundSuccess"}
      style={{ borderRadius: "6px", marginRight: "10px", padding: "3px 8px" }}
    >
      <StatusGood color={"successText"} size={"small"} />
      <Text color={"successText"} size={"small"} style={{ marginLeft: "5px" }}>
        Success
      </Text>
    </Box>
  );
}
