export const formatAmount = (
    value: string | number = 0,
    currency: string = "GBP"
) => {
    const numericValue = Number(value);
    const amount = isNaN(numericValue) ? 0 : numericValue;
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: currency,
        currencyDisplay: "symbol",
        minimumFractionDigits: 2,
    }).format(amount);
};