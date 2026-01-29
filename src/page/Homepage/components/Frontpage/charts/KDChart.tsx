import React from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout, Config } from 'plotly.js';

interface KDChartProps {
  dates: Date[];
  K: number[];
  D: number[];
}

/**
 * KD 指标图组件
 * 显示 K 线和 D 线，以及超买超卖区域
 */
const KDChart: React.FC<KDChartProps> = ({ dates, K, D }) => {
  const overboughtPoints = K.map((value) => (value > 80 ? value : null));
  const oversoldPoints = K.map((value) => (value < 20 ? value : null));

  const traces: Data[] = [
    {
      x: dates,
      y: K,
      type: 'scatter',
      mode: 'lines',
      name: 'K',
      line: { color: '#ff6b6b' },
    },
    {
      x: dates,
      y: D,
      type: 'scatter',
      mode: 'lines',
      name: 'D',
      line: { color: '#4ecdc4' },
    },
    // 超买线 (80)
    {
      x: dates,
      y: Array(dates.length).fill(80),
      type: 'scatter',
      mode: 'lines',
      line: { dash: 'dot', color: '#888' },
      showlegend: false,
      hoverinfo: 'skip' as const,
    },
    // 超卖线 (20)
    {
      x: dates,
      y: Array(dates.length).fill(20),
      type: 'scatter',
      mode: 'lines',
      line: { dash: 'dot', color: '#888' },
      showlegend: false,
      hoverinfo: 'skip' as const,
    },
    // K > 80 紅點
    {
      x: dates,
      y: overboughtPoints,
      type: 'scatter',
      mode: 'markers',
      name: 'K>80',
      marker: { color: '#ff4d4f', size: 6 },
      showlegend: false,
    },
    // K < 20 綠點
    {
      x: dates,
      y: oversoldPoints,
      type: 'scatter',
      mode: 'markers',
      name: 'K<20',
      marker: { color: '#52c41a', size: 6 },
      showlegend: false,
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
      range: [0, 100],
      color: '#000',
    },
    title: 'KD',
    margin: { l: 50, r:20, t: 50, b: 20 },
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

export default KDChart;
