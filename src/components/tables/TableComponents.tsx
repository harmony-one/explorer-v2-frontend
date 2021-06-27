import { DataTable, DataTableExtendedProps } from "grommet";
import React from "react";
import styled from "styled-components";

export interface ITableComponentProps {
  tableProps: DataTableExtendedProps<any>;
  className?: string;
  alwaysOpenedRowDetails?: boolean;
}

const Flex = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  box-sizing: border-box;
  max-width: 100%;
  min-width: 0;
  min-height: 0;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
`;

export class TableComponent extends React.Component<ITableComponentProps> {
  private element!: HTMLDivElement;

  componentDidUpdate() {
    this.clickExpandButtons();
  }

  clickExpandButtons = () => {
    if (this.props.alwaysOpenedRowDetails) {
      const headerTd = Array.from(
        this.element.querySelectorAll("table thead tr td:first-child")
      ) as HTMLButtonElement[];

      headerTd.forEach((td) => (td.style.display = "none"));

      const bodyTd = Array.from(
        this.element.querySelectorAll("table tbody tr td:first-child")
      ) as HTMLButtonElement[];

      bodyTd.forEach((td) => (td.style.display = "none"));

      const expandButtons = Array.from(
        this.element.querySelectorAll("table tr td:first-child button")
      ) as HTMLButtonElement[];

      expandButtons.forEach((expandButton) => {
        const svg = expandButton.querySelector("svg") as SVGElement;
        (svg.parentNode as HTMLDivElement).style.display = "none";
        expandButton.style.width = "1px";
        expandButton.style.height = "1px";
      });

      setTimeout(() => {
        expandButtons.forEach((item) => item.click());
      }, 10);
    }
  };

  render() {
    return (
      <Flex
        ref={(element: any) => (this.element = element)}
        className={this.props.className}
      >
        <DataTable
          {...(this.props.tableProps as any)}
          onMore={
            this.props.alwaysOpenedRowDetails
              ? () => {
                  if (this.props.tableProps.onMore) {
                    this.props.tableProps.onMore();
                  }
                  this.clickExpandButtons();
                }
              : undefined
          }
        />
      </Flex>
    );
  }
}
