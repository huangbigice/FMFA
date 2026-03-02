/**
 * 依下單日與歷史日線，取得「第 N 個交易日」的收盤價。
 * @param orderDateISO 下單日（ISO 字串）
 * @param rows 日線資料（需含 date、close），依日期排序（舊到新或新到舊皆可，內部會過濾排序）
 * @param tradingDays 下單日之後第幾個交易日（預設 7）
 * @returns 第 N 個交易日收盤價；若不足 N 筆或無資料則回傳 null
 */
export function getCloseAfterNTradingDays(
  orderDateISO: string,
  rows: { date: string; close: number | null }[],
  tradingDays: number = 7
): number | null {
  const orderDateStr = orderDateISO.slice(0, 10);

  const after = rows
    .filter((r) => r.date && String(r.date).slice(0, 10) > orderDateStr)
    .map((r) => ({ date: String(r.date).slice(0, 10), close: r.close }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const index = tradingDays - 1;
  const target = after[index];
  if (!target || target.close == null) return null;
  return target.close;
}

/** @deprecated 請改用 getCloseAfterNTradingDays(..., 7) */
export function getCloseAfterSevenTradingDays(
  orderDateISO: string,
  rows: { date: string; close: number | null }[]
): number | null {
  return getCloseAfterNTradingDays(orderDateISO, rows, 7);
}
