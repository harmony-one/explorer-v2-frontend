import { Box, BoxProps, TextInput } from "grommet";
import { CaretDownFill, CaretUpFill, Search } from "grommet-icons";
import React, { Fragment } from "react";
import styled, { css } from "styled-components";

export interface IDropdownProps<T = {}> {
  defaultValue?: T;
  value?: T;
  className?: string;
  padDataList?: BoxProps["pad"];
  keyField: keyof T;
  renderValue: (dataItem: T) => JSX.Element;
  renderItem: (dataItem: T) => JSX.Element;
  items: T[];
  isOpen?: boolean;
  searchable?: boolean | ((dataItem: T, searchText: string) => boolean);
  group?: {
    groupBy: keyof T;
    renderGroupItem: () => JSX.Element;
  }[];
  onToggle?: (isOpen: boolean) => void;
  onClickItem?: (dataItem: T) => void;
  themeMode: "dark" | "light";
  itemHeight: string;
  itemStyles: React.CSSProperties;
}

const DropdownWrapper = styled(Box)`
  width: 100%;
  height: 37px;
  padding: 5px;
  border-radius: 8px;
  margin: 5px;
  position: relative;
  user-select: none;
`;

const Value = styled(Box)`
  width: 100%;
  cursor: pointer;
`;

const DataList = styled(Box)`
  position: absolute;
  max-height: 300px;
  overflow: auto;
  width: 100%;
  top: 38px;
  border-radius: 8px;
  left: 0px;
  z-index: 1;
`;

const DataItem = styled(Box)<{
  itemHeight: string;
}>`
  cursor: pointer;

  ${(props) => {
    return css`
      min-height: ${props.itemHeight};
    `;
  }}
`;

export class Dropdown<T = {}> extends React.Component<
  IDropdownProps<T>,
  { isOpen: boolean; searchText: string }
> {
  public element!: HTMLDivElement;

  public initValue: T = this.props.defaultValue || this.props.items[0];

  private get selectedValue() {
    return this.props.value || this.initValue;
  }

  public state = {
    isOpen: this.props.isOpen || false,
    searchText: "",
  };

  componentDidMount() {
    document.body.addEventListener("click", this.handleClickBody as any);
  }

  componentWillUnmount() {
    document.body.removeEventListener("click", this.handleClickBody as any);
  }

  handleClickBody = (e: React.MouseEvent<HTMLElement>) => {
    if (!(this.element && this.element.contains(e.target as Node))) {
      this.setState({ ...this.state, isOpen: false });
    }
  };

  onClickItem = (item: T, evt: React.MouseEvent<HTMLDivElement>) => {
    this.initValue = item;

    if (this.props.onClickItem) {
      this.props.onClickItem(item);
    }

    this.setState({ ...this.state, isOpen: false });
  };

  renderGroupItems() {
    const {
      group = [],
      searchable,
      itemHeight = "47px",
      itemStyles = {},
    } = this.props;

    return group.map((groupItem) => {
      const items = this.props.items
        .filter((item) => item[groupItem.groupBy])
        .filter((item) =>
          searchable
            ? typeof searchable === "function"
              ? searchable(item, this.state.searchText)
              : true // TODO hardcode
            : true
        );

      return items.length ? (
        <Fragment key={`${groupItem.groupBy}`}>
          <Fragment>{groupItem.renderGroupItem()}</Fragment>
          {items.map((item) => (
            <DataItem
              key={`${item[this.props.keyField]}`}
              background={"backgroundDropdownItem"}
              onClick={(evt) => this.onClickItem(item, evt)}
              itemHeight={itemHeight}
              style={{ ...itemStyles }}
            >
              {this.props.renderItem(item)}
            </DataItem>
          ))}
        </Fragment>
      ) : null;
    });
  }

  render() {
    const {
      group = [],
      searchable,
      themeMode,
      itemHeight = "47px",
      itemStyles = {},
      padDataList = "small",
    } = this.props;

    return (
      <DropdownWrapper
        className={this.props.className}
        ref={(element) => (this.element = element as HTMLDivElement)}
        border={{ size: "xsmall", color: "border" }}
      >
        <Value
          onClick={() => {
            this.setState({ ...this.state, isOpen: !this.state.isOpen });
          }}
          direction={"row"}
          flex
        >
          <Box flex>{this.props.renderValue(this.selectedValue)}</Box>
          {this.state.isOpen ? (
            <CaretUpFill
              onClick={(e) => {
                console.log("CLICK");
                e.stopPropagation();
                this.setState({ ...this.state, isOpen: false });
              }}
            />
          ) : (
            <CaretDownFill
              onClick={(e) => {
                e.stopPropagation();
                this.setState({ ...this.state, isOpen: true });
              }}
            />
          )}
        </Value>
        {this.state.isOpen ? (
          <DataList
            background="background"
            border={{ size: "xsmall", color: "border" }}
            style={{ borderRadius: "0px" }}
            pad={padDataList}
          >
            {searchable ? (
              <TextInput
                value={this.state.searchText}
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                  this.setState({
                    ...this.state,
                    searchText: evt.currentTarget.value,
                  });
                }}
                color="red"
                icon={<Search color="brand" />}
                style={{
                  backgroundColor:
                    themeMode === "light" ? "white" : "transparent",
                  fontWeight: 500,
                }}
                placeholder="Search by symbol, token address"
              />
            ) : null}
            {group.length
              ? this.renderGroupItems()
              : this.props.items.map((item) => (
                  <DataItem
                    key={`${item[this.props.keyField]}`}
                    onClick={(evt) => this.onClickItem(item, evt)}
                    itemHeight={itemHeight}
                    style={{ ...itemStyles }}
                  >
                    {this.props.renderItem(item)}
                  </DataItem>
                ))}
          </DataList>
        ) : null}
      </DropdownWrapper>
    );
  }
}
