import { Box, Spinner, Text } from "grommet";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { TableComponent } from "src/components/tables/TableComponents";
import { getApprovalsColumns } from "./approvalsColumns";
import { Address } from "src/components/ui";
import { ApprovalDetails } from "src/types";

import { ApprovalSearch } from "./approvalSearch";

const ViewWrapper = styled(Box)`
  border: 1px solid #e7ecf7;
  border-radius: 5px;
`;

const NameWrapper = styled(Box)`
  border-bottom: 1px solid #e7ecf7;
  padding: 10px;
  opacity: 0.7;
  border-radius: 5px;
  `;

export function ApprovalsRenderer(props: {
    data: ApprovalDetails[],
    isLoading: boolean,
    revokeClicked: (tx: ApprovalDetails) => void,
    account: string,
    contractAddress?: string,
    title?: string
}) {
    const [data, setData] = useState<ApprovalDetails[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setData(props.data);
        }
        else {
            // finish loading, sort
            setData(props.data.sort((a, b) => b.lastUpdated > a.lastUpdated ? 1 : -1));
        }
    }, [props.data, props.isLoading])

    useEffect(() => {
        setIsLoading(props.isLoading);
    }, [props.isLoading])

    return (
        <ViewWrapper direction='column' margin={{ bottom: 'medium' }}>
            <ApprovalSearch
                data={props.data}
                dataFiltered={setData}
            />
            
            <NameWrapper background={'backgroundBack'}>
                <Text size='small'>
                    Approved Spenders {props.contractAddress ? <>for <Address address={props.contractAddress} /></> : props.title || ""}
                </Text>
            </NameWrapper>
            <TableComponent tableProps={{
                className: "g-table-header",
                style: { width: "100%", tableLayout: 'auto', top: "12px" },
                columns: getApprovalsColumns(props.revokeClicked),
                data: data,
                border: {
                    header: {
                        color: "brand",
                    },
                    body: {
                        color: "border",
                        side: "top",
                        size: "1px",
                    },
                },
                primaryKey: "hash"
            }} />{isLoading && <Box justify="center" align="center" height="110px">
                <Spinner size="small" />
            </Box>}
            {!isLoading && props.account?.length > 0 && data.length === 0 && <Box justify="center" align="center" height="110px" direction="row">
                <Text size="small" color={"minorText"} margin={{ right: "10px" }}>No approvals found for</Text>
                <Address address={props.account} />
                <Text size="small" color={"minorText"} margin={{ left: "10px" }}>
                    {props.contractAddress ? <>for <Address address={props.contractAddress} /></> : props.title || ""}
                </Text>
            </Box>}
        </ViewWrapper>
    );
}
