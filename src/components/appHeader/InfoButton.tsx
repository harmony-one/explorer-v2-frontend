import React, { useState } from "react";
import { CaretDownFill } from "grommet-icons";
import { Box, DropButton, Anchor, Text } from "grommet";
import { useHistory } from "react-router-dom";

export function InfoButton() {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <DropButton
      label={
        <Box direction={"row"} align="center">
          <Text size="small" color="white" weight="bold">
            Tokens
          </Text>
          <CaretDownFill color="white" />
        </Box>
      }
      onOpen={() => {
        setIsOpen(true);
      }}
      onClose={() => {
        setIsOpen(false);
      }}
      open={isOpen}
      dropProps={{ round: '4px' }}
      dropAlign={{ top: "bottom", right: "right" }}
      dropContent={
        <Box
          pad="medium"
          background="background"
          border={{ size: "xsmall", color: "border" }}
          style={{ borderRadius: "0px" }}
          gap="small"
        >
          <Anchor
            style={{ textDecoration: "underline" }}
            onClick={(e) => {
              setIsOpen(false);
              history.push("/hrc20");
            }}
          >
            HRC20 tokens
          </Anchor>
          <Anchor
            style={{ textDecoration: "underline" }}
            onClick={(e) => {
              setIsOpen(false);
              history.push("/hrc721");
            }}
          >
            HRC721 tokens
          </Anchor>
          <Anchor
            style={{ textDecoration: "underline" }}
            onClick={(e) => {
              setIsOpen(false);
              history.push("/hrc1155");
            }}
          >
            HRC1155 tokens
          </Anchor>
        </Box>
      }
      style={{
        border: "none",
        boxShadow: "none",
        paddingRight: "6px"
      }}
    />
  );
}
