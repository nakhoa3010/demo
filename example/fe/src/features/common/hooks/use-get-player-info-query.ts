import { useQuery } from '@tanstack/react-query';
import FlipCoinContract from '@/lib/contracts/flip-coin-contract';

const PlayerInfoQueryKey = 'player-info';

export const useGetPlayerInfoQuery = (address: string) => {
  return useQuery({
    enabled: !!address,
    throwOnError: true,
    queryKey: [PlayerInfoQueryKey, address],
    queryFn: async () => {
      const flipCoinContract = new FlipCoinContract();
      return flipCoinContract.getPlayerInfo(address);
    },
  });
};
