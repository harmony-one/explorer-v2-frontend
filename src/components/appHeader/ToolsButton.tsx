import React, { useState } from "react";
import { CaretDownFill } from "grommet-icons";
import { Box, DropButton, Anchor, Text } from "grommet";
import { useHistory } from "react-router-dom";

export function ToolsButton() {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <DropButton
      label={
        <Box direction={"row"} align="center">
          <Text size="small" color="white" weight="bold">
            Tools
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
              history.push("/tools/approvals");
            }}
          >
            Token Approvals 
          </Anchor>
          <Anchor
            style={{ textDecoration: "underline" }}
            onClick={(e) => {
              setIsOpen(false);
              history.push("/tools/checkHrc");
            }}
          >
            Check HRC
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
