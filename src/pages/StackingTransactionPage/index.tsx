import { RPCStakingTransactionHarmony } from "src/types";
import { BasePage } from "src/components/ui";

import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Box, Text } from "grommet";
import { getStakingTransactionByField } from "src/api/client";
import { TransactionDetails } from "src/components/transaction/TransactionDetails";
import { StakingTransactionType } from "src/types";
import { TransactionSubType } from "src/components/transaction/helpers";

export const StakingTransactionPage = () => {
  // @ts-ignore
  const { id } = useParams();
  const [tx, setTx] = useState<RPCStakingTransactionHarmony | null>(null);

  useEffect(() => {
    const exec = async () => {
      let tx;
      if (id.length === 66) {
        tx = await getStakingTransactionByField([0, "hash", id]);
      }
      setTx(tx as RPCStakingTransactionHarmony);
    };
    exec();
  }, [id]);

  if (!tx) {
    return null;
  }

  return (
    <BasePage>
      <Box border={{ size: "xsmall", side: "bottom", color: "border" }}>
        <Text size="large" weight="bold" margin={{ bottom: "small" }}>
          Staking Transaction
        </Text>
      </Box>

      <TransactionDetails transaction={tx} type="__staking" errorMsg={''} />
      <Box
        margin={{ top: "medium" }}
        pad={{ bottom: "small" }}
        border={{ size: "xsmall", side: "bottom", color: "border" }}
      >
        <Text size="large">Staking Data</Text>
      </Box>
      <TransactionDetails
        transaction={tx.msg}
        type={subTypeMap[tx.type] || ""}
        errorMsg={''}
      />
    </BasePage>
  );
};

const subTypeMap: Record<StakingTransactionType, TransactionSubType> = {
  Delegate: "__delegated",
  Undelegate: "__undelegated",
  CollectRewards: "",
  CreateValidator: "",
  EditValidator: "",
};
