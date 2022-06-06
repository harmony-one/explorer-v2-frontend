import React, { useEffect } from "react";
import { Box, Text, Select } from "grommet";
import { Filter } from "src/types";
import { FormPrevious, FormNext } from "grommet-icons";
import { formatNumber } from "src/components/ui/utils";
import styled from "styled-components";

const NavigationItem = styled(Box)<{ disabled?: boolean }>`
  border-radius: 4px;
  height: 28px;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  text-align: center;
  background: ${(props) => props.theme.global.colors.backgroundBack};
  cursor: ${(props) => props.disabled ? 'default': 'pointer'};
  opacity: ${(props) => props.disabled ? 0.7: 1};
`

export type TPaginationAction = "nextPage" | "prevPage" | "firstPage" | "lastPage";

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

  const onFirstPageClick = () => {
    const newFilter = JSON.parse(JSON.stringify(filter)) as Filter;
    newFilter.offset = 0;

    if (!isLoading) {
      onChange(newFilter, "firstPage");
    }
  };

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

  const onLastPageClick = () => {
    const newFilter = JSON.parse(JSON.stringify(filter)) as Filter;
    const limit = filter.limit || 10
    newFilter.offset = limit * +Math.ceil(Number(totalElements) / limit).toFixed(0)
    if (!isLoading) {
      onChange(newFilter, "lastPage");
    }
  };

  return (
    <Box style={{ flex: "0 0 auto" }}>
      <Pagination
        //@ts-ignore
        currentPage={+(+offset / limit).toFixed(0) + 1}
        totalPages={+Math.ceil(Number(totalElements) / limit).toFixed(0)}
        onFirstPageClick={onFirstPageClick}
        onPrevPageClick={onPrevClick}
        onNextPageClick={onNextClick}
        onLastPageClick={onLastPageClick}
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
  onFirstPageClick: () => void;
  onPrevPageClick: () => void;
  onNextPageClick: () => void;
  onLastPageClick: () => void;
  disableNextBtn: boolean;
  disablePrevBtn: boolean;
}

function Pagination(props: PaginationProps) {
  const {
    currentPage,
    totalPages,
    onFirstPageClick,
    onPrevPageClick,
    onNextPageClick,
    onLastPageClick,
    showPages,
    disableNextBtn,
    disablePrevBtn,
  } = props;

  return (
    <Box direction="row" gap="xsmall" align={'center'}>
      {showPages &&
        <NavigationItem disabled={disablePrevBtn} onClick={disablePrevBtn ? undefined : onFirstPageClick}>
          First
        </NavigationItem>
      }
      <NavigationItem disabled={disablePrevBtn} onClick={disablePrevBtn ? undefined : onPrevPageClick}>
        <FormPrevious size={'20px'} style={{ userSelect: "none"}} />
      </NavigationItem>
      {showPages &&
        <NavigationItem>
          <Text size={'small'}>Page {formatNumber(+currentPage)} of {formatNumber(+totalPages)}</Text>
        </NavigationItem>
      }
      <NavigationItem disabled={disableNextBtn} onClick={disableNextBtn ? undefined : onNextPageClick}>
        <FormNext size={'20px'} style={{ userSelect: "none" }} />
      </NavigationItem>
      {showPages &&
        <NavigationItem disabled={disableNextBtn} onClick={disableNextBtn ? undefined : onLastPageClick}>
          Last
        </NavigationItem>
      }
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
      <Box style={{ width: "105px" }}>
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
