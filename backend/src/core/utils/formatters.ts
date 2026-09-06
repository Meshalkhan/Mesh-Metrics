const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1
});

const standardCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const standardNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0
});

export const formatCurrency = (value: number) => standardCurrency.format(Math.round(value));
export const formatCompactCurrency = (value: number) => compactCurrency.format(Math.round(value));
export const formatNumber = (value: number) => standardNumber.format(Math.round(value));
export const formatPercent = (value: number, fractionDigits = 1) => `${value.toFixed(fractionDigits)}%`;
