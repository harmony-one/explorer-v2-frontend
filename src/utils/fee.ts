export const calculateFee = (gas: string, gasPrice: string) => {
  const fee =
    isNaN(+gas) || isNaN(+gasPrice)
      ? 0
      : (Number(gas) * Number(gasPrice)) /
      10 ** 14 /
      10000;

  return Intl.NumberFormat("en-US", {
    maximumFractionDigits: 18,
  }).format(fee);
}

export const calculateFeePriceUSD = (gas: string, gasPrice: string, onePrice: string | number) => {
  const fee = calculateFee(gas, gasPrice)
  return (+fee * +onePrice).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
    currency: "USD",
  })
}
