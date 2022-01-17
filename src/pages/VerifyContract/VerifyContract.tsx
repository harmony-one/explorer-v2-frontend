import {
  Box,
  Heading,
  Select,
  Spinner,
  Text,
  TextArea,
  TextInput,
} from "grommet";
import React from "react";
import { BasePage, Button } from "src/components/ui";
import styled from "styled-components";
import { IVerifyContractData, verifyContractCode } from "src/api/explorerV1";
import { SubtractCircle } from "grommet-icons";
import { breakpoints } from "../../Responive/breakpoints";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import { getAddress, getQueryVariable } from "../../utils";
import { getContractsByField, getTransactionByField } from "../../api/client";

const Field = styled(Box)``;

const Wrapper = styled(Box)`
  & * input,
  & * textarea {
    font-weight: 400 !important;
  }
`;

export function uniqid(prefix = "", random = false) {
  const sec = Date.now() * 1000 + Math.random() * 1000;
  const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
  return `${prefix}${id}${
    random ? `.${Math.trunc(Math.random() * 100000000)}` : ""
  }`;
}

class VerifyContractBase extends React.Component<
  {
    isLessTablet: boolean;
    address?: string;
  },
  IVerifyContractData
> {
  public state: IVerifyContractData = {
    chainType: "mainnet",
    contractAddress: this.props.address || "",
    compiler: "",
    optimizer: "No",
    optimizerTimes: "",
    sourceCode: "",
    libraries: [],
    constructorArguments: "",
    contractName: "",
    isLoading: false,
    argsLoading: false,
    statusText: "",
    error: "",
  };

  getBytecode = async () => {
    this.setState({ ...this.state, argsLoading: true });

    try {
      if (this.state.contractAddress) {
        const address = getAddress(this.state.contractAddress).basicHex;

        const contracts: any = await getContractsByField([
          0,
          "address",
          address,
        ]);

        if (contracts?.transactionHash) {
          const trx = await getTransactionByField([
            0,
            "hash",
            contracts.transactionHash,
          ]);

          if (trx?.input) {
            const argStart = trx.input.lastIndexOf("0033");
            if (argStart) {
              this.setState({
                ...this.state,
                constructorArguments: trx.input.slice(argStart + 4),
              });
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }

    this.setState({ ...this.state, argsLoading: false });
  };

  onClickSubmitBtn = async () => {
    this.setState({
      ...this.state,
      isLoading: true,
      statusText: "Pending...",
      error: "",
    });

    const { isLoading, statusText, ...state } = this.state;

    try {
      const res = await verifyContractCode({
        ...state,
        libraries: this.state.libraries.map((i) => i.value),
      });

      if (res.success === true) {
        this.setState({ ...this.state, statusText: "Success" });
      } else {
        this.setState({ ...this.state, statusText: "", error: "Error" });
      }
    } catch (e) {
      this.setState({
        ...this.state,
        statusText: "",
        // @ts-ignore
        error: e?.message || "Error",
      });
    } finally {
      this.setState({ ...this.state, isLoading: false });
    }
  };

  render() {
    const { isLessTablet } = this.props;
    const { isLoading } = this.state;

    return (
      <>
        <Heading size="xsmall" margin={{ top: "0" }}>
          Verify Contract
        </Heading>
        <BasePage>
          <Wrapper direction={"column"}>
            <Box direction="row" fill={true} justify="between" wrap>
              <Field margin={"small"} width={isLessTablet ? "100%" : "47%"}>
                <Text>Contract Address</Text>
                <TextInput
                  placeholder={"ONE contract address"}
                  onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({
                      ...this.state,
                      contractAddress: evt.currentTarget.value,
                    });
                  }}
                  value={this.state.contractAddress}
                  disabled={isLoading}
                />
              </Field>

              <Field margin={"small"} width={isLessTablet ? "100%" : "47%"}>
                <Text>Contract Name</Text>
                <TextInput
                  placeholder={"ONE name"}
                  onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({
                      ...this.state,
                      contractName: evt.currentTarget.value,
                    });
                  }}
                  disabled={isLoading}
                />
              </Field>
            </Box>

            <Box direction="row" fill={true} justify="between" wrap>
              <Field margin={"small"} width={isLessTablet ? "100%" : "30%"}>
                <Text>Chain Type</Text>
                <Select
                  options={["mainnet", "testnet"]}
                  value={this.state.chainType}
                  onChange={({ option }) =>
                    this.setState({ ...this.state, chainType: option })
                  }
                  disabled={isLoading}
                />
              </Field>

              <Field margin={"small"} width={isLessTablet ? "100%" : "30%"}>
                <Text>Compiler</Text>
                <TextInput
                  placeholder={"Solidity compiler version"}
                  onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({
                      ...this.state,
                      compiler: evt.currentTarget.value,
                    });
                  }}
                  disabled={isLoading}
                />
              </Field>

              <Field margin={"small"} width={isLessTablet ? "100%" : "30%"}>
                <Text>Optimizer</Text>
                <Box direction={"row"}>
                  <Select
                    options={["Yes", "No"]}
                    value={this.state.optimizer}
                    onChange={({ option }) =>
                      this.setState({ ...this.state, optimizer: option })
                    }
                    disabled={isLoading}
                  />
                  <TextInput
                    type={"number"}
                    placeholder={"Number of times"}
                    style={{ marginLeft: "5px" }}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                      this.setState({
                        ...this.state,
                        optimizerTimes: evt.currentTarget.value,
                      });
                    }}
                    disabled={isLoading}
                  />
                </Box>
              </Field>
            </Box>

            <Field margin={"small"}>
              <Text>Enter the Solidity Contract Code below</Text>
              <TextArea
                style={{ minHeight: "300px" }}
                onChange={(evt: React.ChangeEvent<HTMLTextAreaElement>) => {
                  this.setState({
                    ...this.state,
                    sourceCode: evt.currentTarget.value,
                  });
                }}
                disabled={isLoading}
              />
            </Field>

            <Field margin={"small"}>
              <Box direction="row" justify="between">
                <Box>
                  <Text>Constructor Arguments (ABI-encoded)</Text>
                </Box>
                {this.state.argsLoading ? (
                  <Box
                    style={{ width: "120px" }}
                    direction="row"
                    justify="center"
                  >
                    <Spinner size={"xsmall"} />
                  </Box>
                ) : (
                  <Box onClick={() => this.getBytecode()}>
                    <Text color="#00AEE9">paste arguments from tx input</Text>
                  </Box>
                )}
              </Box>
              <TextArea
                style={{ minHeight: "80px", height: "80px" }}
                onChange={(evt: React.ChangeEvent<HTMLTextAreaElement>) => {
                  this.setState({
                    ...this.state,
                    constructorArguments: evt.currentTarget.value,
                  });
                }}
                disabled={isLoading || this.state.argsLoading}
                value={this.state.constructorArguments}
              />
            </Field>

            <Field margin={"small"}>
              <Text>Contract Library Address</Text>
              <Button
                onClick={() => {
                  const old = this.state.libraries;
                  old.push({ value: "", id: uniqid() });

                  this.setState({
                    ...this.state,
                    libraries: old,
                  });
                }}
                disabled={isLoading}
              >
                + add one more
              </Button>
              {this.state.libraries.map((value, index) => {
                return (
                  <Field
                    key={value.id}
                    direction={"row"}
                    align={"center"}
                    margin={"small"}
                  >
                    <Text style={{ marginRight: "10px", minWidth: "150px" }}>
                      Library {index} name
                    </Text>
                    <TextInput
                      onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                        const value = evt.currentTarget.value;
                        const { libraries } = this.state;
                        libraries[index].value = value;

                        this.setState({ ...this.state, libraries });
                      }}
                      disabled={isLoading}
                    />
                    <Button style={{ marginLeft: "5px" }} disabled={isLoading}>
                      <Box direction={"row"} align={"center"}>
                        <SubtractCircle
                          size={"small"}
                          style={{ marginRight: "5px" }}
                        />
                        <Text
                          size={"small"}
                          onClick={() => {
                            this.state.libraries.splice(
                              this.state.libraries.findIndex(
                                (i) => i.id === value["id"]
                              ),
                              1
                            );
                            this.setState({
                              ...this.state,
                              libraries: this.state.libraries,
                            });
                          }}
                        >
                          remove
                        </Text>
                      </Box>
                    </Button>
                  </Field>
                );
              })}
            </Field>

            <Field margin={"small"}>
              <Button
                onClick={this.onClickSubmitBtn}
                primary={true}
                disabled={isLoading}
              >
                <Box direction={"row"} align={"center"} justify={"center"}>
                  <Text size={"small"} style={{ marginRight: "10px" }}>
                    Submit
                  </Text>{" "}
                  {isLoading ? <Spinner size={"xsmall"} /> : null}
                </Box>
              </Button>
              <Box
                align={"center"}
                justify={"center"}
                width={"100%"}
                style={{ marginTop: "10px" }}
              >
                <Text>{this.state.statusText}</Text>
              </Box>
              {this.state.error && (
                <Box
                  align={"center"}
                  justify={"center"}
                  width={"100%"}
                  style={{ marginTop: "10px" }}
                >
                  <Text style={{ overflowWrap: "anywhere" }} color="red">
                    {this.state.error}
                  </Text>
                </Box>
              )}
            </Field>
          </Wrapper>
        </BasePage>
      </>
    );
  }
}

export const VerifyContract = () => {
  const isLessTablet = useMediaQuery({ maxDeviceWidth: breakpoints.tablet });
  const history = useHistory();
  const address = getQueryVariable(
    "address",
    history.location.search.substring(1)
  );

  return <VerifyContractBase isLessTablet={isLessTablet} address={address} />;
};
