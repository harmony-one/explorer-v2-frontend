import React from "react";
import { Box, Heading, Text } from "grommet";
import { FiatPrice, BaseContainer } from "src/components/ui";
import { useHistory } from "react-router-dom";
import { ConfigureButton } from "./ConfigureButton";
import { InfoButton } from "./InfoButton";
import { useThemeMode } from "src/hooks/themeSwitcherHook";

import styled, { CSSProperties } from "styled-components";

const HeaderLine = (props: any) => {
  //@ts-ignore
  const isDark = useThemeMode() === "dark";

  return (
    <Box
      tag="header"
      direction="row"
      justify="center"
      background={isDark ? "background" : "brand"}
      pad={{ vertical: "small" }}
      elevation={isDark ? "none" : "medium"}
      style={{ zIndex: "1" }}
      {...props}
    />
  );
};

const ProjectName = styled(Box)`
  margin-left: 3px;
`;

export function AppHeader(props: { style: CSSProperties }) {
  const history = useHistory();

  return (
    <HeaderLine
      {...props}
      style={{ boxShadow: "0px 4px 8px rgb(0 0 0 / 12%)" }}
    >
      <BaseContainer direction="row" align="center" justify="between" flex>
        <Heading
          level="5"
          margin="none"
          style={{
            cursor: "pointer",
            color: "#fff",
          }}
          onClick={() => history.push("/")}
        >
          <Box direction={"row"} align={"center"}>
            <img src={require("../../assets/Logo.svg").default} />
            <ProjectName direction={"row"} align={'center'}>
              Harmony Block Explorer{" "}
              <Box
                background={"mintGreen"}
                style={{ borderRadius: "8px", height: "20px", marginLeft: '5px', padding: '1px 7px' }}
              >
                <Text size={"xsmall"}>beta</Text>
              </Box>
            </ProjectName>
          </Box>
          <FiatPrice />
        </Heading>
        <Box direction="row">
          <InfoButton />
          <ConfigureButton />
        </Box>
      </BaseContainer>
    </HeaderLine>
  );
}
