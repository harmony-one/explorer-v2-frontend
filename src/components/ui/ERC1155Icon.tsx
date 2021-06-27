import { Box, Spinner } from "grommet";
import { Image } from "grommet-icons";
import React, { useState } from "react";
import styled from "styled-components";

export interface IERC1155IconProps {
  imageUrl?: string;
}

const Loader = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  background: ${(props) => props.theme.backgroundBack};
`;

const InventImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 8px;
`;

const ErrorPreview = styled(Box)`
  width: 30px;
  height: 30px;

  border-radius: 8px;
`;

const EmptyImage = styled(Box)`
  width: 30px;
  height: 30px;

  border-radius: 8px;
  background: ${props => props.theme.global.colors.backgroundEmptyIcon};
`;

export function ERC1155Icon(props: IERC1155IconProps) {
  const [isLoading, setIsLoading] = useState(!!props.imageUrl);
  const [isErrorLoading, setIsErrorLoading] = useState(false);

  const url = props.imageUrl
    ? `${process.env.REACT_APP_INDEXER_IPFS_GATEWAY}${props.imageUrl}`
    : "";

  return (
    <Box style={{ marginLeft: "15px" }}>
      {isLoading ? (
        <Loader>
          <Box align={"center"} justify={"center"} flex height={"100%"}>
            <Spinner />
          </Box>
        </Loader>
      ) : null}
      {isErrorLoading ? (
        <ErrorPreview direction={"column"} justify={"center"} align={"center"}>
          <Image
            size={"medium"}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          />
        </ErrorPreview>
      ) : url ? (
        <InventImg
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
        ></EmptyImage>
      )}
    </Box>
  );
}
