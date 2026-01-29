import { useEffect, useState } from 'react';
import { fetchStockIndicators } from '../api/stockApi';
import type { IndicatorsResponse } from '../api/types';

interface UseStockIndicatorsOptions {
  period?: string;
}

interface UseStockIndicatorsResult {
  data: IndicatorsResponse | null;
  loading: boolean;
  error: string | null;
}

export function useStockIndicators(
  stockCode: string | null,
  options: UseStockIndicatorsOptions = {}
): UseStockIndicatorsResult {
  const { period = '10y' } = options;

  const [data, setData] = useState<IndicatorsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stockCode) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchStockIndicators(stockCode!, period, controller.signal);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (cancelled) return;

        if ((err as Error).name === 'AbortError') {
          return;
        }

        const message =
          err instanceof Error ? err.message : typeof err === 'string' ? err : '資料讀取失敗';
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [stockCode, period]);

  return { data, loading, error };
}

