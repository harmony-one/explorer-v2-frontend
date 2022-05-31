import { Box, TextInput } from "grommet";
import { palette } from "src/theme";
import styled from "styled-components";


interface IAbiParam {
    name?: string;
    readonly?: boolean;
    type: string;
    value: string;
}

const SmallTextInput = styled(TextInput)`
  font-size: 14px;
  font-weight: 400;

  ::placeholder {
    font-size: 14px;
  }
`;

const HeaderBox = styled(Box)`
  font-size:12px;
`
const NameLabel = styled.div`
    color: ${palette.ElectricBlue};
    margin-right: 20px;
`


export const AbiParam = (props: IAbiParam) => {
    const {
        name,
        readonly,
        type,
        value,
    } = props;

    function valueInput() {
        return <SmallTextInput value={value} readOnly={readonly} />
    }

    return <Box className="param-box" direction="column" pad="none">
        <HeaderBox direction="row" align="center">
            {name && <NameLabel>{name}</NameLabel>}
            <i>{type}</i>
        </HeaderBox>

        {valueInput()}
    </Box>
};
