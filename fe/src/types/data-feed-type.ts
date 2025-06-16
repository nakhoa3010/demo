export interface DataFeedItem {
  address: string;
  name: string;
  decimals: number;
  lastedPrice: string;
  marketCap: number;
  chainId: number;
  chainName: string;
  iconUrl: string;
  type: 'premium' | 'basic';
}
