import { apiRequest } from './client';
import type { IndicatorsResponse, StockDataResponse } from './types';
import { normalizeTaiwanSymbol } from './symbol';

export async function fetchStockData(
  rawSymbol: string,
  period: string = '10y',
  signal?: AbortSignal
): Promise<StockDataResponse> {
  const symbol = normalizeTaiwanSymbol(rawSymbol);
  const query = new URLSearchParams({ period }).toString();

  return apiRequest<StockDataResponse>(
    `/api/v1/stock/${encodeURIComponent(symbol)}/data?${query}`,
    { method: 'GET', signal }
  );
}

export async function fetchStockIndicators(
  rawSymbol: string,
  period: string = '10y',
  signal?: AbortSignal
): Promise<IndicatorsResponse> {
  const symbol = normalizeTaiwanSymbol(rawSymbol);
  const query = new URLSearchParams({ period }).toString();

  return apiRequest<IndicatorsResponse>(
    `/api/v1/stock/${encodeURIComponent(symbol)}/indicators?${query}`,
    { method: 'GET', signal }
  );
}

