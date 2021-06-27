import React from "react";
import { Box, Heading, Text } from "grommet";
import { BasePage, BaseContainer } from "src/components/ui";
import { AllBlocksTable } from "./AllBlocksTable";
import { useHistory, useParams } from "react-router-dom";
import { ShardDropdown } from "src/components/ui/ShardDropdown";

export function AllBlocksPage() {
  // @ts-ignore
  const { shardNumber } = useParams();

  const history = useHistory();

  return (
    <BaseContainer pad={{ horizontal: "0" }}>
      <Heading size="small" margin={{ bottom: "medium", top: "0" }}>
        <Box direction={"row"}>Blocks</Box>
      </Heading>
      <BasePage pad={"small"} style={{overflow: 'inherit'}}>
        <Box style={{ width: "200px" }} direction={"row"} align={'center'}>
          <Text>Filter: </Text>
          <ShardDropdown
            selected={shardNumber}
            onClick={(shardNumber) =>
              history.push(`/blocks/shard/${shardNumber}`)
            }
          />
        </Box>
      </BasePage>
      <BasePage>
        <AllBlocksTable />
      </BasePage>
    </BaseContainer>
  );
}
