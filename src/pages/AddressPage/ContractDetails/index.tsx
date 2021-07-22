import React, { useState } from "react";
import { Box, Text, TextArea } from "grommet";
import { AddressDetails } from "src/types";
import { Item } from "../AddressDetails";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { ISourceCode } from "src/api/explorerV1";
import { AbiMethodsView } from "./AbiMethodView";
import { AbiItem } from "web3-utils";
import { Wallet } from "./ConnectWallets";

const StyledTextArea = styled(TextArea)`
  padding: 0.75rem;
  border-radius: 0.35rem;
  font-weight: normal;
`;

export const ContractDetails = (props: {
  address: string;
  contracts?: AddressDetails | null;
  sourceCode?: ISourceCode | null;
}) => {
  // console.log(111, appendABI(abi, props.address));

  if (!!props.sourceCode) {
    return (
      <VerifiedContractDetails
        sourceCode={props.sourceCode}
        contracts={props.contracts}
        address={props.address}
      />
    );
  }

  if (!!props.contracts) {
    return (
      <NoVerifiedContractDetails
        contracts={props.contracts}
        address={props.address}
      />
    );
  }

  return null;
};

export const AbiMethods = (props: {
  address: string;
  abi: AbiItem[];
  metamaskAddress?: string;
}) => {
  return (
    <Box>
      {props.abi.map((abiMethod, idx) =>
        abiMethod.name ? (
          <AbiMethodsView
            abiMethod={abiMethod}
            address={props.address}
            index={idx}
            metamaskAddress={props.metamaskAddress}
          />
        ) : null
      )}
    </Box>
  );
};

export const NoVerifiedContractDetails = (props: {
  contracts: AddressDetails;
  address: string;
}) => {
  const history = useHistory();

  return (
    <Box style={{ padding: "10px" }} margin={{ top: "medium" }}>
      <Box direction="column" gap="30px">
        <Box direction="row" gap="5px">
          Are you the contract creator?
          <Text
            size="small"
            style={{ cursor: "pointer" }}
            onClick={() =>
              history.push(`/verifycontract?address=${props.address}`)
            }
            color="brand"
          >
            Verify and Publish
          </Text>{" "}
          your contract source code today!
        </Box>

        <Box direction="column">
          <Item
            label="Solidity version"
            value={props.contracts.solidityVersion}
          />
          {props.contracts.IPFSHash ? (
            <Item label="IPFS hash" value={props.contracts.IPFSHash} />
          ) : null}
          <Item
            label="Bytecode"
            value={
              <StyledTextArea readOnly={true} rows={15} cols={100}>
                {props.contracts.bytecode || ""}
              </StyledTextArea>
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

enum V_TABS {
  CODE = "Code",
  READ = "Read Contract",
  WRITE = "Write Contract",
}

const TabBox = styled(Box)<{ selected: boolean }>`
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

export const VerifiedContractDetails = (props: {
  sourceCode: ISourceCode;
  address: string;
  contracts?: AddressDetails | null;
}) => {
  const [tab, setTab] = useState<V_TABS>(V_TABS.CODE);
  const [metamaskAddress, setMetamask] = useState("");

  return (
    <Box direction="column">
      <Box direction="row" align="center" margin={{ top: "medium" }}>
        <TabButton
          text={V_TABS.CODE}
          onClick={() => setTab(V_TABS.CODE)}
          selected={tab === V_TABS.CODE}
        />
        {props.sourceCode.abi ? (
          <>
            <TabButton
              text={V_TABS.READ}
              onClick={() => setTab(V_TABS.READ)}
              selected={tab === V_TABS.READ}
            />
            <TabButton
              text={V_TABS.WRITE}
              onClick={() => setTab(V_TABS.WRITE)}
              selected={tab === V_TABS.WRITE}
            />
          </>
        ) : null}
      </Box>
      {tab === V_TABS.CODE ? (
        <Box style={{ padding: "10px" }} margin={{ top: "medium" }}>
          <Box direction="column" gap="30px">
            <Box direction="column">
              <Item
                label="Contract Name"
                value={props.sourceCode.contractName}
              />
              <Item
                label="Compiler Version"
                value={props.sourceCode.compiler}
              />
              <Item
                label="Optimization Enabled"
                value={
                  props.sourceCode.optimizer ||
                  "No" +
                    (Number(props.sourceCode.optimizerTimes)
                      ? ` with ${props.sourceCode.optimizerTimes} runs`
                      : "")
                }
              />
              <Item
                label="Contract Source Code Verified"
                value={
                  <StyledTextArea readOnly={true} rows={15} cols={100}>
                    {props.sourceCode.sourceCode || ""}
                  </StyledTextArea>
                }
              />
              {props.sourceCode.constructorArguments ? (
                <Item
                  label="Constructor Arguments (ABI-encoded)"
                  value={
                    <StyledTextArea readOnly={true} rows={4} cols={100}>
                      {props.sourceCode.constructorArguments || ""}
                    </StyledTextArea>
                  }
                />
              ) : null}
              {props.contracts ? (
                <Item
                  label="Bytecode"
                  value={
                    <StyledTextArea readOnly={true} rows={7} cols={100}>
                      {props.contracts.bytecode || ""}
                    </StyledTextArea>
                  }
                />
              ) : null}
            </Box>
          </Box>
        </Box>
      ) : null}
      {tab === V_TABS.WRITE && props.sourceCode.abi ? (
        <Box style={{ padding: "10px" }} margin={{ top: "medium" }}>
          <Wallet onSetMetamask={setMetamask} />
          <AbiMethods
            abi={props.sourceCode.abi.filter(
              (a) =>
                a.stateMutability !== "view" &&
                !!a.name &&
                a.type === "function"
            )}
            address={props.address}
            metamaskAddress={metamaskAddress}
          />
        </Box>
      ) : null}

      {tab === V_TABS.READ && props.sourceCode.abi ? (
        <Box style={{ padding: "10px" }} margin={{ top: "medium" }}>
          <AbiMethods
            abi={props.sourceCode.abi.filter(
              (a) => a.stateMutability === "view" && a.type === "function"
            )}
            address={props.address}
          />
        </Box>
      ) : null}
    </Box>
  );
};
