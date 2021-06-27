import React, { useEffect } from "react";
import { Box } from "grommet";
import { Filter } from "src/types";
import { FormPrevious, FormNext } from "grommet-icons";

interface PaginationNavigator {
  filter: Filter;
  blocks: any[];
  totalElements: number;
  onChange: (filter: Filter) => void;
  property: string;
}

export function PaginationBlockNavigator(props: PaginationNavigator) {
  const { blocks, totalElements, filter, onChange, property } = props;
  const { filters, limit = 10 } = filter;
  const { value } = filters[0];

  useEffect(() => {
    const scrollBody = document.getElementById("scrollBody");

    if (scrollBody) {
      scrollBody.scrollTo({ top: 0 });
    }
  }, [filter]);

  const blockNumbers = blocks.map((b) => +b.number);
  const minBlockNumber = blockNumbers.reduce(
    (a, b) => (a === -1 || a > b ? b : a),
    -1
  );
  const maxBlockNumber = blockNumbers.reduce((a, b) => Math.max(a, b), 0);

  const onPrevClick = () => {
    const newFilter = JSON.parse(JSON.stringify(filter)) as Filter;
    const innerFilter = newFilter.filters.find((i) => i.property === property);
    if (innerFilter) {
      innerFilter.type = "lt";
      innerFilter.value = maxBlockNumber + limit + 1;
    }

    onChange(newFilter);
  };

  const onNextClick = () => {
    const newFilter = JSON.parse(JSON.stringify(filter)) as Filter;
    const innerFilter = newFilter.filters.find((i) => i.property === property);
    if (innerFilter) {
      innerFilter.type = "lt";
      innerFilter.value = minBlockNumber;
    }

    onChange(newFilter);
  };

  return (
    <Box style={{ flex: "1 0 auto" }}>
      <Pagination
        currentPage={+((totalElements - +value) / limit).toFixed(0) + 1}
        totalPages={+(Number(totalElements) / limit).toFixed(0)}
        onPrevPageClick={onPrevClick}
        onNextPageClick={onNextClick}
      />
    </Box>
  );
}
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPageClick: () => void;
  onNextPageClick: () => void;
}

function Pagination(props: PaginationProps) {
  const { onPrevPageClick, onNextPageClick } = props;
  return (
    <Box direction="row" gap="small" justify="end">
      <FormPrevious
        onClick={onPrevPageClick}
        style={{ cursor: "pointer", userSelect: "none" }}
      />
      <FormNext
        onClick={onNextPageClick}
        style={{ cursor: "pointer", userSelect: "none" }}
      />
    </Box>
  );
}

// interface ElementsPerPage {
//   filter: Filter;
//   onChange: (filter: Filter) => void;
//   options?: number[];
// }
//
// const defaultOptions: string[] = ["10", "25", "50", "100"];

// export function PaginationBlockRecordsPerPage(props: ElementsPerPage) {
//   const { filter, options = defaultOptions, onChange } = props;
//   const { limit = 10 } = filter;
//
//   const onChangeLimit = (props: { option: number }) => {
//     const newFilter = JSON.parse(JSON.stringify(filter)) as Filter;
//     newFilter.limit = Number(props.option);
//     onChange(newFilter);
//   };
//
//   return (
//     <Box direction="row" gap="small" align="center">
//       <Box style={{ width: "95px" }}>
//         <Select
//           options={options}
//           value={limit.toString()}
//           onChange={onChangeLimit}
//         />
//       </Box>
//       <Text size="small">records per page</Text>
//     </Box>
//   );
// }
