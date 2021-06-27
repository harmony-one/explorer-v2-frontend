import React, { useEffect } from "react";
import "./index.css";
import { Box, Grommet } from "grommet";
import { BrowserRouter as Router, useHistory } from "react-router-dom";

import { Routes } from "src/Routes";
import { AppHeader } from "src/components/appHeader";
import { AppFooter } from "src/components/appFooter";

import { SearchInput, BaseContainer } from "src/components/ui";
import { ONE_USDT_Rate } from "src/components/ONE_USDT_Rate";
import { ERC20_Pool } from "src/components/ERC20_Pool";
import { ERC721_Pool } from "src/components/ERC721_Pool";
import { ERC1155_Pool } from "src/components/ERC1155_Pool";
import { useThemeMode } from "src/hooks/themeSwitcherHook";
import { theme, darkTheme } from "./theme";
import { Toaster, ToasterComponent } from "./components/ui/toaster";

export const toaster = new Toaster();

function App() {
  return (
    <Router>
      <AppWithHistory />
    </Router>
  );
}

let prevAddress = document.location.pathname;

function AppWithHistory() {
  const themeMode = useThemeMode();
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      if (prevAddress !== location.pathname) {
        prevAddress = location.pathname;
        const scrollBody = document.getElementById("scrollBody");
        if (scrollBody) {
          scrollBody.scrollTo({ top: 0 });
        }
      }
    });
    return () => {
      unlisten();
    };
  }, []);

  document.body.className = themeMode;

  return (
    <Grommet
      theme={themeMode === "light" ? theme : darkTheme}
      themeMode={themeMode}
      full
      id="scrollBody"
    >
      <ToasterComponent toaster={toaster} />
      <ERC20_Pool />
      <ERC721_Pool />
      <ERC1155_Pool />
      <Box
        background="backgroundBack"
        style={{ margin: "auto", minHeight: "100%" }}
      >
        <AppHeader style={{ flex: "0 0 auto" }} />
        <Box align="center" style={{ flex: "1 1 100%" }}>
          <BaseContainer>
            <SearchInput />
            <Routes />
          </BaseContainer>
        </Box>
        <AppFooter style={{ flex: "0 0 auto" }} />
        <ONE_USDT_Rate />
      </Box>
    </Grommet>
  );
}

export default App;
