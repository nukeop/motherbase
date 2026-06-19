export const formatPrice = (price: number | null): string => {
  if (price === null) {
    return "-";
  }
  return `$${price.toFixed(2)}`;
};

export const formatContext = (contextLength: number): string =>
  `${Math.round(contextLength / 1000)}K`;
