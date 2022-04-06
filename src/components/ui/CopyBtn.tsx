import { Clone, StatusGood } from "grommet-icons";
import React from "react";
import { toaster } from "../../App";
import { Box, Text } from "grommet";
import styled from "styled-components";
import { copyTextToClipboard } from "../../utils";

const Icon = styled(StatusGood)`
  margin-right: 5px;
`;

const showToasterNotification = () => {
  toaster.show({
    message: () => (
      <Box direction={"row"} align={"center"} pad={"small"}>
        <Icon size={"small"} color={"headerText"}/>
        <Text size={"small"}>Copied to clipboard</Text>
      </Box>
    )
  })
}

export function CopyBtn(props: {
  value: string;
  showNotification?: boolean;
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
}) {

  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    copyTextToClipboard(props.value);
    if (props.onClick) {
      props.onClick(e);
    }
    if (props.showNotification) {
      showToasterNotification()
    }
  }
  return (
    <Clone
      size="small"
      color="brand"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    />
  );
}
