//format date to dd-mm-yyyy hh:mm

export const shortAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

export const formatWithDecimals = (value: string | number, decimals = 18) => {
  return Number(value) / 10 ** decimals;
};

/**
 * format number to K, M, B, T
 */
export const formatNumberWithUnit = (value: number | string) => {
  const num = Number(value);
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return value.toString();
};
