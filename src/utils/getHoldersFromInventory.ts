import { IHoldersInfo, IUserERC721Assets } from "src/api/client.interface";

interface props {
  inventory: IUserERC721Assets[];
}
export const getHoldersFromInventory = ({
  inventory
}: props) => {
  let holdersData: IHoldersInfo[] = [];
  
  const existed = {} as any;
  holdersData = inventory
    .map((item) => {
      return {
        tokenAddress: item.tokenAddress,
        ownerAddress: item.ownerAddress || item.tokenID,
        tokenID: item.tokenID,
        needUpdate: item.needUpdate,
        lastUpdateBlockNumber: item.lastUpdateBlockNumber,
        balance:
          inventory?.filter(
            (inventory) =>
              (inventory.ownerAddress || inventory.tokenID) ===
              item.ownerAddress
          ).length || 0,
      };
    })
    .filter((item) => {
      if (existed[item.ownerAddress || item.tokenID]) {
        return false;
      } else {
        existed[item.ownerAddress || item.tokenID] = true;
        return true;
      }
    })
    .sort((a, b) => b.balance - a.balance);

  return holdersData
};