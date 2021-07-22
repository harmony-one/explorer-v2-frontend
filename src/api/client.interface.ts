export interface IUserERC721Assets {
  lastUpdateBlockNumber: null | number;
  meta?: {
    attributes: { value: string; trait_type: string }[];
    collection_id: string;
    collection_url: string;
    core: any;
    description: string;
    external_url: string;
    id: string;
    image: string;
    license: string;
    name: string;
    type?: string;
    youtube_url?: string;
    symbol?: string;
    external_link?: string;
  };
  needUpdate: boolean;
  ownerAddress: string;
  tokenAddress: string;
  tokenID: string;
  tokenURI: string;
  type?: string;
}

export type TRelatedTransaction =
  | "transaction"
  | "staking_transaction"
  | "internal_transaction"
  | "erc20"
  | "erc1155"
  | "erc721";

export interface IPairPrice {
  askPrice: string;
  askQty: string;
  bidPrice: string;
  bidQty: string;
  closeTime: number;
  count: number;
  firstId: number;
  highPrice: string;
  lastId: number;
  lastPrice: string;
  lastQty: string;
  lowPrice: string;
  openPrice: string;
  openTime: number;
  prevClosePrice: string;
  priceChange: string;
  priceChangePercent: string;
  quoteVolume: string;
  symbol: string;
  volume: string;
  weightedAvgPrice: string;
}

export interface IHoldersInfo {
  balance: string | number;
  lastUpdateBlockNumber: string | number | null;
  needUpdate: boolean;
  ownerAddress: string;
  tokenAddress: string;
}
