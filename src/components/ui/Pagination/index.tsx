import React, { useEffect } from "react";
import { Box, Text, Select } from "grommet";
import { Filter } from "src/types";
import { FormPrevious, FormNext } from "grommet-icons";
import { formatNumber } from "src/components/ui/utils";

export type TPaginationAction = "nextPage" | "prevPage";

interface PaginationNavigator {
  filter: Filter;
  elements: any[];
  totalElements: number;
  onChange: (filter: Filter, action: TPaginationAction) => void;
  property?: string;
  noScrollTop?: boolean;
  showPages?: boolean;
  lastElement?: number;
  isLoading?: boolean;
}

export function PaginationNavigator(props: PaginationNavigator) {
  const {
    elements,
    totalElements,
    filter,
    onChange,
    property,
    noScrollTop,
    showPages,
    isLoading,
  } = props;

  const { offset = 0, limit = 10 } = filter;

  const onPrevClick = () => {
    const newFilter = JSON.parse(JSON.stringify(filter)) as Filter;
    newFilter.offset = newFilter.offset - (filter.limit || 10);

    if (!isLoading) {
      onChange(newFilter, "prevPage");
    }
  };

  const onNextClick = () => {
    const newFilter = JSON.parse(JSON.stringify(filter)) as Filter;
    newFilter.offset += filter.limit || 10;
    if (!isLoading) {
      onChange(newFilter, "nextPage");
    }
  };

  return (
    <Box style={{ flex: "0 0 auto" }}>
      <Pagination
        //@ts-ignore
        currentPage={+(+offset / limit).toFixed(0) + 1}
        totalPages={+Math.ceil(Number(totalElements) / limit).toFixed(0)}
        onPrevPageClick={onPrevClick}
        onNextPageClick={onNextClick}
        showPages={showPages}
        disableNextBtn={elements.length < limit}
        disablePrevBtn={filter.offset === 0}
      />
    </Box>
  );
}
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  showPages?: boolean;
  onPrevPageClick: () => void;
  onNextPageClick: () => void;
  disableNextBtn: boolean;
  disablePrevBtn: boolean;
}

function Pagination(props: PaginationProps) {
  const {
    currentPage,
    totalPages,
    onPrevPageClick,
    onNextPageClick,
    showPages,
    disableNextBtn,
    disablePrevBtn,
  } = props;

  return (
    <Box direction="row" gap="small">
      <FormPrevious
        onClick={disablePrevBtn ? undefined : onPrevPageClick}
        style={{
          cursor: "pointer",
          userSelect: "none",
          opacity: disablePrevBtn ? 0.5 : 1,
        }}
      />
      {showPages && (
        <Text style={{ fontWeight: "bold" }}>{formatNumber(+currentPage)}</Text>
      )}
      {showPages && <Text style={{ fontWeight: 300 }}>/</Text>}
      {showPages && (
        <Text style={{ fontWeight: 300 }}>{formatNumber(+totalPages)}</Text>
      )}
      <FormNext
        onClick={disableNextBtn ? undefined : onNextPageClick}
        style={{
          cursor: "pointer",
          userSelect: "none",
          opacity: disableNextBtn ? 0.5 : 1,
        }}
      />
    </Box>
  );
}

interface ElementsPerPage {
  filter: Filter;
  onChange: (filter: Filter) => void;
  options?: string[];
}

const defaultOptions: string[] = ["10", "25", "50", "100"];

export function PaginationRecordsPerPage(props: ElementsPerPage) {
  const { filter, options = defaultOptions, onChange } = props;
  const { limit = 10 } = filter;

  const onChangeLimit = (props: { option: number }) => {
    const newFilter = JSON.parse(JSON.stringify(filter)) as Filter;
    newFilter.limit = Number(props.option);
    onChange(newFilter);
  };

  return (
    <Box direction="row" gap="small" align="center">
      <Box style={{ width: "95px" }}>
        <Select
          options={options}
          value={limit.toString()}
          onChange={onChangeLimit}
        />
      </Box>
      <Text size="small">records per page</Text>
    </Box>
  );
}
