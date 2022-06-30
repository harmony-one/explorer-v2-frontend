import React, { CSSProperties } from "react";
import { Box, Text } from "grommet";
import { Link, useHistory } from "react-router-dom";
import {toChecksumAddress} from 'web3-utils';
import { useERC20Pool } from "src/hooks/ERC20_Pool";
import { getAddress } from "src/utils";
import { useCurrency } from "src/hooks/ONE-ETH-SwitcherHook";
import { useERC721Pool } from "src/hooks/ERC721_Pool";
import { addressAliasMap } from "src/config";
import { useERC1155Pool } from "src/hooks/ERC1155_Pool";
import { CopyBtn } from "./CopyBtn";
import { toaster } from "src/App";
import styled from "styled-components";
import { StatusGood } from "grommet-icons";

const Icon = styled(StatusGood)`
  margin-right: 5px;
`;

interface IAddress {
  address: string;
  isShort?: boolean;
  isShortEllipsis?: boolean;
  type?: "tx" | "address" | "staking-tx";
  style?: CSSProperties;
  color?: string;
  displayHash?: boolean;
  noHistoryPush?: boolean;
  hideCopyBtn?: boolean;
  showLink?: boolean;
}

const AddressText = styled(Text)<{ isShortEllipsis?: boolean }>`
  ${({ isShortEllipsis }) => isShortEllipsis && `
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`

export const Address = (props: IAddress) => {
  const {
    address,
    isShort,
    isShortEllipsis,
    style,
    type = "address",
    color = "brand",
    displayHash,
    hideCopyBtn = false,
    showLink = true
  } = props;
  const history = useHistory();
  const ERC20Map = useERC20Pool();
  const erc721Map = useERC721Pool();
  const erc1155Map = useERC1155Pool();
  const currency = useCurrency();

  const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

  if (!address) {
    return null;
  }

  let parsedName = "";

  if (ERC20Map[address] && !displayHash) {
    parsedName = ERC20Map[address].name;
  }

  if (erc721Map[address] && !displayHash) {
    parsedName = erc721Map[address].name;
  }

  if (erc1155Map[address] && !displayHash) {
    parsedName = erc1155Map[address].name;
  }

  if (addressAliasMap[address] && !displayHash) {
    parsedName = addressAliasMap[address].name;
  }

  parsedName = address === EMPTY_ADDRESS ? "0x0" : parsedName;

  let outPutAddress: string;
  try {
    outPutAddress = currency === "ONE" ? getAddress(address).bech32 : toChecksumAddress(address);
  } catch {
    outPutAddress = address;
  }

  const addressContent = <AddressText
    size="small"
    color={color}
    style={{
      marginLeft: hideCopyBtn ? "0px" : "7px",
      cursor: showLink ? 'pointer' : 'default',
      ...style,
    }}
    isShortEllipsis={isShortEllipsis}
    onClick={
      address === EMPTY_ADDRESS
        ? undefined
        : props.noHistoryPush
          ? undefined
          : (e) => {
            e.preventDefault();
            history.push(`/${type}/${address}`);
          }
    }
  >
    {parsedName ||
      (isShort
        ? `${outPutAddress.substr(0, 4)}...${outPutAddress.substr(-4)}`
        : outPutAddress)}
  </AddressText>

  return (
    <div style={{ display: "inline-block" }}>
      <Box direction={"row"} align={"center"} justify={"start"}>
        {hideCopyBtn ? null : (
          <CopyBtn
            value={outPutAddress}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toaster.show({
                message: () => (
                  <Box direction={"row"} align={"center"} pad={"small"}>
                    <Icon size={"small"} color={"headerText"} />
                    <Text size={"small"}>Copied to clipboard</Text>
                  </Box>
                ),
              });
            }}
          />
        )}
        {showLink &&
          <Link to={address === EMPTY_ADDRESS ? "" : `/${type}/${address}`}>
            {addressContent}
          </Link>
        }
        {!showLink &&
          addressContent
        }
      </Box>
    </div>
  );
};
