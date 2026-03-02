import React from 'react';
import './StockAnalysis.css';
import { calculateAllIndicators, type StockIndicators } from '../../../../utils/stockIndicators';
import { useStockIndicators } from '../../../../hooks/useStockIndicators';
import type { BacktestResponse, StockRow, StockQuoteResponse, StockRatingResponse } from '../../../../api/types';
import { fetchBacktest, fetchPrediction, fetchStockQuote, fetchStockRating } from '../../../../api/stockApi';
import { API_BASE_URL } from '../../../../api/client';
import { normalizeTaiwanSymbol } from '../../../../api/symbol';
import EquityCurveChart from './charts/EquityCurveChart';
import KLineChart from './charts/KLineChart';
import VolumeChart from './charts/VolumeChart';
import KDChart from './charts/KDChart';
import MACDChart from './charts/MACDChart';
import VirtualOrderForm from './VirtualOrderForm';

interface StockData {
  date: Date;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

interface StockAnalysisProps {
  stockCode: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

type TimeRange = 3 | 6 | 12 | 24;
type ChartType = 'kline' | 'volume' | 'kd' | 'macd';
type ChartInterval = 'day' | '1m' | '5m' | '10m' | '30m' | '60m';
type IntradayRangeDays = 1 | 5;

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: '3個月', value: 3 },
  { label: '6個月', value: 6 },
  { label: '12個月', value: 12 },
  { label: '24個月', value: 24 },
];

const INTERVAL_OPTIONS: { label: string; value: ChartInterval }[] = [
  { label: '日線', value: 'day' },
  { label: '1分鐘', value: '1m' },
  { label: '5分鐘', value: '5m' },
  { label: '10分鐘', value: '10m' },
  { label: '30分鐘', value: '30m' },
  { label: '60分鐘', value: '60m' },
];

const INTRADAY_RANGES: { label: string; value: IntradayRangeDays }[] = [
  { label: '1日', value: 1 },
  { label: '5日', value: 5 },
];

type IndicatorGroup = 'all' | 'MA' | 'RETURN' | 'RSI' | 'EMA' | 'KD' | 'MACD';

// 評級圖標輔助函數
// function getRatingIcon(rating: string): string {
//   switch (rating) {
//     case 'A':
//       return '🏆';
//     case 'B':
//       return '✅';
//     case 'C':
//       return '⚪';
//     case 'D':
//       return '⚠️';
//     case 'F':
//       return '🔴';
//     default:
//       return '❓';
//   }
// }

function StockAnalysis({ stockCode }: StockAnalysisProps) {
  const { data: indicatorsData, error } = useStockIndicators(stockCode, {
    period: '10y',
  });

  const [chartInterval, setChartInterval] = React.useState<ChartInterval>('day');
  const [intradayRangeDays, setIntradayRangeDays] = React.useState<IntradayRangeDays>(5);

  const intradayPeriod = React.useMemo(() => {
    return intradayRangeDays === 1 ? '1d' : '5d';
  }, [intradayRangeDays]);

  const {
    data: intradayIndicatorsData,
    loading: intradayLoading,
    error: intradayError,
  } = useStockIndicators(chartInterval === 'day' ? null : stockCode, {
    period: intradayPeriod,
    interval: chartInterval === 'day' ? undefined : chartInterval,
  });

  const displaySymbol = React.useMemo(
    () => (stockCode ? normalizeTaiwanSymbol(stockCode) : ''),
    [stockCode]
  );

  interface PredictionViewModel {
    recommendation: string;
    probaBuy: number;
    systemScore: number;
    techScore: number;
    fundScore: number;
  }

  const [prediction, setPrediction] = React.useState<PredictionViewModel | null>(null);
  const [predictionLoading, setPredictionLoading] = React.useState(false);
  const [predictionError, setPredictionError] = React.useState<string | null>(null);

  const [backtestResult, setBacktestResult] = React.useState<BacktestResponse | null>(null);
  const [backtestLoading, setBacktestLoading] = React.useState(false);
  const [backtestError, setBacktestError] = React.useState<string | null>(null);
  const [backtestStart, setBacktestStart] = React.useState('');
  const [backtestEnd, setBacktestEnd] = React.useState('');

  const [rating, setRating] = React.useState<StockRatingResponse | null>(null);
  const [ratingLoading, setRatingLoading] = React.useState(false);
  const [ratingError, setRatingError] = React.useState<string | null>(null);

  const [quote, setQuote] = React.useState<StockQuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = React.useState(false);
  const [, setQuoteError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!stockCode) {
      setQuote(null);
      setQuoteLoading(false);
      setQuoteError(null);
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    setQuoteLoading(true);
    setQuoteError(null);
    fetchStockQuote(stockCode, controller.signal)
      .then((data) => {
        if (!cancelled) setQuote(data);
      })
      .catch((err) => {
        if (cancelled || (err as Error).name === 'AbortError') return;
        setQuoteError(err instanceof Error ? err.message : '報價載入失敗');
      })
      .finally(() => {
        if (!cancelled) setQuoteLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [stockCode]);

  const stockData: StockData[] = React.useMemo(() => {
    if (!indicatorsData) return [];

    return indicatorsData.data.map((row: StockRow) => {
      const dateValue = 'date' in row ? row.date : null;
      const date = dateValue ? new Date(String(dateValue)) : new Date();

      const open = (row.open as number | null) ?? 0;
      const high = (row.high as number | null) ?? 0;
      const low = (row.low as number | null) ?? 0;
      const close = (row.close as number | null) ?? 0;
      const volume = (row.volume as number | null) ?? 0;

      return {
        date,
        open,
        high,
        low,
        close,
        volume,
      };
    });
  }, [indicatorsData]);

  const intradayStockData: StockData[] = React.useMemo(() => {
    if (!intradayIndicatorsData) return [];

    return intradayIndicatorsData.data.map((row: StockRow) => {
      const dateValue = 'date' in row ? row.date : null;
      const date = dateValue ? new Date(String(dateValue)) : new Date();

      const open = (row.open as number | null) ?? 0;
      const high = (row.high as number | null) ?? 0;
      const low = (row.low as number | null) ?? 0;
      const close = (row.close as number | null) ?? 0;
      const volume = (row.volume as number | null) ?? 0;

      return {
        date,
        open,
        high,
        low,
        close,
        volume,
      };
    });
  }, [intradayIndicatorsData]);

  // 提取数据数组用于指标计算
  const dates = stockData.map((d) => d.date);
  const close = stockData.map((d) => d.close);
  const open = stockData.map((d) => d.open);
  const high = stockData.map((d) => d.high);
  const low = stockData.map((d) => d.low);
  const volume = stockData.map((d) => d.volume);

  const intradayDates = intradayStockData.map((d) => d.date);
  const intradayClose = intradayStockData.map((d) => d.close);
  const intradayOpen = intradayStockData.map((d) => d.open);
  const intradayHigh = intradayStockData.map((d) => d.high);
  const intradayLow = intradayStockData.map((d) => d.low);
  const intradayVolume = intradayStockData.map((d) => d.volume);

  // 计算所有技术指标（全長度，用於技術指標卡片與各圖表的基礎資料）
  const indicators: StockIndicators = React.useMemo(
    () => calculateAllIndicators(close, high, low, volume),
    [close, high, low, volume]
  );

  const intradayIndicators: StockIndicators = React.useMemo(
    () => calculateAllIndicators(intradayClose, intradayHigh, intradayLow, intradayVolume),
    [intradayClose, intradayHigh, intradayLow, intradayVolume]
  );

  // 各圖表各自的時間區間，預設 12 個月
  const [kTimeRange, setKTimeRange] = React.useState<TimeRange>(12);
  const [volumeTimeRange, setVolumeTimeRange] = React.useState<TimeRange>(12);
  const [kdTimeRange, setKdTimeRange] = React.useState<TimeRange>(12);
  const [macdTimeRange, setMacdTimeRange] = React.useState<TimeRange>(12);
  const [selectedIndicatorGroup, setSelectedIndicatorGroup] =
    React.useState<IndicatorGroup>('all');
  const [selectedChart, setSelectedChart] = React.useState<ChartType>('kline');

  React.useEffect(() => {
    // 每次切換股票時，四張圖都重設為 12 個月，並回到 K 線圖
    setKTimeRange(12);
    setVolumeTimeRange(12);
    setKdTimeRange(12);
    setMacdTimeRange(12);
    setSelectedChart('kline');
    setChartInterval('day');
    setIntradayRangeDays(5);
  }, [stockCode]);

  React.useEffect(() => {
    setBacktestResult(null);
    setBacktestError(null);
    setRating(null);
    setRatingError(null);
  }, [stockCode]);

  // 載入股票品質評級
  React.useEffect(() => {
    if (!stockCode) return;

    const loadRating = async () => {
      setRatingLoading(true);
      setRatingError(null);
      try {
        const result = await fetchStockRating(stockCode);
        setRating(result);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : typeof e === 'string' ? e : '評級載入失敗';
        setRatingError(message);
        setRating(null);
      } finally {
        setRatingLoading(false);
      }
    };

    loadRating();
  }, [stockCode]);

  const runBacktest = React.useCallback(async () => {
    if (!stockCode) return;
    setBacktestLoading(true);
    setBacktestError(null);
    try {
      const result = await fetchBacktest(
        stockCode,
        backtestStart || undefined,
        backtestEnd || undefined
      );
      setBacktestResult(result);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : typeof e === 'string' ? e : '回測失敗';
      setBacktestError(message);
      setBacktestResult(null);
    } finally {
      setBacktestLoading(false);
    }
  }, [stockCode, backtestStart, backtestEnd]);

  const PredictionSummary: React.FC = () => {
    if (predictionLoading) {
      return <div className="prediction-summary loading">模型預測結果載入中…</div>;
    }

    if (predictionError) {
      return (
        <div className="prediction-summary error">
          模型預測失敗：{predictionError}
        </div>
      );
    }

    if (!prediction) {
      return null;
    }

    const probaPercent = (prediction.probaBuy * 100).toFixed(1);

    return (
      <div className="prediction-summary">
        <div className="prediction-header">
          <span className="prediction-title">模型預測結果</span>
          <span className="prediction-badge">
            {prediction.recommendation}
          </span>
        </div>
        <div className="prediction-detail">
          <span className="prediction-proba">
            買進機率：<strong>{probaPercent}%</strong>
          </span>
          <span className="prediction-scores">
            綜合評分（系統 / 技術 / 基本面）：
            <strong>
              {prediction.systemScore.toFixed(1)} / {prediction.techScore.toFixed(1)} /{' '}
              {prediction.fundScore.toFixed(1)}
            </strong>
          </span>
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    if (!stockCode) {
      setPrediction(null);
      setPredictionLoading(false);
      setPredictionError(null);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    async function run() {
      setPredictionLoading(true);
      setPredictionError(null);

      try {
        const result = await fetchPrediction(stockCode, '10y', controller.signal);
        if (cancelled) return;
        setPrediction({
          recommendation: result.recommendation,
          probaBuy: result.proba_buy,
          systemScore: result.system_score,
          techScore: result.tech_score,
          fundScore: result.fund_score,
        });
      } catch (e) {
        if (cancelled) return;
        const message =
          e instanceof Error ? e.message : typeof e === 'string' ? e : '預測讀取失敗';
        setPredictionError(message);
        setPrediction(null);
      } finally {
        if (!cancelled) {
          setPredictionLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [stockCode]);

  const getStartIndexForRange = (range: TimeRange): number => {
    if (dates.length === 0) return 0;
    const lastDate = dates[dates.length - 1];
    const cutoff = new Date(lastDate);
    cutoff.setMonth(cutoff.getMonth() - range);
    let startIndex = dates.findIndex((d) => d >= cutoff);
    if (startIndex === -1) startIndex = 0;
    return startIndex;
  };

  const getStartIndexForIntradayDays = (rangeDays: IntradayRangeDays): number => {
    if (intradayDates.length === 0) return 0;
    const lastDate = intradayDates[intradayDates.length - 1];
    const cutoff = new Date(lastDate);
    cutoff.setDate(cutoff.getDate() - rangeDays);
    let startIndex = intradayDates.findIndex((d) => d >= cutoff);
    if (startIndex === -1) startIndex = 0;
    return startIndex;
  };

  const sliceFrom = <T,>(arr: T[], start: number): T[] => arr.slice(start);

  // K 線圖用資料
  const isIntradayMode = chartInterval !== 'day';
  const kStart = isIntradayMode ? getStartIndexForIntradayDays(intradayRangeDays) : getStartIndexForRange(kTimeRange);
  const kDates = isIntradayMode ? sliceFrom(intradayDates, kStart) : sliceFrom(dates, kStart);
  const kOpen = isIntradayMode ? sliceFrom(intradayOpen, kStart) : sliceFrom(open, kStart);
  const kHigh = isIntradayMode ? sliceFrom(intradayHigh, kStart) : sliceFrom(high, kStart);
  const kLow = isIntradayMode ? sliceFrom(intradayLow, kStart) : sliceFrom(low, kStart);
  const kClose = isIntradayMode ? sliceFrom(intradayClose, kStart) : sliceFrom(close, kStart);

  const kSourceIndicators = isIntradayMode ? intradayIndicators : indicators;
  const kMAs = Object.fromEntries(
    Object.entries(kSourceIndicators.MAs).map(([key, arr]) => [Number(key), sliceFrom(arr as (number | null)[], kStart)])
  ) as Record<number, (number | null)[]>;

  // 成交量圖用資料
  const volumeStart = isIntradayMode
    ? getStartIndexForIntradayDays(intradayRangeDays)
    : getStartIndexForRange(volumeTimeRange);
  const volumeDates = isIntradayMode ? sliceFrom(intradayDates, volumeStart) : sliceFrom(dates, volumeStart);
  const volumeOpenData = isIntradayMode ? sliceFrom(intradayOpen, volumeStart) : sliceFrom(open, volumeStart);
  const volumeCloseData = isIntradayMode ? sliceFrom(intradayClose, volumeStart) : sliceFrom(close, volumeStart);
  const volumeData = isIntradayMode ? sliceFrom(intradayVolume, volumeStart) : sliceFrom(volume, volumeStart);

  // KD 圖用資料
  const kdStart = isIntradayMode
    ? getStartIndexForIntradayDays(intradayRangeDays)
    : getStartIndexForRange(kdTimeRange);
  const kdDates = isIntradayMode ? sliceFrom(intradayDates, kdStart) : sliceFrom(dates, kdStart);
  const kdSourceIndicators = isIntradayMode ? intradayIndicators : indicators;
  const kdK = sliceFrom(kdSourceIndicators.KD.K, kdStart);
  const kdD = sliceFrom(kdSourceIndicators.KD.D, kdStart);

  // MACD 圖用資料
  const macdStart = isIntradayMode
    ? getStartIndexForIntradayDays(intradayRangeDays)
    : getStartIndexForRange(macdTimeRange);
  const macdDates = isIntradayMode ? sliceFrom(intradayDates, macdStart) : sliceFrom(dates, macdStart);
  const macdSourceIndicators = isIntradayMode ? intradayIndicators : indicators;
  const macdMACD = sliceFrom(macdSourceIndicators.MACD.MACD, macdStart);
  const macdDIF = sliceFrom(macdSourceIndicators.MACD.DIF, macdStart);
  const macdDEA = sliceFrom(macdSourceIndicators.MACD.DEA, macdStart);

  // 当前价格和涨跌幅（fallback：來自歷史資料最後一筆）
  const fallbackPrice = stockData[stockData.length - 1]?.close || 0;
  const fallbackPrevious = stockData[stockData.length - 2]?.close || fallbackPrice || 1;
  const fallbackChange = fallbackPrice - fallbackPrevious;
  const fallbackChangePercent =
    fallbackPrevious !== 0 ? ((fallbackChange / fallbackPrevious) * 100).toFixed(2) : '0.00';

  // 顯示用：優先使用即時報價（yfinance），無則用 fallback
  const currentPrice = quote ? quote.current_price : fallbackPrice;
  const priceChange = quote ? quote.change : fallbackChange;
  const priceChangePercent = quote
    ? quote.change_percent.toFixed(2)
    : fallbackChangePercent;

  // 获取最新指标值用于显示（來自後端的技術指標欄位）
  const maList = [5, 10, 20, 60, 120, 240];
  const latestBackendRow = indicatorsData?.data.at(-1) as
    | (StockRow & {
        ma5?: number | null;
        ma20?: number | null;
        ma60?: number | null;
        ma120?: number | null;
        ma240?: number | null;
        rsi_120?: number | null;
        rsi_240?: number | null;
        rsi_420?: number | null;
        ema120?: number | null;
        ema240?: number | null;
        ema420?: number | null;
        ema200?: number | null;
        return_1?: number | null;
        return_5?: number | null;
      })
    | undefined;

  // MA 指标
  const latestMA5 = (latestBackendRow?.ma5 as number | null) ?? null;
  const latestMA20 = (latestBackendRow?.ma20 as number | null) ?? null;
  const latestMA60 = (latestBackendRow?.ma60 as number | null) ?? null;
  const latestMA120 = (latestBackendRow?.ma120 as number | null) ?? null;
  const latestMA240 = (latestBackendRow?.ma240 as number | null) ?? null;

  // RSI 指标
  const latestRSI120 = (latestBackendRow?.rsi_120 as number | null) ?? null;
  const latestRSI240 = (latestBackendRow?.rsi_240 as number | null) ?? null;
  const latestRSI420 = (latestBackendRow?.rsi_420 as number | null) ?? null;

  // EMA 指标
  const latestEMA120 = (latestBackendRow?.ema120 as number | null) ?? null;
  const latestEMA240 = (latestBackendRow?.ema240 as number | null) ?? null;
  const latestEMA420 = (latestBackendRow?.ema420 as number | null) ?? null;
  const latestEMA200 = (latestBackendRow?.ema200 as number | null) ?? null;

  // RETURN 指标
  const latestReturn1 = (latestBackendRow?.return_1 as number | null) ?? null;
  const latestReturn5 = (latestBackendRow?.return_5 as number | null) ?? null;
  const formatValue = (value: number | null, digits: number = 2) =>
    value == null || Number.isNaN(value) ? '--' : value.toFixed(digits);
  const formatPercent = (value: number | null, digits: number = 2) =>
    value == null || Number.isNaN(value) ? '--' : `${(value * 100).toFixed(digits)}%`;

  // 前端本地計算的 KD / MACD 僅用於圖表，不再用於指標卡片與 AI 文案
  const latestK = indicators.KD.K.at(-1) || 0;
  const latestD = indicators.KD.D.at(-1) || 0;
  const latestMACD = indicators.MACD.MACD.at(-1) || 0;

  interface IndicatorCardConfig {
    id: string;
    group: IndicatorGroup;
    label: string;
    description: string;
    value?: string;
    getValueClassName?: () => string;
    customRender?: () => React.ReactNode;
  }

  const getKDClassName = () => {
    if (latestK > 80 || latestD > 80) return 'overbought';
    if (latestK < 20 || latestD < 20) return 'oversold';
    return '';
  };

  const getMACDClassName = () => (latestMACD >= 0 ? 'positive' : 'negative');

  const indicatorCards: IndicatorCardConfig[] = [
    // MA 指标
    {
      id: 'MA5',
      group: 'MA',
      label: 'MA5',
      description:
        'MA5（5日均線）：過去5個交易日的平均收盤價，用於判斷短期價格趨勢。當股價高於MA5時，通常表示短期上漲趨勢。',
      value: formatValue(latestMA5),
    },
    {
      id: 'MA20',
      group: 'MA',
      label: 'MA20',
      description:
        'MA20（20日均線）：過去20個交易日的平均收盤價，用於判斷中期價格趨勢。當股價高於MA20時，通常表示中期上漲趨勢。',
      value: formatValue(latestMA20),
    },
    {
      id: 'MA60',
      group: 'MA',
      label: 'MA60',
      description:
        'MA60（60日均線）：過去60個交易日的平均收盤價，用於判斷中長期價格趨勢。當股價高於MA60時，通常表示中長期上漲趨勢。',
      value: formatValue(latestMA60),
    },
    {
      id: 'MA120',
      group: 'MA',
      label: 'MA120',
      description:
        'MA120（120日均線）：過去120個交易日的平均收盤價，用於判斷長期價格趨勢。當股價高於MA120時，通常表示長期上漲趨勢。',
      value: formatValue(latestMA120),
    },
    {
      id: 'MA240',
      group: 'MA',
      label: 'MA240',
      description:
        'MA240（240日均線）：過去240個交易日的平均收盤價，用於判斷超長期價格趨勢。當股價高於MA240時，通常表示超長期多頭趨勢。',
      value: formatValue(latestMA240),
    },
    // RSI 指标
    {
      id: 'RSI120',
      group: 'RSI',
      label: 'RSI(120)',
      description:
        'RSI(120)：以120日為期間的相對強弱指標，用於判斷長期超買超賣狀態。一般認為 RSI 高於 70 可能偏熱，低於 30 可能偏冷。',
      value: formatValue(latestRSI120),
    },
    {
      id: 'RSI240',
      group: 'RSI',
      label: 'RSI(240)',
      description:
        'RSI(240)：以240日為期間的相對強弱指標，用於判斷超長期超買超賣狀態。一般認為 RSI 高於 70 可能偏熱，低於 30 可能偏冷。',
      value: formatValue(latestRSI240),
    },
    {
      id: 'RSI420',
      group: 'RSI',
      label: 'RSI(420)',
      description:
        'RSI(420)：以420日為期間的相對強弱指標，用於判斷極長期超買超賣狀態。一般認為 RSI 高於 70 可能偏熱，低於 30 可能偏冷。',
      value: formatValue(latestRSI420),
    },
    // EMA 指标
    {
      id: 'EMA120',
      group: 'EMA',
      label: 'EMA120',
      description:
        'EMA120（120日指數移動平均線）：長期趨勢線，股價在 EMA120 之上通常代表長期多頭趨勢，在其下方則偏向空頭趨勢。',
      value: formatValue(latestEMA120),
    },
    {
      id: 'EMA200',
      group: 'EMA',
      label: 'EMA200',
      description:
        'EMA200（200日指數移動平均線）：常用的長期趨勢線，股價在 EMA200 之上通常代表長期多頭趨勢，在其下方則偏向空頭趨勢。',
      value: formatValue(latestEMA200),
    },
    {
      id: 'EMA240',
      group: 'EMA',
      label: 'EMA240',
      description:
        'EMA240（240日指數移動平均線）：超長期趨勢線，股價在 EMA240 之上通常代表超長期多頭趨勢，在其下方則偏向空頭趨勢。',
      value: formatValue(latestEMA240),
    },
    {
      id: 'EMA420',
      group: 'EMA',
      label: 'EMA420',
      description:
        'EMA420（420日指數移動平均線）：極長期趨勢線，股價在 EMA420 之上通常代表極長期多頭趨勢，在其下方則偏向空頭趨勢。',
      value: formatValue(latestEMA420),
    },
    // RETURN 指标
    {
      id: 'RETURN_1',
      group: 'RETURN',
      label: '日報酬率',
      description: '日報酬率：相較於前一個交易日的價格變化百分比，用於觀察短期波動與漲跌幅度。',
      value: formatPercent(latestReturn1, 2),
    },
    {
      id: 'RETURN_5',
      group: 'RETURN',
      label: '週報酬率',
      description:
        '週報酬率：通常以過去數個交易日加總回報估算一週的漲跌情況，可用於觀察短期趨勢延續性。',
      value: formatPercent(latestReturn5, 2),
    },
    {
      id: 'KD',
      group: 'KD',
      label: 'KD',
      description:
        'KD指標：隨機指標，用於判斷超買超賣。K值 > 80 或 D值 > 80 表示可能超買，K值 < 20 或 D值 < 20 表示可能超賣。',
      customRender: () => (
        <p className={`indicator-value ${getKDClassName()}`}>
          K: {latestK.toFixed(2)} D: {latestD.toFixed(2)}
        </p>
      ),
    },
    {
      id: 'MACD',
      group: 'MACD',
      label: 'MACD',
      description:
        'MACD（指數平滑移動平均線）：通過計算12日EMA和26日EMA的差值來判斷趨勢。MACD > 0 表示上升趨勢，MACD < 0 表示下降趨勢。',
      value: `${latestMACD >= 0 ? '+' : ''}${latestMACD.toFixed(2)}`,
      getValueClassName: getMACDClassName,
    },
  ];

  const visibleIndicatorCards = indicatorCards.filter(
    (card) => selectedIndicatorGroup === 'all' || card.group === selectedIndicatorGroup
  );

  // AI聊天框状态
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 1,
      text: `您好！我是AI助手，可以幫您分析 ${stockCode} 的技術指標和投資建議。有什麼問題嗎？`,
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = React.useState('')
  const [isStreaming, setIsStreaming] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = React.useRef(false)

  // 当 stockCode 改变时，更新股票数据和重置聊天消息
  React.useEffect(() => {
    setMessages([
      {
        id: 1,
        text: `您好！我是AI助手，可以幫您分析 ${stockCode} 的技術指標和投資建議。有什麼問題嗎？`,
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
    setInputMessage('');
    // 避免切換/搜尋股票時把整頁捲到聊天區塊底部
    shouldAutoScrollRef.current = false;
  }, [stockCode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    if (!shouldAutoScrollRef.current) return;
    scrollToBottom()
  }, [messages])

  const renderTimeRangeButtons = (
    currentRange: TimeRange,
    onChange: (value: TimeRange) => void
  ) => (
    <div className="time-range-buttons">
      {TIME_RANGES.map((range) => (
        <button
          key={range.value}
          type="button"
          className={`time-range-button ${currentRange === range.value ? 'active' : ''}`}
          onClick={() => onChange(range.value)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );

  const renderIntervalButtons = (
    current: ChartInterval,
    onChange: (value: ChartInterval) => void
  ) => (
    <div className="time-range-buttons">
      {INTERVAL_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`time-range-button ${current === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  const renderIntradayRangeButtons = (
    current: IntradayRangeDays,
    onChange: (value: IntradayRangeDays) => void
  ) => (
    <div className="time-range-buttons">
      {INTRADAY_RANGES.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`time-range-button ${current === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  const handleSendMessage = async () => {
    const trimmed = inputMessage.trim()
    if (!trimmed || isStreaming) return
    // 只有在使用者真的開始聊天後，才自動捲動到底部
    shouldAutoScrollRef.current = true;

    const userId = Date.now()
    const aiId = userId + 1

    const userMessage: Message = {
      id: userId,
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    }

    const aiMessage: Message = {
      id: aiId,
      text: '',
      sender: 'ai',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, aiMessage])
    setInputMessage('')
    setIsStreaming(true)

    const context = [
      `股票代碼: ${stockCode}`,
      `現價: ${currentPrice.toFixed(2)}，漲跌幅: ${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(
        2
      )} (${priceChangePercent}%)`,
      `MA5: ${formatValue(latestMA5)}`,
      `MA20: ${formatValue(latestMA20)}`,
      `MA60: ${formatValue(latestMA60)}`,
      `MA120: ${formatValue(latestMA120)}`,
      `MA240: ${formatValue(latestMA240)}`,
      `RSI(120): ${formatValue(latestRSI120)}`,
      `RSI(240): ${formatValue(latestRSI240)}`,
      `RSI(420): ${formatValue(latestRSI420)}`,
      `EMA120: ${formatValue(latestEMA120)}`,
      `EMA200: ${formatValue(latestEMA200)}`,
      `EMA240: ${formatValue(latestEMA240)}`,
      `EMA420: ${formatValue(latestEMA420)}`,
      `日報酬率: ${formatPercent(latestReturn1, 2)}`,
      `週報酬率: ${formatPercent(latestReturn5, 2)}`,
    ].join('\n')

    const appendToAi = (delta: string) => {
      if (!delta) return
      setMessages((prev) =>
        prev.map((m) => (m.id === aiId ? { ...m, text: m.text + delta } : m))
      )
    }

    const setAiError = (errText: string) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId
            ? { ...m, text: `（後端回覆失敗）${errText || '未知錯誤'}` }
            : m
        )
      )
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/api/v1/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: stockCode,
          message: trimmed,
          context,
        }),
      })

      if (!resp.ok) {
        throw new Error(`Request failed with status ${resp.status}`)
      }
      if (!resp.body) {
        throw new Error('Response body is empty')
      }

      const reader = resp.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''

      const handleEventBlock = (block: string) => {
        const lines = block.split('\n').filter((l) => l.length > 0)
        let eventType: string | null = null
        const dataLines: string[] = []

        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventType = line.slice('event:'.length).trim()
          } else if (line.startsWith('data:')) {
            dataLines.push(line.slice('data:'.length).trimStart())
          }
        }

        const data = dataLines.join('\n')
        if (eventType === 'done') {
          return { done: true }
        }
        if (eventType === 'error') {
          setAiError(data)
          return { done: true }
        }
        if (data) {
          appendToAi(data)
        }
        return { done: false }
      }

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        let idx: number
        while ((idx = buffer.indexOf('\n\n')) !== -1) {
          const block = buffer.slice(0, idx)
          buffer = buffer.slice(idx + 2)
          const result = handleEventBlock(block)
          if (result.done) {
            try {
              await reader.cancel()
            } catch {
              // ignore
            }
            return
          }
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setAiError(msg)
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="stock-analysis-container">
      <div className="stock-header">
        <div className="stock-title-section">
          <h2 className="stock-code">{displaySymbol}</h2>
          <div className="stock-price-section">
            <span className="stock-price">
              {quoteLoading ? '載入中...' : `$${currentPrice.toFixed(2)}`}
            </span>
            {!quoteLoading && (
              <span className={`stock-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
                {priceChange >= 0 ? '+' : ''}
                {priceChange.toFixed(2)} ({priceChangePercent}%)
              </span>
            )}
          </div>

          {/* 品質評級標籤 */}
          {ratingLoading && <div className="rating-loading">評級載入中...</div>}
          {ratingError && <div className="rating-error">評級載入失敗：{ratingError}</div>}
          {rating && !ratingLoading && (
            <>
              {/* <div className={`quality-badge ${rating.color}`}>
                <span className="rating-icon">{getRatingIcon(rating.rating)}</span>
                <span className="rating-text">
                  {rating.rating}級 [{rating.label}]
                </span>
                {(backtestResult?.sharpe_ratio ?? rating.sharpe_ratio) != null && (
                  <span className="rating-sharpe">
                    Sharpe: {(backtestResult?.sharpe_ratio ?? rating.sharpe_ratio)!.toFixed(2)}
                  </span>
                )}
              </div> */}

              {/* 警告橫幅 */}
              {/* {rating.warning && (
                <div className="warning-banner">
                  <p className="warning-text">
                    ⚠️ 此標的風險較高，不建議納入投資組合
                  </p>
                  {rating.alternatives && rating.alternatives.length > 0 && (
                    <div className="alternatives">
                      <p className="alternatives-label">➡️ 替代建議：</p>
                      <div className="alternatives-buttons">
                        {rating.alternatives.map((alt) => (
                          <button
                            key={alt.symbol}
                            type="button"
                            className="alternative-button"
                            onClick={() => {
                              const code = alt.symbol.replace('.TW', '');
                              window.location.href = `#/search?code=${code}`;
                            }}
                            title={`${alt.name} - ${alt.category}`}
                          >
                            {alt.symbol.replace('.TW', '')} ({alt.rating}級)
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )} */}
            </>
          )}
        </div>
        <div className="stock-header-prediction">
          <PredictionSummary />
          <p className="disclaimer">
            本系統之分析與建議僅供參考，不構成任何投資建議或要約。過往回測結果不保證未來表現，投資人應自行判斷並自負盈虧。投資有風險，入市須謹慎。
          </p>
        </div>
        {error && <div className="stock-error">資料載入失敗：{error}</div>}
      </div>

      {/* K線圖和技術指標圖表 */}
      <div className="stock-charts-section">
        <div className="chart-interval-row">
          <span className="chart-interval-label">週期</span>
          {renderIntervalButtons(chartInterval, setChartInterval)}
          {chartInterval !== 'day' && (
            <>
              <span className="chart-interval-sep" />
              <span className="chart-interval-label">區間</span>
              {renderIntradayRangeButtons(intradayRangeDays, setIntradayRangeDays)}
            </>
          )}
        </div>

        <div className="chart-tabs">
          <button
            type="button"
            className={`chart-tab-button ${selectedChart === 'kline' ? 'active' : ''}`}
            onClick={() => setSelectedChart('kline')}
          >
            K線圖
          </button>
          <button
            type="button"
            className={`chart-tab-button ${selectedChart === 'volume' ? 'active' : ''}`}
            onClick={() => setSelectedChart('volume')}
          >
            成交量圖
          </button>
          <button
            type="button"
            className={`chart-tab-button ${selectedChart === 'kd' ? 'active' : ''}`}
            onClick={() => setSelectedChart('kd')}
          >
            KD圖
          </button>
          <button
            type="button"
            className={`chart-tab-button ${selectedChart === 'macd' ? 'active' : ''}`}
            onClick={() => setSelectedChart('macd')}
          >
            MACD圖
          </button>
        </div>

        {/* 單一圖表區塊，透過上方按鈕切換 */}
        <div className="chart-card">
          {selectedChart === 'kline' && (
            <>
              {chartInterval === 'day' ? renderTimeRangeButtons(kTimeRange, setKTimeRange) : null}
              {chartInterval !== 'day' && intradayLoading ? (
                <div>分鐘K線載入中…</div>
              ) : chartInterval !== 'day' && intradayError ? (
                <div>分鐘K線載入失敗：{intradayError}</div>
              ) : (
                <KLineChart
                  dates={kDates}
                  open={kOpen}
                  high={kHigh}
                  low={kLow}
                  close={kClose}
                  maData={kMAs}
                  maList={maList}
                />
              )}
            </>
          )}

          {selectedChart === 'volume' && (
            <>
              {chartInterval === 'day' ? renderTimeRangeButtons(volumeTimeRange, setVolumeTimeRange) : null}
              {chartInterval !== 'day' && intradayLoading ? (
                <div>分鐘成交量載入中…</div>
              ) : chartInterval !== 'day' && intradayError ? (
                <div>分鐘成交量載入失敗：{intradayError}</div>
              ) : (
                <VolumeChart
                  dates={volumeDates}
                  volume={volumeData}
                  close={volumeCloseData}
                  open={volumeOpenData}
                />
              )}
            </>
          )}

          {selectedChart === 'kd' && (
            <>
              {chartInterval === 'day' ? renderTimeRangeButtons(kdTimeRange, setKdTimeRange) : null}
              {chartInterval !== 'day' && intradayLoading ? (
                <div>分鐘 KD 載入中…</div>
              ) : chartInterval !== 'day' && intradayError ? (
                <div>分鐘 KD 載入失敗：{intradayError}</div>
              ) : (
                <KDChart dates={kdDates} K={kdK} D={kdD} />
              )}
            </>
          )}

          {selectedChart === 'macd' && (
            <>
              {chartInterval === 'day' ? renderTimeRangeButtons(macdTimeRange, setMacdTimeRange) : null}
              {chartInterval !== 'day' && intradayLoading ? (
                <div>分鐘 MACD 載入中…</div>
              ) : chartInterval !== 'day' && intradayError ? (
                <div>分鐘 MACD 載入失敗：{intradayError}</div>
              ) : (
                <MACDChart
                  dates={macdDates}
                  MACD={macdMACD}
                  DIF={macdDIF}
                  DEA={macdDEA}
                />
              )}
            </>
          )}
        </div>

        {/* 虛擬下單區塊 */}
        <div className="chart-card virtual-order-card">
          <VirtualOrderForm stockCode={stockCode} currentPrice={currentPrice} />
        </div>

        {/* 回測區塊 */}
        <div className="chart-card backtest-section">
          <h3 className="chart-title">回測</h3>
          <p className="backtest-desc">以策略歷史表現檢視年化報酬、波動、最大回撤與夏普比率（預設最近 5 年）。</p>
          <div className="backtest-top-row">
            <div className="backtest-controls">
              <label className="backtest-label">
                開始日期
                <input
                  type="date"
                  className="backtest-input"
                  value={backtestStart}
                  onChange={(e) => setBacktestStart(e.target.value)}
                />
              </label>
              <label className="backtest-label">
                結束日期
                <input
                  type="date"
                  className="backtest-input"
                  value={backtestEnd}
                  onChange={(e) => setBacktestEnd(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="backtest-run-button"
                onClick={runBacktest}
                disabled={backtestLoading || !stockCode}
              >
                {backtestLoading ? '回測中…' : '執行回測'}
              </button>
            </div>

            {/* 品質評級資訊卡（在執行回測按鈕右側）
            {rating && (
              <div className="quality-assessment-card-inline">
                <h4 className="quality-assessment-title">品質評估</h4>
                <div className={`quality-rating-badge ${rating.color}`}>
                  <span className="rating-icon-large">{getRatingIcon(rating.rating)}</span>
                  <div className="rating-info">
                    <div className="rating-grade">
                      {rating.rating}級 - {rating.label}
                    </div>
                    <div className="rating-description">{rating.description}</div>
                  </div>
                </div>
                <div className="portfolio-eligibility">
                  {rating.portfolio_eligible ? (
                    <span className="eligible-yes">✅ 組合資格：符合納入標準</span>
                  ) : (
                    <span className="eligible-no">❌ 組合資格：不建議納入投資組合</span>
                  )}
                </div>
              </div>
            )} */}
          </div>
          {backtestError && (
            <div className="backtest-error">{backtestError}</div>
          )}
          {backtestResult && (
            <>
              <div className="backtest-metrics">
                <div className="backtest-metric-card">
                  <span className="backtest-metric-label">年化報酬</span>
                  <span className="backtest-metric-value">
                    {(backtestResult.annualized_return * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="backtest-metric-card">
                  <span className="backtest-metric-label">年化波動</span>
                  <span className="backtest-metric-value">
                    {(backtestResult.volatility * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="backtest-metric-card">
                  <span className="backtest-metric-label">最大回撤</span>
                  <span className="backtest-metric-value negative">
                    {(backtestResult.max_drawdown * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="backtest-metric-card">
                  <span className="backtest-metric-label">交易次數</span>
                  <span className="backtest-metric-value">{backtestResult.trade_count}</span>
                </div>
                <div className="backtest-metric-card">
                  <span className="backtest-metric-label">夏普比率</span>
                  <span className="backtest-metric-value">
                    {backtestResult.sharpe_ratio != null
                      ? backtestResult.sharpe_ratio.toFixed(2)
                      : '--'}
                  </span>
                </div>
              </div>

              <div className="backtest-chart">
                <EquityCurveChart equityCurve={backtestResult.equity_curve} />
              </div>
            </>
          )}
        </div>

        {/* AI聊天框和技術指標區塊 */}
        <div className="ai-indicators-row">
          {/* AI聊天框 */}
          <div className="chart-card ai-chat-block">
            <h3 className="chart-title">AI 助手</h3>
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  <div className="message-content">
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                placeholder="輸入您的問題..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="chat-send-button"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isStreaming}
              >
                {isStreaming ? '回覆中...' : '發送'}
              </button>
            </div>
          </div>

          {/* 技術指標區塊 */}
          <div className="chart-card indicators-block">
            <div className="indicators-filter-row">
              <h3 className="chart-title">技術指標</h3>
              <select
                className="indicators-filter-select"
                value={selectedIndicatorGroup}
                onChange={(e) => setSelectedIndicatorGroup(e.target.value as IndicatorGroup)}
              >
                <option value="all">全部</option>
                <option value="MA">MA</option>
                <option value="RETURN">日週報酬率</option>
                <option value="RSI">RSI</option>
                <option value="EMA">EMA</option>
                <option value="KD">KD</option>
                <option value="MACD">MACD</option>
              </select>
            </div>
            <div className="indicators-grid">
              {visibleIndicatorCards.map((card) => (
                <div key={card.id} className="indicator-card">
                  <div className="indicator-label-container">
                    <h4 className="indicator-label">{card.label}</h4>
                    <div className="info-icon-container">
                      <span className="info-icon">!</span>
                      <div className="info-tooltip">
                        <p>{card.description}</p>
                      </div>
                    </div>
                  </div>
                  {card.customRender ? (
                    card.customRender()
                  ) : (
                    <p
                      className={`indicator-value ${
                        card.getValueClassName ? card.getValueClassName() : ''
                      }`}
                    >
                      {card.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockAnalysis
