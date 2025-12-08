/**
 * Global Currency Configuration
 *
 * This file contains the application-wide currency settings.
 * All currency-related displays should use these constants.
 */

export const CURRENCY_CONFIG = {
  code: 'INR',
  symbol: '₹',
  name: 'Indian Rupee',
  locale: 'en-IN',
  decimalPlaces: 2,
} as const;

/**
 * Format amount with currency symbol
 * @param amount - The amount to format
 * @param showSymbol - Whether to show currency symbol (default: true)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number | string,
  showSymbol: boolean = true
): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return showSymbol ? `${CURRENCY_CONFIG.symbol}0.00` : '0.00';
  }

  const formatted = numAmount.toFixed(CURRENCY_CONFIG.decimalPlaces);
  return showSymbol ? `${CURRENCY_CONFIG.symbol}${formatted}` : formatted;
};

/**
 * Format amount with locale-specific thousands separator
 * @param amount - The amount to format
 * @param showSymbol - Whether to show currency symbol (default: true)
 * @returns Formatted currency string with locale formatting
 */
export const formatCurrencyWithLocale = (
  amount: number | string,
  showSymbol: boolean = true
): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return showSymbol ? `${CURRENCY_CONFIG.symbol}0` : '0';
  }

  const formatted = numAmount.toLocaleString(CURRENCY_CONFIG.locale, {
    minimumFractionDigits: CURRENCY_CONFIG.decimalPlaces,
    maximumFractionDigits: CURRENCY_CONFIG.decimalPlaces,
  });

  return showSymbol ? `${CURRENCY_CONFIG.symbol}${formatted}` : formatted;
};
