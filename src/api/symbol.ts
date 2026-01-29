export function normalizeTaiwanSymbol(input: string): string {
  const trimmed = input.trim().toUpperCase();

  if (!trimmed) return trimmed;

  // If already has a market suffix, respect it.
  if (trimmed.includes('.')) {
    return trimmed;
  }

  // Default to TW market for numeric codes like 2330
  return `${trimmed}.TW`;
}

