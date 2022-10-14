import React, {useState} from "react";
import { Box, Heading, Text } from "grommet";
import { useMediaQuery } from 'react-responsive'
import { FiatPrice, BaseContainer } from "src/components/ui";
import { useHistory } from "react-router-dom";
import { ConfigureButton } from "./ConfigureButton";
import { InfoButton } from "./InfoButton";
import { useThemeMode } from "src/hooks/themeSwitcherHook";
import styled, { CSSProperties } from "styled-components";
import { AddressFormatSwitch } from "./AddressFormatSwitch";
import { ToolsButton } from "./ToolsButton";
import { ResourcesButton } from "./ResourcesButton";
import {MenuMobile} from "./MenuMobile";
import {Menu, Close} from "grommet-icons";

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
  margin-top: 7px;
  margin-left: 7px;
  font-size: 1.2em;
  line-height: 0.7em;
`;

export function AppHeader(props: { style: CSSProperties }) {
  const history = useHistory();
  const [isMenuMobileOpened, setMenuMobileOpened] = useState(false)
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 960px)' })

  return (
    <Box>
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
              {!isTabletOrMobile &&
                  <ProjectName direction={"column"} align={"start"}>
                    Harmony
                    <Text size={"small"}>Block Explorer</Text>
                  </ProjectName>
              }
            </Box>
          </Heading>
          <Box direction="row">
            <Box direction="row" align={'center'}>
              {!isTabletOrMobile &&
                  <Box alignSelf={'center'} margin={'0 16px 0 0'}>
                    <Text size={'small'} color="headerText">Address Format</Text>
                  </Box>
              }
              <AddressFormatSwitch />
            </Box>
            {!isTabletOrMobile &&
                <Box direction="row" align={'center'}>
                  <InfoButton />
                  <ResourcesButton />
                  <ToolsButton />
                  <ConfigureButton />
                </Box>
            }
            {isTabletOrMobile &&
                <Box justify={'center'} margin={{ left: 'large' }}>
                    {isMenuMobileOpened && <Close size={'medium'} color={'white'} onClick={() => setMenuMobileOpened(false)} /> }
                    {!isMenuMobileOpened && <Menu size={'medium'} color={'white'} onClick={() => setMenuMobileOpened(true)} /> }
                </Box>
            }
          </Box>
        </BaseContainer>
      </HeaderLine>
      {isTabletOrMobile &&
          <MenuMobile isOpened={isMenuMobileOpened} onClose={() => setMenuMobileOpened(false)} />
      }
    </Box>
  );
}
