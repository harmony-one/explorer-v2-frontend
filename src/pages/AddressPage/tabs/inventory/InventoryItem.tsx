import React, { useState } from "react";
import styled from "styled-components";
import { IUserERC721Assets } from "src/api/client.interface";
import { Box, Spinner, Text } from "grommet";
import { Address } from "src/components/ui";
import HarmonyLogo from '../../../../assets/Logo.svg';

export interface IInventoryItemProps {
  item: IUserERC721Assets;
}

const InventItem = styled(Box)`
  position: relative;
  width: 16.6666%;
  min-width: 178px;
  height: 256px;
  padding-right: 10px;
  padding-left: 10px;
  margin-bottom: 32px;
  
  img {
    transition: transform 500ms;
  }

  img:hover {
    transform: scale(1.07);
  }

  @media (max-width: 768px) {
    width: 130px;
    height: 130px;
    min-width: 130px;
  }
`

const InventBoxContainer = styled(Box)`
  box-shadow: rgb(0 0 0 / 7%) 0 4px 14px;
  overflow: hidden;
`

const InventImg = styled.img`
  max-width: 100%;
  max-height: 205px;
`;

const InventoryInfo = styled(Box)`
  padding: 10px;

  @media (max-width: 768px) {
    display: none;
  }
`

const Loader = styled.div`
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: ${(props) => props.theme.backgroundBack};
`;

const ErrorPreview = styled(Box)`
  position: relative;
  width: 100%;
  pointer-events: none;

  @media (max-width: 768px) {
    width: 130px;
    height: 100px;
    min-width: 130px;
  }
`;

const EmptyPreview = ErrorPreview

const Image = styled.img`
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  opacity: 0.5;
`

export function InventoryItem(props: IInventoryItemProps) {
  const [isLoading, setIsLoading] = useState(!!props.item?.meta?.image);
  const [isErrorLoading, setIsErrorLoading] = useState(false);

  const url = props.item?.meta?.image || "";
  const description = props.item?.meta?.description || "";
  const { tokenID, ownerAddress } = props.item;

  const itemLink = `/inventory/${props.item.type}/${props.item.tokenAddress}/${props.item.tokenID}`

  return (
    <InventItem>
      <InventBoxContainer round={'10px'}>
        <a href={itemLink}>
          <Box
            direction={"column"}
            align={"center"}
            justify={"center"}
            style={{
              // width: '215px',
              // minHeight: "215px",
              // maxHeight: "215px",
              overflow: "hidden",
              // borderRadius: '6px'
            }}
            background={"backgroundBack"}
          >
            {isLoading ? (
              <ErrorPreview direction={"column"} justify={"center"} align={"center"}>
                <Image src={HarmonyLogo} />
                <Box style={{ position: 'absolute' }}>
                  <Spinner />
                </Box>
              </ ErrorPreview>
            ) : null}
            {isErrorLoading ? (
              <ErrorPreview
                direction={"column"}
                justify={"center"}
                align={"center"}
              >
                <Image src={HarmonyLogo} />
                <Box style={{ position: 'absolute' }}>
                  <Text style={{ opacity: 0.7 }}>No Image</Text>
                </Box>
              </ErrorPreview>
            ) : url ? (
              <InventImg
                title={description}
                src={url}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setIsErrorLoading(true);
                }}
              />
            ) : (
              <EmptyPreview
                direction={"column"}
                justify={"center"}
                align={"center"}
              >
                <Image src={HarmonyLogo} />
                <Box style={{ position: 'absolute' }}>
                  <Text style={{ opacity: 0.7 }}>No Image</Text>
                </Box>
              </EmptyPreview>
            )}
          </Box>
        </a>
        <InventoryInfo direction={"column"} flex align={"start"}>
          <Box direction={'row'} gap={'8px'}>
            <Text title={tokenID} size="small">
              Token ID:
            </Text>
            <a href={itemLink} style={{ cursor: "pointer" }}>
              <Text title={tokenID} size="small" color={'brand'}>
                {tokenID.length > 8
                  ? `${tokenID.slice(0, 5)}...${tokenID.slice(-5)}`
                  : tokenID}
              </Text>
            </a>
          </Box>
          {ownerAddress ? (
            <Box gap={'8px'} direction={'row'}>
              <Text size="small">
                Owner:
              </Text>
              <Address address={ownerAddress} isShort={true} hideCopyBtn={true} />
            </Box>
          ) : null}
        </InventoryInfo>
      </InventBoxContainer>
    </InventItem>
  );
}
