import { axiosClientInstance } from '@/lib/utils/api-client';
import { useQuery } from '@tanstack/react-query';

interface IHistory {
  id: string;
  txHash: string;
  address: string;
  amount: string;
  bet: string;
  requestId: string;
  createdAt: string;
  updatedAt: string;
  betAmount: string;
  hasResult: boolean;
  result: string;
}

export default function useGetHistoryQuery() {
  const { data, isPending, error, refetch } = useQuery<IHistory[]>({
    queryKey: ['history'],
    queryFn: () => {
      return axiosClientInstance.get(`flipcoin/history`);
    },
  });

  return { history: data, isPending, error, refetch };
}
