import React from "react";
import styled, { css } from "styled-components";
import { Button as GButton, ButtonExtendedProps } from "grommet";

export type TButtonProps = ButtonExtendedProps & { primary?: boolean };

export function Button(props: TButtonProps) {
  return <StyledButton {...props} />;
}

const StyledButton = styled(GButton)`
  border: 1px solid
    ${(props) => props.theme.global.colors[props.theme.button.borderColor]};
  padding: 8px 5px;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  font-size: 12px;
  color: ${(props) => props.theme.global.colors.brand};
  transition: 0.3s ease all;

  ${(props) =>
    props.primary
      ? css`
          background: ${props.theme.global.colors.backgroundBack};
        `
      : css``};

  &:hover {
    // background-color: ${(props) => props.theme.global.colors.border};
    letter-spacing: 0.3px;
  }
`;
