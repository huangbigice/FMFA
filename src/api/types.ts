export interface StockRow {
  date: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
  // Allow additional indicator fields from backend (ma*, rsi_*, ema*, return_*, etc.)
  [key: string]: unknown;
}

export interface StockDataResponse {
  symbol: string;
  period: string;
  rows: number;
  data: StockRow[];
}

export interface IndicatorsResponse extends StockDataResponse {}

