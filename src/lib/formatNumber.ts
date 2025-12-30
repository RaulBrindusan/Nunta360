/**
 * Format numbers in Romanian style: 10.000,50
 * - Dots (.) for thousands separators
 * - Comma (,) for decimal separator
 */
export function formatCurrency(amount: number, decimals: number = 2): string {
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format numbers without decimals: 10.000
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format input value as user types: 10.000
 * Accepts string input and returns formatted string
 */
export function formatInputValue(value: string): string {
  // Remove all non-digit characters except comma
  const cleanValue = value.replace(/[^\d,]/g, '');

  // Split by comma to handle decimal part
  const parts = cleanValue.split(',');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Format integer part with dots as thousands separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Combine with decimal part if exists
  return decimalPart !== undefined
    ? `${formattedInteger},${decimalPart}`
    : formattedInteger;
}

/**
 * Parse formatted input value to number
 * Converts "10.000,50" to 10000.50
 */
export function parseInputValue(value: string): number {
  // Remove dots (thousands separators) and replace comma with dot for decimal
  const cleanValue = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
}
