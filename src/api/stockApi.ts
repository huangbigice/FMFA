import { apiRequest } from './client';
import type {
  BacktestResponse,
  IndicatorsResponse,
  PredictionResponse,
  StockDataResponse,
} from './types';
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

export async function fetchPrediction(
  rawSymbol: string,
  period: string = '10y',
  signal?: AbortSignal
): Promise<PredictionResponse> {
  const symbol = normalizeTaiwanSymbol(rawSymbol);

  return apiRequest<PredictionResponse>(`/api/v1/predict`, {
    method: 'POST',
    signal,
    body: JSON.stringify({ symbol, period }),
  });
}

export async function fetchBacktest(
  rawSymbol: string,
  start?: string,
  end?: string,
  signal?: AbortSignal
): Promise<BacktestResponse> {
  const symbol = normalizeTaiwanSymbol(rawSymbol);
  const params = new URLSearchParams({ symbol });
  if (start) params.set('start', start);
  if (end) params.set('end', end);

  return apiRequest<BacktestResponse>(`/api/v1/backtest?${params.toString()}`, {
    method: 'GET',
    signal,
  });
}

