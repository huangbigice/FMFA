import React from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout, Config } from 'plotly.js';

interface MACDChartProps {
  dates: Date[];
  MACD: number[];
  DIF: number[];
  DEA: number[];
}

/**
 * MACD 指标图组件
 * 显示 MACD 柱状图、DIF 线和 DEA 线
 */
const MACDChart: React.FC<MACDChartProps> = ({ dates, MACD, DIF, DEA }) => {
  const macdColors = MACD.map((v) => (v >= 0 ? 'red' : 'green'));

  const traces: Data[] = [
    {
      x: dates,
      y: MACD,
      type: 'bar',
      marker: { color: macdColors },
      name: 'MACD',
    },
    {
      x: dates,
      y: DIF,
      type: 'scatter',
      mode: 'lines',
      name: 'DIF',
      line: { color: '#ffd93d' },
    },
    {
      x: dates,
      y: DEA,
      type: 'scatter',
      mode: 'lines',
      name: 'DEA',
      line: { color: '#6bcf7f' },
    },
  ];

  const layout: Partial<Layout> = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#000' },
    xaxis: {
      color: '#000',
    },
    yaxis: {
      color: '#000',
    },
    title: 'MACD',
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

export default MACDChart;
