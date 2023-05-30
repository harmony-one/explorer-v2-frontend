import { RPCStakingTransactionHarmony } from "src/types";
import { BasePage } from "src/components/ui";

import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Box, Text } from "grommet";
import { getStakingTransactionByField } from "src/api/client";
import { TransactionDetails } from "src/components/transaction/TransactionDetails";
import { StakingTransactionType } from "src/types";
import { TransactionSubType } from "src/components/transaction/helpers";
import { hmyv2_getTransactionReceipt } from "src/api/rpc";
import { config } from "../../config";

export const StakingTransactionPage = () => {
  // @ts-ignore
  const { id } = useParams();
  const [tx, setTx] = useState<RPCStakingTransactionHarmony | null>(null);

  const { availableShards } = config

  useEffect(() => {
    const exec = async () => {
      let tx;
      let shardNumber = 0;
      if (id.length === 66) {
        tx = await getStakingTransactionByField([0, "hash", id]);

        if (!tx && availableShards.find((i) => i === 1)) {
          shardNumber = 1;
          tx = await getStakingTransactionByField([1, "hash", id]);
        }

        if (!tx && availableShards.find((i) => i === 2)) {
          shardNumber = 2;
          tx = await getStakingTransactionByField([2, "hash", id]);
        }

        if (!tx && availableShards.find((i) => i === 3)) {
          shardNumber = 3;
          tx = await getStakingTransactionByField([3, "hash", id]);
        }

        try {
          const txnReceipt = await hmyv2_getTransactionReceipt([id], shardNumber)
          if (txnReceipt && txnReceipt.result) {
            if (tx.type === "CollectRewards" && tx.amount === null) {
              tx.amount = txnReceipt.result.logs[0].data
            }

            if (txnReceipt.result.gasUsed) {
              tx.gasLimit = tx.gas
              tx.gas = parseInt(txnReceipt.result.gasUsed).toString();
            }
          }
        } catch {}
      }
      setTx(tx as RPCStakingTransactionHarmony);
    };
    exec();
  }, [id]);

  if (!tx) {
    return null;
  }

  const { amount, ...restTx } = tx;

  const { amount: amountMsg, ...restTxMsg } = tx.msg || {};

  return (
    <BasePage>
      <Box border={{ size: "xsmall", side: "bottom", color: "border" }}>
        <Text size="large" weight="bold" margin={{ bottom: "small" }}>
          Staking Transaction
        </Text>
      </Box>

      <TransactionDetails transaction={restTx} type="__staking" errorMsg={""} />
      <Box
        margin={{ top: "medium" }}
        pad={{ bottom: "small" }}
        border={{ size: "xsmall", side: "bottom", color: "border" }}
      >
        <Text size="large">Staking Data</Text>
      </Box>
      <TransactionDetails
        transaction={
          tx.type === "CollectRewards"
            ? {
                ...tx.msg,
                amount: amount,
              }
            : tx.type === "EditValidator"
            ? restTxMsg
            : tx.msg
        }
        type={subTypeMap[tx.type] || ""}
        stakingData
        errorMsg={""}
        hideShowMore={true}
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
