import React from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout, Config } from 'plotly.js';
import type { EquityCurvePoint } from '../../../../../api/types';

interface EquityCurveChartProps {
  equityCurve: EquityCurvePoint[];
}

/**
 * 權益曲線圖：顯示回測累積報酬時序
 */
const EquityCurveChart: React.FC<EquityCurveChartProps> = ({ equityCurve }) => {
  if (!equityCurve.length) return null;

  const dates = equityCurve.map((p) => p.date);
  const cumulativeReturn = equityCurve.map((p) => p.cumulative_return);

  const traces: Data[] = [
    {
      x: dates,
      y: cumulativeReturn,
      type: 'scatter',
      mode: 'lines',
      name: '累積報酬',
      line: { width: 2 },
    },
  ];

  const layout: Partial<Layout> = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#000' },
    xaxis: { color: '#000', title: '日期' },
    yaxis: { color: '#000', title: '累積報酬', tickformat: '.2f' },
    title: '權益曲線',
    margin: { l: 50, r: 20, t: 40, b: 40 },
    showlegend: true,
    legend: {
      x: 0,
      y: 1.15,
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

export default EquityCurveChart;
