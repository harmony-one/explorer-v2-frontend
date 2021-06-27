import React from "react";
import { Box } from "grommet";
import { useMediaQuery } from 'react-responsive';
import { breakpoints } from "src/Responive/breakpoints";

const sizes = {
  minWidth: "343px",
  maxWidth: "1408px",
};

export const BaseContainer = (props: any) => {
  const { style } = props;
  const isLessTablet = useMediaQuery({ maxDeviceWidth: breakpoints.tablet });

  return (
    <Box
      pad={{ horizontal: isLessTablet ? "12px" : '20px' }}
      {...props}
      style={{ ...sizes, width: "100%", flex: "1 1 auto", ...style }}
    />
  );
};

export const BasePage = (props: any) => {
  const { style } = props;

  return (
    <Box
      pad="medium"
      background="background"
      border={{ size: "xsmall", color: "border" }}
      {...props}
      style={{
        borderRadius: "8px",
        overflow: 'hidden',
        ...style,
      }}
    />
  );
};
