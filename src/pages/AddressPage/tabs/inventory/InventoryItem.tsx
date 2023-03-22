import React, { useState } from "react";
import styled from "styled-components";
import { IUserERC721Assets } from "src/api/client.interface";
import { Box, Spinner, Text } from "grommet";
import { Address } from "src/components/ui";
import { useHistory } from "react-router-dom";

export interface IInventoryItemProps {
  item: IUserERC721Assets;
}

const InventItem = styled(Box)`
  position: relative;
  width: 16.6666%;
  min-width: 178px;
  height: 246px;
  padding-right: 10px;
  padding-left: 10px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    width: 130px;
    height: 130px;
    min-width: 130px;
  }
`

const InventoryInfo = styled(Box)`
  @media (max-width: 768px) {
    display: none;
  }
`

const Loader = styled.div`
  position: absolute;
  width: 215px;
  height: 270px;
  background: ${(props) => props.theme.backgroundBack};
`;

const InventImg = styled.img`
  width: 100%;
`;

const ErrorPreview = styled(Box)`
  width: 215px;
  height: 270px;

  border-radius: 8px;
`;

const EmptyImage = styled(Box)`
  width: 215px;
  height: 270px;

  border-radius: 8px;
`;

const Image = styled(Box)`
  width: 30px;
  height: 30px;

  border-radius: 8px;
  background: ${(props) => props.theme.global.colors.backgroundEmptyIcon};
`;

export function InventoryItem(props: IInventoryItemProps) {
  const [isLoading, setIsLoading] = useState(!!props.item?.meta?.image);
  const [isErrorLoading, setIsErrorLoading] = useState(false);
  const history = useHistory();

  const url = props.item?.meta?.image || "";
  const description = props.item?.meta?.description || "";
  const { tokenID, ownerAddress } = props.item;

  const itemLink = `/inventory/${props.item.type}/${props.item.tokenAddress}/${props.item.tokenID}`

  return (
    <InventItem>
      <Box border={{ color: 'border' }} round={'8px'} pad={'12px'}>
        {isLoading ? (
          <Loader>
            <Box align={"center"} justify={"center"} flex height={"100%"}>
              <Spinner />
            </Box>
          </Loader>
        ) : null}

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
              borderRadius: '6px'
            }}
            background={"backgroundBack"}
          >
            {isErrorLoading ? (
              <ErrorPreview
                direction={"column"}
                justify={"center"}
                align={"center"}
              >
                <Image style={{ marginBottom: "10px" }} />
                <Text style={{ opacity: 0.7 }}>No Image</Text>
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
              <EmptyImage
                direction={"column"}
                justify={"center"}
                align={"center"}
              >
                <Image style={{ marginBottom: "10px" }} />
                <Text style={{ opacity: 0.7 }}>No image</Text>
              </EmptyImage>
            )}
          </Box>
        </a>
        <InventoryInfo direction={"column"} flex align={"start"} margin={{ top: '16px' }}>
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
      </Box>
    </InventItem>
  );
}
