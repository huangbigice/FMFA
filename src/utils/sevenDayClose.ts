/**
 * 依下單日與歷史日線，取得「第 7 個交易日」的收盤價。
 * @param orderDateISO 下單日（ISO 字串）
 * @param rows 日線資料（需含 date、close），依日期排序（舊到新或新到舊皆可，內部會過濾排序）
 * @returns 第 7 個交易日收盤價；若不足 7 筆或無資料則回傳 null
 */
export function getCloseAfterSevenTradingDays(
  orderDateISO: string,
  rows: { date: string; close: number | null }[]
): number | null {
  const orderDateStr = orderDateISO.slice(0, 10);

  const after = rows
    .filter((r) => r.date && String(r.date).slice(0, 10) > orderDateStr)
    .map((r) => ({ date: String(r.date).slice(0, 10), close: r.close }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const seventh = after[6];
  if (!seventh || seventh.close == null) return null;
  return seventh.close;
}
