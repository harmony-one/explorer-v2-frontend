import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { BlockPage } from "src/pages/BlockPage";
import { MainPage } from "src/pages/MainPage";
import { TransactionPage } from "src/pages/TransactionPage";
import { StakingTransactionPage } from "src/pages/StackingTransactionPage";
import { AllBlocksPage } from "src/pages/AllBlocksPage";
import { AllTransactionsPage } from "src/pages/AllTransactionsPage";
import { AddressPage } from "src/pages/AddressPage";
import { ERC20List } from "src/pages/ERC20List";
import { ERC721List } from "src/pages/ERC721List";
import { VerifyContract } from "./pages/VerifyContract/VerifyContract";
import { ERC1155List } from "./pages/ERC1155List";
import { ExportData } from "./pages/ExportData";
import { InventoryDetailsPage } from "./pages/InventoryDetailsPage/InventoryDetailsPage";
import { ApprovalPage } from "./pages/ApprovalPage";
import { CheckHRC } from "./pages/tools/CheckHRC";

export function Routes() {
  return (
    <>
      <Switch>
        <Route exact path="/">
          <MainPage />
        </Route>

        <Route exact path="/blocks">
          {/* <AllBlocksPage /> */}
          <Redirect to="/blocks/shard/0" />
        </Route>

        <Route exact path="/blocks/shard/:shardNumber">
          <AllBlocksPage />
        </Route>

        <Route path="/block/:id">
          <BlockPage />
        </Route>

        <Route exact path="/transactions">
          {/* <AllTransactionsPage /> */}
          <Redirect to="/transactions/shard/0" />
        </Route>

        <Route exact path="/transactions/shard/:shardNumber">
          <AllTransactionsPage />
        </Route>

        <Route exact path="/tools/approvals">
          <ApprovalPage />
        </Route>

        <Route exact path="/tools/checkHrc">
          <CheckHRC />
        </Route>

        <Route path="/tx/:id">
          <TransactionPage />
        </Route>

        <Route path="/staking-tx/:id">
          <StakingTransactionPage />
        </Route>

        <Route exact path="/address/:id">
          <AddressPage />
        </Route>

        <Route path="/inventory/:type/:address/:tokenID">
          <InventoryDetailsPage />
        </Route>

        <Route path="/tokens">
          <ERC20List />
        </Route>

        <Route path="/tokens721">
          <ERC721List />
        </Route>

        <Route path="/hrc20">
          <ERC20List />
        </Route>

        <Route path="/hrc721">
          <ERC721List />
        </Route>

        <Route path="/hrc1155">
          <ERC1155List />
        </Route>

        <Route path="/verifycontract">
          <VerifyContract />
        </Route>

        <Route path="/exportData">
          <ExportData />
        </Route>

        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </>
  );
}
