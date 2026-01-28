import React from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout, Config } from 'plotly.js';

interface KLineChartProps {
  dates: Date[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  maData: Record<number, (number | null)[]>;
  maList?: number[];
}

/**
 * K線图组件
 * 显示蜡烛图和移动平均线
 */
const KLineChart: React.FC<KLineChartProps> = ({
  dates,
  open,
  high,
  low,
  close,
  maData,
  maList = [5, 10, 20, 60, 120, 240],
}) => {
  const traces: Data[] = [
    // K線
    {
      type: 'candlestick',
      x: dates,
      open,
      high,
      low,
      close,
      increasing: { line: { color: 'red' } },
      decreasing: { line: { color: 'green' } },
      name: 'K線',
    },
    // 移动平均线
    ...maList.map((m) => ({
      x: dates,
      y: maData[m],
      type: 'scatter' as const,
      mode: 'lines' as const,
      name: `MA${m}`,
      line: { width: 1 },
    })),
  ];

  const layout: Partial<Layout> = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#000' },
    xaxis: { 
      rangeslider: { visible: false },
      color: '#000',
    },
    yaxis: {
      color: '#000',
    },
    title: 'K 線',
    margin: { l: 50, r: 20, t: 80, b: 40 },
    showlegend: true,
    legend: {
      x: 0,
      y: 1.1,
      xanchor: 'left',
      yanchor: 'top',
      orientation: 'h',
      bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#000' },
    },
  };

  const config: Partial<Config> = {
    displayModeBar: false,
    responsive: true,
  };

  return (
    <Plot
      data={traces}
      layout={layout}
      config={config}
      style={{ width: '100%', height: '300px' }}
      useResizeHandler
    />
  );
};

export default KLineChart;
