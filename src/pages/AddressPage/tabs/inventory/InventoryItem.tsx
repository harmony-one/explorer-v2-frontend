import React, { useState } from "react";

import styled from "styled-components";

import { IUserERC721Assets } from "src/api/client.interface";
import { Box, Spinner, Text } from "grommet";
import { Address } from "src/components/ui";
import { Alert } from "grommet-icons";
import { useHistory } from "react-router-dom";

export interface IInventoryItemProps {
  item: IUserERC721Assets;
}

const InventItem = styled.div`
  width: 215px;
  height: 270px;
  position: relative;
  margin: 10px;
`;

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
  return (
    <a
      onClick={() =>
        history.push(
          `/inventory/${props.item.type}/${props.item.tokenAddress}/${props.item.tokenID}`
        )
      }
      style={{ cursor: "pointer" }}
    >
      <InventItem>
        {isLoading ? (
          <Loader>
            <Box align={"center"} justify={"center"} flex height={"100%"}>
              <Spinner />
            </Box>
          </Loader>
        ) : null}

        <Box
          direction={"column"}
          align={"center"}
          justify={"center"}
          style={{
            minHeight: "225px",
            maxHeight: "225px",
            overflow: "hidden",
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

        <Box direction={"column"} flex align={"center"}>
          <Text title={tokenID} size="small">
            #
            {tokenID.length > 8
              ? `${tokenID.slice(0, 5)}...${tokenID.slice(-5)}`
              : tokenID}
          </Text>
          {ownerAddress ? (
            <Text>
              <Text color="minorText" size="small">
                Owner
              </Text>{" "}
              <Address address={ownerAddress} isShort={true} />
            </Text>
          ) : null}
        </Box>
      </InventItem>{" "}
    </a>
  );
}
