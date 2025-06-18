/* eslint-disable @typescript-eslint/no-explicit-any */
export const QueryKeys = {
  home: ['home'] as const,
  allDataFeed: ['all-data-feed'] as const,
  allAccounts: ['all-accounts'] as const,
  allADCS: ['all-adcs'] as const,
  accountDetail: (accountId: string) => ['account-detail', accountId] as const,
};

export type QueryKeyFromFn<T> = T extends (...args: any[]) => infer R ? R : T;
