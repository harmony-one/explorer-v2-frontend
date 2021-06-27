import React, { useState } from "react";
import { Box, Text } from "grommet";

interface ExpandStringProps {
  value: string;
  maxLength?: number;
}

// @ts-ignore
export const ExpandString = (props: ExpandStringProps) => {
  const [isFull, setIsFull] = useState(false);
  const { value, maxLength = 55 } = props;

  if (value.length < maxLength) {
    return <Text>{value}</Text>;
  }

  return (
    <Box direction="column">
      <Text size="small" style={{ wordBreak: "break-all", maxHeight: '40vh', overflowY: 'auto' }}>
        {isFull ? value : `${value.substr(0, 62)}...`}
      </Text>
      <Text
        size="small"
        color="brand"
        style={{
          flex: "0 0 auto",
          cursor: "pointer",
          textDecoration: "underline",
        }}
        onClick={() => setIsFull(!isFull)}
      >
        {isFull ? "show less" : "show full"}
      </Text>
    </Box>
  );
};
