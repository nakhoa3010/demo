import { QueryKeys } from '@/lib/query/query-keys';
import { axiosClientInstance } from '@/lib/utils/api-client';
import { DataFeedItem } from '@/types/data-feed-type';
import { useQuery } from '@tanstack/react-query';

export const useAllDataFeedQuery = () => {
  const { data, isLoading, isFetching, error } = useQuery<DataFeedItem[]>({
    queryKey: [QueryKeys.allDataFeed],
    queryFn: async () => {
      return axiosClientInstance.get('v1/data-feed');
    },
  });

  return {
    feedsData: data,
    isLoadingDataFeed: isLoading || isFetching,
    errorDataFeed: error,
  };
};
