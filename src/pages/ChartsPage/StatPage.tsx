import {Box, Heading, Spinner, Text} from "grommet";
import {BaseContainer, BasePage} from "../../components/ui";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {useMediaQuery} from "react-responsive";
import { Alert, Info } from 'grommet-icons';

const TextLink = styled(Text)`
  cursor: pointer;
  text-decoration: underline;
`

const ChartModalContainer = styled(Box)`
`

const LoadingErrorModal = () => {
    return <ChartModalContainer
        justify={'center'}
        gap={'16px'}
        pad={'16px'}
        align={'center'}
        background={'warningBackground'}
        round={'8px'}
        border={{ size: '1px' }}
        style={{ zIndex: 1 }}
    >
        <Alert size={'medium'} />
        <Text>Error on loading data</Text>
        <Text size={'small'}>Please try again later</Text>
    </ChartModalContainer>
}

const parseKeyValue = (key : string) => {
    return key.replace(/([A-Z])/g, ' $1').trim().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export interface StatProps {
    title: string
    description?: string
    items: any[]
    keys: string[]
    infoLeft: string
    infoRight?: string
    isLoading: boolean
    loadingError?: string
}

export const StatPage = (props: StatProps) => {
    const { isLoading, loadingError } = props

    const rows = []
    for (let i = 0; i < props.items.length; i++) {
        rows.push(
            <Box 
                key={String(i)} 
                width={{width: '40%'}} 
                margin={{bottom: '8px'}} 
                border={{ size: '1px' }} 
                round={'8px'} 
                overflow={'hidden'}
            >
                <Box align='center' pad={'8px'} background={'backgroundDropdownItem'} >
                    <Text color={'brand'}>Shard {i}</Text>
                </Box>
                <Box align='center' pad={'8px'}>
                    {props.keys.map((key, _) => {
                        return <Text>{parseKeyValue(key)}: {props.items[i][key]}</Text>
                    })}
                </Box>
            </Box>
        )
    }

    const isMobile = useMediaQuery({ query: '(max-width: 868px)' })

    return <BaseContainer pad={{ horizontal: "0" }}>
        <Heading size="20px" margin={{ bottom: "medium", top: "0" }} style={{ maxWidth: 'unset' }}>
            <Box direction={'row'} justify={'between'} align={'center'}>
                <Box direction={"row"} gap={'8px'} align={'center'}>
                    <Box>
                        <Link to={'/charts'}><TextLink color={'brand'}>Charts</TextLink></Link>
                    </Box>
                    <Box>
                        <Text style={{ opacity: 0.4 }}>/</Text>
                    </Box>
                    <Box>
                        {props.title}
                    </Box>
                </Box>
                {!isMobile && props.description &&
                    <Box align={'end'}>
                        <Text size={'xsmall'} weight={'normal'}>{props.description}</Text>
                    </Box>
                }
            </Box>
        </Heading>
        <BasePage pad={"small"}>
            <Box direction={'row'} justify={'between'} flex={'grow'} wrap={true}>
                <Box direction={'row'} gap={'8px'} justify={'center'} align={'center'} style={{ flexGrow: 2 }}>
                    <Info size={'small'} />
                    <Text size={'small'}> {props.infoLeft} </Text>
                </Box>
               {props.infoRight && <Box direction={'row'} gap={'8px'} justify={'center'} align={'center'} style={{ flexGrow: 2 }}>
                    <Info size={'small'} />
                    <Text size={'small'}> {props.infoRight} </Text>
                </Box>}
            </Box>
        </BasePage>
        <BasePage pad={"small"} style={{overflow: 'inherit', marginTop: '16px'}}>
            <Box
                width={'100%'}
                height='280px' 
                direction={'row'} 
                justify={'evenly'} 
                align={'center'} 
                wrap={true}
            >
                {isLoading && <ChartModalContainer justify={'center'} gap={'16px'} align={'center'}>
                    <Spinner size={'medium'} />
                    <Text>Loading Data</Text>
                </ChartModalContainer>}
                {!isLoading && loadingError && <LoadingErrorModal />}
                {!isLoading && !loadingError && rows}
            </Box>
        </BasePage>
    </BaseContainer>
}
