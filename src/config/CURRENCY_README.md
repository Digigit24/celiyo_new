# Currency Configuration

This document explains how to use the global currency configuration in the application.

## Configuration File

The currency settings are centralized in `src/config/currency.config.ts`

## Available Exports

### 1. CURRENCY_CONFIG

A constant object containing all currency-related settings:

```typescript
import { CURRENCY_CONFIG } from '@/config/currency.config';

// Available properties:
CURRENCY_CONFIG.code           // 'INR'
CURRENCY_CONFIG.symbol         // '₹'
CURRENCY_CONFIG.name           // 'Indian Rupee'
CURRENCY_CONFIG.locale         // 'en-IN'
CURRENCY_CONFIG.decimalPlaces  // 2
```

### 2. formatCurrency()

Format amount with currency symbol and fixed decimal places:

```typescript
import { formatCurrency } from '@/config/currency.config';

formatCurrency(1234.5)           // '₹1234.50'
formatCurrency('1234.5')         // '₹1234.50'
formatCurrency(1234.5, false)    // '1234.50' (without symbol)
```

### 3. formatCurrencyWithLocale()

Format amount with locale-specific thousands separator (Indian numbering system):

```typescript
import { formatCurrencyWithLocale } from '@/config/currency.config';

formatCurrencyWithLocale(123456.78)        // '₹1,23,456.78'
formatCurrencyWithLocale('123456.78')      // '₹1,23,456.78'
formatCurrencyWithLocale(123456.78, false) // '1,23,456.78' (without symbol)
```

## Usage Examples

### In Components

```tsx
import { CURRENCY_CONFIG, formatCurrency } from '@/config/currency.config';

// Display currency symbol
<span>{CURRENCY_CONFIG.symbol}{amount}</span>

// Using helper function
<span>{formatCurrency(bill.total_amount)}</span>

// With locale formatting
<span>{formatCurrencyWithLocale(bill.total_amount)}</span>
```

### Current Pattern in Codebase

Most of the codebase currently uses inline formatting:

```tsx
// Current pattern
<span>₹{parseFloat(amount).toFixed(2)}</span>
<span>₹{amount.toLocaleString()}</span>
```

### Recommended Pattern

```tsx
// Recommended - using global config
import { CURRENCY_CONFIG, formatCurrency, formatCurrencyWithLocale } from '@/config/currency.config';

// Simple display with symbol
<span>{CURRENCY_CONFIG.symbol}{amount}</span>

// With proper formatting
<span>{formatCurrency(amount)}</span>

// With thousands separator (Indian format)
<span>{formatCurrencyWithLocale(amount)}</span>
```

## Benefits

1. **Centralized Configuration**: Change currency in one place
2. **Type Safety**: TypeScript ensures correct usage
3. **Consistency**: Same formatting across the app
4. **Easy Migration**: Switch to different currency by updating config
5. **Locale Support**: Proper Indian numbering format (₹1,23,456.78)

## Migration Guide

To migrate existing code to use the global config:

### Before:
```tsx
<span>₹{parseFloat(bill.total_amount).toFixed(2)}</span>
```

### After:
```tsx
import { formatCurrency } from '@/config/currency.config';

<span>{formatCurrency(bill.total_amount)}</span>
```

### Before:
```tsx
<span>₹{stats.total_amount.toLocaleString()}</span>
```

### After:
```tsx
import { formatCurrencyWithLocale } from '@/config/currency.config';

<span>{formatCurrencyWithLocale(stats.total_amount)}</span>
```

## Icons

All currency icons now use `IndianRupee` from lucide-react:

```tsx
import { IndianRupee } from 'lucide-react';

<IndianRupee className="h-5 w-5" />
```

## Changing Currency

To change the currency to a different one (e.g., USD), update `src/config/currency.config.ts`:

```typescript
export const CURRENCY_CONFIG = {
  code: 'USD',
  symbol: '$',
  name: 'US Dollar',
  locale: 'en-US',
  decimalPlaces: 2,
} as const;
```

And update icon imports from `IndianRupee` to `DollarSign` where needed.
