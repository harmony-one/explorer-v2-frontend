import React from "react";
import { Text, Spinner, TextProps } from "grommet";
import styled from 'styled-components';

interface TextLoaderProps extends TextProps {
  children: React.ReactNode
  isLoading: boolean
}

const TextStyled = styled(Text)`
  display: flex;
  align-items: center;
`;

const SpinnerStyled = styled(Spinner)`
  margin-left: 8px;
  padding: 8px;
`

export const TextLoader = ({children, isLoading, ...props }: TextLoaderProps) => {
  return (
    <TextStyled {...props}>
      {children}
      {isLoading && <SpinnerStyled size="xsmall" />}
    </TextStyled>
  );
};
