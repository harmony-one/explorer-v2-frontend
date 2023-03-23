import { Box } from "grommet";
import { FormNext, FormPrevious } from "grommet-icons";
import React, { useState } from "react";

export interface IPaginationProps {
  onClickNext: () => void;
  onClickPrev: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
}

export function Pagination(props: IPaginationProps) {
  return (
    <Box direction={"row"}>
      <FormPrevious
        size={'32px'}
        style={{
          opacity: props.disablePrev ? 0.4 : 1,
          cursor: props.disablePrev ? "not-allowed" : "pointer",
          marginRight: "2px",
          userSelect: "none",
        }}
        onClick={props.disablePrev ? undefined : () => props.onClickPrev()}
      />
      <FormNext
        size={'32px'}
        style={{
          opacity: props.disableNext ? 0.4 : 1,
          cursor: props.disableNext ? "not-allowed" : "pointer",
          userSelect: "none",
        }}
        onClick={props.disableNext ? undefined : () => props.onClickNext()}
      />
    </Box>
  );
}
