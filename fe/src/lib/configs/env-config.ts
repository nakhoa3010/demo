export const envConfig = {
  baseExplorerUrl: process.env.NEXT_PUBLIC_BASE_EXPLORER_URL,
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
  PREPAYMENT_ADDRESS: process.env.NEXT_PUBLIC_PREPAYMENT_ADDRESS || '',
};

export default envConfig;
