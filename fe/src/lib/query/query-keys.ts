/* eslint-disable @typescript-eslint/no-explicit-any */
export const QueryKeys = {
  home: ['home'] as const,
};

export type QueryKeyFromFn<T> = T extends (...args: any[]) => infer R ? R : T;
