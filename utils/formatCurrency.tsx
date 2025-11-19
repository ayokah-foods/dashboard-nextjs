export const formatAmount = (
  value: string | number = 0,
  currency: string = "gbp",
  locale: string = "en-GB"
) => {
  const numericValue = Number(value);

  return isNaN(numericValue)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }).format(0)
    : new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }).format(numericValue);
};
