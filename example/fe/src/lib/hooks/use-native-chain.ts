import { useAccount, useBalance } from 'wagmi';
import { formatWithDecimals } from '../utils/format';

export default function useNativeChain() {
  const { address } = useAccount();

  const {
    data: balance,
    refetch: onRefetchBalance,
    isLoading,
    isFetching,
  } = useBalance({
    address: address,
    query: {
      enabled: !!address,
      retry: false,
    },
  });

  return {
    balance,
    balanceValue: formatWithDecimals(Number(balance?.value ?? 0), balance?.decimals ?? 18),
    isLoadingNativeBalance: isLoading || isFetching,
    onRefetchBalance,
  };
}
