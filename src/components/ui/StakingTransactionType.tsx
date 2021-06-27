import { Text } from "grommet";
import { StakingTransactionType } from "src/types";

interface IStakingTransactionType {
  type: StakingTransactionType;
}

export const StakingTransactionTypeValue = (props: IStakingTransactionType) => {
  const { type } = props;
  return (
    <Text size="small" margin={{ right: "xxmall" }}>
      {typeMap[type] || type}
    </Text>
  );
};

const typeMap: Record<StakingTransactionType, string> = {
  CreateValidator: "Create Validator",
  EditValidator: "Edit Validator",
  CollectRewards: "Collect Rewards",
  Undelegate: "Undelegate",
  Delegate: "Delegate",
};
