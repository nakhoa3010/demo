import { QueryKeys } from '@/lib/query/query-keys';
import { axiosClientInstance } from '@/lib/utils/api-client';
import { IADCSItem } from '@/types/adcs-type';
import { useQuery } from '@tanstack/react-query';

export const useAllADCSQuery = () => {
  const { data, isLoading, isFetching, error } = useQuery<IADCSItem[]>({
    queryKey: [QueryKeys.allADCS],
    queryFn: async () => {
      return axiosClientInstance.get('v1/adapter/all');
    },
  });

  return {
    adcsData: data || [],
    isLoadingADCS: isLoading || isFetching,
    errorADCS: error,
  };
};
