import { Box, TextInput } from "grommet";
import { useCallback, useEffect, useState } from "react";
import { ApprovalDetails } from "src/types";
import { useThemeMode } from "src/hooks/themeSwitcherHook";
import { Search } from "grommet-icons";
import { useERC20Pool } from "src/hooks/ERC20_Pool";
import { useERC721Pool } from "src/hooks/ERC721_Pool";
import { useERC1155Pool } from "src/hooks/ERC1155_Pool";
import { binanceAddressMap } from "src/config/BinanceAddressMap";

let timeoutID: any | null = null;
const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

export function ApprovalSearch(props: {
    data: ApprovalDetails[],
    dataFiltered: (data: ApprovalDetails[]) => void,
}) {
    const [data, setData] = useState<ApprovalDetails[]>([]);
    const [value, setValue] = useState("");
    const [readyFilter, setReadyFilter] = useState(false);

    const themeMode = useThemeMode();

    const erc20Map = useERC20Pool();
    const erc721Map = useERC721Pool();
    const erc1155Map = useERC1155Pool();

    const resolveName = (address: string) => {

        if (!address) {
            return "";
        }

        let parsedName = address;

        if (erc20Map[address]) {
            parsedName = erc20Map[address].name;
        }

        if (erc721Map[address]) {
            parsedName = erc721Map[address].name;
        }

        if (erc1155Map[address]) {
            parsedName = erc1155Map[address].name;
        }

        if (binanceAddressMap[address]) {
            parsedName = binanceAddressMap[address];
        }

        parsedName = address === EMPTY_ADDRESS ? "0x0" : parsedName;
        return parsedName.toLowerCase();
    }

    useEffect(() => {
        setData(props.data.sort((a, b) => b.lastUpdated > a.lastUpdated ? 1 : -1));
    }, [props.data])

    const onChange = useCallback((event) => {
        const { value: newValue } = event.target;
        setValue(newValue);
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => setReadyFilter(true), 200);
    }, []);

    useEffect(() => {
        setReadyFilter(false);
        const filterString = value.trim().toLowerCase();
        if (filterString.length === 0) {
            const sorted = props.data.sort((a, b) => b.lastUpdated > a.lastUpdated ? 1 : -1)
            setData(sorted);
            props.dataFiltered(sorted);
        } else {
            const filtered = props.data.filter(tx => {
                // filter asset
                // filter approver
                // filter allowance
                if (tx.allowance.toLowerCase().includes(filterString)) {
                    return true;
                }
                if (tx.spender.toLowerCase().includes(filterString)) {
                    return true;
                }
                if (tx.assetAddress.toLowerCase().includes(filterString)) {
                    return true;
                }
                if (resolveName(tx.assetAddress).includes(filterString)) {
                    return true;
                }
                if (resolveName(tx.spender).includes(filterString)) {
                    return true;
                }
                return false; // filtered
            });

            setData(filtered);
            props.dataFiltered(filtered);
        }
    }, [readyFilter]);

    return (
        <Box>
            <TextInput
                value={value}
                onChange={onChange}
                onPaste={(evt) => {
                    clearTimeout(timeoutID);
                    timeoutID = setTimeout(() => setReadyFilter(true), 200);
                }}
                onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                        clearTimeout(timeoutID);
                        timeoutID = setTimeout(() => setReadyFilter(true), 200);
                    }
                }}
                color="red"
                icon={<Search color="brand" />}
                style={{
                    backgroundColor: themeMode === "light" ? "white" : "transparent",
                    fontWeight: 500,
                    marginBottom: "10px"
                }}
                placeholder="Search by Asset / Spender / Allowance"
            />
        </Box>
    );
}
