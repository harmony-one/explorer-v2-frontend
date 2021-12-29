import React, { useEffect, useState } from "react";
import { Box, Text } from "grommet";
import { Toaster } from "./Toaster";
import styled, { css, keyframes } from "styled-components";

const Wrapper = styled(Box)`
  overflow: hidden;
`;

const animation = keyframes`
  from { 
  transform: translateY(100%);
  visibility: visible;
  }

  to { 
  transform: translateY(0);
  }
`;
const ToasterItem = styled(Box)<{ index: number }>`
  position: absolute;
  right: 0px;
  bottom: 0px;
  height: 60px;
  width: 300px;
  z-index: 999;
  margin: 10px;

  ${(props) =>
    props.index
      ? css`
          animation-name: ${animation};
          animation-duration: 0.4s;
          animation-fill-mode: both;
        `
      : css``};
`;

export interface IToasterComponentProps {
  toaster: Toaster;
}

export class ToasterComponent extends React.Component<IToasterComponentProps> {
  constructor(props: IToasterComponentProps) {
    super(props);
    props.toaster.updateComponent = () => this.forceUpdate();
  }

  render() {
    const { currentSelected } = this.props.toaster;
    return (
      <Wrapper>
        {currentSelected.length
          ? currentSelected.map((item, index) => {
              return (
                <ToasterItem
                  key={index}
                  background={"backgroundToaster"}
                  pad={"xsmall"}
                  index={index}
                  style={{
                    borderRadius: "6px",
                    marginBottom: `${index * 70 + 10}px`,
                  }}
                >
                  <Text color={"headerText"}>
                    {typeof item.message === "function"
                      ? item.message()
                      : item.message}
                  </Text>
                </ToasterItem>
              );
            })
          : null}
      </Wrapper>
    );
  }
}
