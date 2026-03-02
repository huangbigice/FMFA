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

/** 即時報價（yfinance） */
export interface StockQuoteResponse {
  symbol: string;
  current_price: number;
  previous_close: number;
  change: number;
  change_percent: number;
}

export interface PredictionResponse {
  symbol: string;
  probabilities: Record<string, number>;
  system_score: number;
  tech_score: number;
  fund_score: number;
  proba_buy: number;
  recommendation: string;
  timestamp: string;
}

export interface EquityCurvePoint {
  date: string;
  cumulative_return: number;
}

export interface BacktestResponse {
  symbol: string;
  start: string;
  end: string;
  annualized_return: number;
  volatility: number;
  max_drawdown: number;
  trade_count: number;
  sharpe_ratio: number | null;
  equity_curve: EquityCurvePoint[];
  quality_rating?: string;
  quality_label?: string;
  portfolio_eligible?: boolean;
}

/** 虛擬下單的參考來源（供 DQV 佔比） */
export type VirtualOrderSource = 'ai_reference' | 'self' | 'mixed';

/** 單筆虛擬訂單 */
export interface VirtualOrder {
  id: string;
  stockCode: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  amount: number;
  orderDate: string; // ISO 字串
  source: VirtualOrderSource;
  note?: string;
}

/** 替代股票建議 */
export interface AlternativeStock {
  symbol: string;
  name: string;
  category: string;
  rating: string;
  sharpe: number | null;
}

/** 股票品質評級回應 */
export interface StockRatingResponse {
  symbol: string;
  rating: 'A' | 'B' | 'C' | 'D' | 'F';
  label: string;
  color: string;
  sharpe_ratio: number | null;
  portfolio_eligible: boolean;
  warning: boolean;
  description: string;
  alternatives?: AlternativeStock[];
}


