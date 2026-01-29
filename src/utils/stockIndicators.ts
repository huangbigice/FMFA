/**
 * 股票技术指标计算工具函数
 */

/**
 * 简单移动平均线 (Simple Moving Average)
 * @param arr 价格数组
 * @param n 周期
 * @returns SMA 数组，前 n-1 个值为 null
 */
export const SMA = (arr: number[], n: number): (number | null)[] => {
  return arr.map((v, i) => {
    if (i < n - 1) return null;
    const sum = arr.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0);
    return sum / n;
  });
};

/**
 * 指数移动平均线 (Exponential Moving Average)
 * @param arr 价格数组
 * @param n 周期
 * @returns EMA 数组
 */
export const EMA = (arr: number[], n: number): number[] => {
  const k = 2 / (n + 1);
  const ema: number[] = [arr[0]];
  
  for (let i = 1; i < arr.length; i++) {
    ema.push(arr[i] * k + ema[i - 1] * (1 - k));
  }
  
  return ema;
};

/**
 * 判断数组趋势方向
 * @param arr 数值数组
 * @returns 上升返回 "↑"，下降返回 "↓"
 */
export const getArrow = (arr: (number | null)[]): string => {
  const validArr = arr.filter((v): v is number => v !== null);
  if (validArr.length < 2) return '';
  return validArr[validArr.length - 1] >= validArr[validArr.length - 2] ? '↑' : '↓';
};

/**
 * 将数值限制在指定区间内
 */
const clamp = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const DEFAULT_KD_PERIOD = 9;
const INITIAL_K = 50;
const INITIAL_D = 50;
const INITIAL_RSV = 50;

/**
 * 计算 KD 指标
 * @param close 收盘价数组
 * @param high 最高价数组
 * @param low 最低价数组
 * @param period 周期，默认 9
 * @returns { K: number[], D: number[] }
 */
export const calculateKD = (
  close: number[],
  high: number[],
  low: number[],
  period: number = DEFAULT_KD_PERIOD
): { K: number[]; D: number[] } => {
  const length = close.length;
  if (length === 0) {
    return { K: [], D: [] };
  }

  const K: number[] = new Array(length);
  const D: number[] = new Array(length);

  let prevK = INITIAL_K;
  let prevD = INITIAL_D;
  let prevRSV = INITIAL_RSV;

  for (let i = 0; i < length; i++) {
    const c = close[i];
    const h = high[i];
    const l = low[i];

    // 判斷當天資料是否有效
    const hasInvalidPrice =
      c == null ||
      h == null ||
      l == null ||
      Number.isNaN(c) ||
      Number.isNaN(h) ||
      Number.isNaN(l);

    let rsv: number;

    if (hasInvalidPrice) {
      // 缺資料時延用前一筆 RSV，避免斷線
      rsv = prevRSV;
    } else {
      // 計算過去 period 日的最高價與最低價
      const start = Math.max(0, i - period + 1);
      let windowHigh = -Infinity;
      let windowLow = Infinity;

      for (let j = start; j <= i; j++) {
        const hj = high[j];
        const lj = low[j];

        if (
          hj == null ||
          lj == null ||
          Number.isNaN(hj) ||
          Number.isNaN(lj)
        ) {
          // 略過無效資料
          continue;
        }

        if (hj > windowHigh) windowHigh = hj;
        if (lj < windowLow) windowLow = lj;
      }

      if (windowHigh === -Infinity || windowLow === Infinity) {
        // 視為沒有有效窗口，延用前值
        rsv = prevRSV;
      } else if (windowHigh === windowLow) {
        // 分母為 0，沿用前值
        rsv = prevRSV;
      } else {
        rsv = ((c - windowLow) / (windowHigh - windowLow)) * 100;
        rsv = clamp(rsv, 0, 100);
      }
    }

    // 券商慣用的 2/3, 1/3 平滑
    const kRaw = (2 / 3) * prevK + (1 / 3) * rsv;
    const kToday = clamp(kRaw, 0, 100);
    const dRaw = (2 / 3) * prevD + (1 / 3) * kToday;
    const dToday = clamp(dRaw, 0, 100);

    K[i] = kToday;
    D[i] = dToday;

    prevK = kToday;
    prevD = dToday;
    prevRSV = rsv;
  }

  return { K, D };
};

/**
 * 计算 MACD 指标
 * @param close 收盘价数组
 * @returns { DIF: number[], DEA: number[], MACD: number[] }
 */
export const calculateMACD = (close: number[]): {
  DIF: number[];
  DEA: number[];
  MACD: number[];
} => {
  const ema12 = EMA(close, 12);
  const ema26 = EMA(close, 26);
  const DIF = ema12.map((v, i) => v - ema26[i]);
  const DEA = EMA(DIF, 9);
  const MACD = DIF.map((v, i) => 2 * (v - DEA[i]));
  
  return { DIF, DEA, MACD };
};

/**
 * 计算所有技术指标
 * @param stockData 股票数据
 * @returns 包含所有指标的对象
 */
export interface StockIndicators {
  MAs: Record<number, (number | null)[]>;
  MV5: (number | null)[];
  MV20: (number | null)[];
  KD: { K: number[]; D: number[] };
  MACD: { DIF: number[]; DEA: number[]; MACD: number[] };
}

export const calculateAllIndicators = (
  close: number[],
  high: number[],
  low: number[],
  volume: number[]
): StockIndicators => {
  const maList = [5, 10, 20, 60, 120, 240];
  const MAs: Record<number, (number | null)[]> = {};
  
  maList.forEach((m) => {
    MAs[m] = SMA(close, m);
  });
  
  const MV5 = SMA(volume, 5);
  const MV20 = SMA(volume, 20);
  const KD = calculateKD(close, high, low, 9);
  const MACD = calculateMACD(close);
  
  return {
    MAs,
    MV5,
    MV20,
    KD,
    MACD,
  };
};
