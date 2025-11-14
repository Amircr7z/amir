
export const truncateAddress = (address: string, chars = 4): string => {
  if (!address) return "";
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
};
