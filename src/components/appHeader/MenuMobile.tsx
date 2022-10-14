import {Box, Text} from "grommet";
import {useHistory} from "react-router-dom";
import {useState} from "react";
import {CaretDownFill, CaretUpFill, Sun, Moon, Clock, Calendar} from "grommet-icons";
import {setThemeMode, useThemeMode} from "../../hooks/themeSwitcherHook";
import {DateFormat, setDateFormatMode, useDateFormatMode} from "../../hooks/dateFormatSwitcherHook";

interface MenuRowItem {
    title: string
    route?: string
    content?: any
}

interface MenuRowProps {
    title: string
    items: MenuRowItem[]
    route?: string
    onSelect?: (title: string, route?: string) => void
}

const MenuItem = (props: { item: MenuRowItem, onSelect?: (title: string, route?: string) => void }) => {
    const { item: { title, route, content }, onSelect } = props
    const onClick = (e: any) => {
        e.stopPropagation()
        if(onSelect) {
            onSelect(title, route)
        }
    }
    return <Box pad={'8px 32px'} onClick={onClick}>
        <Text size={'small'}>{title}</Text>
        {!!content &&
            content
        }
    </Box>
}

const MenuRow = (props: MenuRowProps) => {
    const [isItemsVisible, setItemsVisible] = useState(false)
    const {title, items, route, onSelect} = props

    const onClick = () => {
        if(route && onSelect) {
            onSelect(title, route)
        }
        if(items.length > 0) {
            setItemsVisible(!isItemsVisible)
        }
    }

    return <Box pad={'4px 16px'} onClick={onClick}>
        <Box direction={'row'} justify={'between'} pad={'8px'}>
            <Text size={'medium'} color={isItemsVisible ? 'brand' : 'text'}>{title}</Text>
            {items.length > 0 && !isItemsVisible && <CaretDownFill size={'16px'} color={'text'} /> }
            {items.length > 0 && isItemsVisible && <CaretUpFill size={'16px'} color={'brand'} /> }
        </Box>
        {isItemsVisible &&
            <Box style={{ position: 'relative' }}>
                <Box width={'2px'} height={'100%'} margin={{ left: '12px' }} background={'brand'} style={{ position: 'absolute' }} />
                {items.map((item, i) => <MenuItem key={item.title + i} item={item} onSelect={onSelect} />)}
            </Box>
        }
    </Box>
}

export const MenuMobile = (props: { isOpened: boolean; onClose: () => void }) => {
    const history = useHistory();

    const onSelect = (title: string, route?: string) => {
        if(route) {
            history.push(route);
            props.onClose()
        }
    }

    const ThemeSwitch = () => {
        const theme = useThemeMode();
        return <Box direction={'row'}
                    gap={'8px'}
                    align={'center'}
                    onClick={() => setThemeMode(theme === 'light' ? 'dark' : 'light')}>
            <Box>{theme === 'light' ? <Moon /> : <Sun />}</Box>
            <Box>{theme === 'light' ? 'Switch to Dark mode' : 'Switch to Light mode'}</Box>
        </Box>
    }

    const DateFormatSwitch = () => {
        const dateFormat = useDateFormatMode();
        return <Box direction={'row'}
                    gap={'8px'}
                    align={'center'}
                    onClick={() => setDateFormatMode(dateFormat === DateFormat.EXACT ? DateFormat.RELATIVE : DateFormat.EXACT)}
        >
            <Box>{dateFormat === DateFormat.EXACT ? <Clock height={'2px'} /> : <Calendar height={'2px'} />}</Box>
            <Box>{dateFormat === DateFormat.EXACT ? 'Switch to Relative dates' : 'Switch to Exact dates'}</Box>
        </Box>
    }

    return <Box pad={'8px 0'} background={'background'} style={{ display: props.isOpened ? 'block' : 'none' }}>
        <MenuRow title={'Home'} items={[]} route={'/'} onSelect={onSelect} />
        <MenuRow title={'Tokens'} items={[{ title: 'HRC20', route: '/hrc20' }, { title: 'HRC721', route: '/hrc721' }, { title: 'HRC1155', route: '/hrc1155' }]} onSelect={onSelect} />
        <MenuRow title={'Tools'} items={[{ title: 'Token Approvals', route: '/tools/approvals' }, { title: 'Check HRC', route: '/tools/checkHrc' }, { title: 'Proxy Verification', route: '/proxyContractChecker' }]} onSelect={onSelect} />
        <MenuRow title={'Resources'} items={[{ title: 'Charts & Stats', route: '/charts' }, { title: 'Top Statistics', route: '/topstat' }]} onSelect={onSelect} />
        <MenuRow title={'Appearance'} items={[{ title: '', content: <ThemeSwitch /> }, { title: '', content: <DateFormatSwitch />}]} />
    </Box>
}
