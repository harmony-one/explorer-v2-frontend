import { Box, Text } from "grommet";
import styled from "styled-components";
import React, { useState } from "react";
import { TokenApprovals } from "./TokenApprovals";

const TabBox = styled(Box) <{ selected: boolean }>`
  border: 1px solid ${(props) => props.theme.global.colors.border};
  background: ${(props) =>
    props.selected ? props.theme.global.colors.backgroundBack : "transparent"};
  padding: 7px 12px 6px 12px;
  border-radius: 4px;
  margin: 5px 10px;
`;
const TabButton = (props: {
  text: string;
  onClick: () => void;
  selected: boolean;
}) => {
  return (
    <TabBox onClick={props.onClick} selected={props.selected}>
      <Text size="small" color={"minorText"}>
        {props.text}
      </Text>
    </TabBox>
  );
};

enum V_TABS {
  APPROVAL = "Token Approval"
}

export function ToolsTab(props: {
  contractAddress: string;
  showTools?: boolean | null
}) {
  const [tab, setTab] = useState<V_TABS>(V_TABS.APPROVAL);

  return (
    <Box direction="column">

      {props.showTools && <Box direction="row" align="center" margin={{ top: "medium", bottom: "medium" }}>
        <TabButton
          text={V_TABS.APPROVAL}
          onClick={() => { setTab(V_TABS.APPROVAL) }}
          selected={V_TABS.APPROVAL === tab}
        />
      </Box>}

      {tab === V_TABS.APPROVAL && <TokenApprovals contractAddress={props.contractAddress}/>}
      
    </Box>
  );
}
