import queryString from 'query-string';

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function convertToSubcurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getQueryString = (obj: object) => {
  return queryString.stringify(obj);
};

export const showTransactionHash = (txHash: string) => {
  return txHash.slice(0, 6) + '...' + txHash.slice(-4);
};
