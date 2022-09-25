import React from "react";
import { Box, Heading, Text } from "grommet";
import { BasePage, BaseContainer } from "src/components/ui";
import {Route, Switch, useHistory, useLocation, useParams, useRouteMatch} from "react-router-dom";
import {ActiveAddresses} from "./ActiveAddresses";

export function ChartsPage() {
    // @ts-ignore
    const { shardNumber } = useParams();

    const history = useHistory();
    const location = useLocation();
    const [, ,route] = location.pathname.split('/')

    const navigate = (path: string) => history.push(path)

    if(route === 'addresses') {
        return <ActiveAddresses />
    }

    return (
        <BaseContainer pad={{ horizontal: "0" }}>
            <Heading size="small" margin={{ bottom: "medium", top: "0" }}>
                <Box direction={"row"}>Harmony One Charts</Box>
            </Heading>
            <BasePage pad={"small"} style={{overflow: 'inherit'}}>
                <Box style={{ width: "200px" }} direction={"row"} align={'center'}>
                    <Text onClick={() => navigate('/charts/addresses')}>daily active addresses</Text>
                </Box>
            </BasePage>
        </BaseContainer>
    );
}
