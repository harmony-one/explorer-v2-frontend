import { Text } from "grommet";
import { TraceCallTypes } from "src/types";

interface ITransactionType {
  type: TraceCallTypes;
}

export const TransactionType = (props: ITransactionType) => {
  const { type } = props;
  return (
    <Text size="small" margin={{ right: "xxmall" }}>
      {typeMap[type] || type}
    </Text>
  );
};

const typeMap: Record<string, string> = {
  call: "Call",
  staticcall: "Static Call",
  create: "Create",
  create2: "Create 2",
  delegatecall: "Delegate Call",
};
