import React from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout, Config } from 'plotly.js';

interface VolumeChartProps {
  dates: Date[];
  volume: number[];
  close: number[];
  open: number[];
}

/**
 * 成交量图组件
 * 根据涨跌显示不同颜色
 */
const VolumeChart: React.FC<VolumeChartProps> = ({
  dates,
  volume,
  close,
  open,
}) => {
  const colors = volume.map((_, i) => (close[i] >= open[i] ? 'red' : 'green'));

  const traces: Data[] = [
    {
      x: dates,
      y: volume,
      type: 'bar',
      marker: { color: colors },
      name: '成交量',
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
    title: '成交量',
    margin: { l: 50, r: 20, t: 40, b: 40 },
    showlegend: false,
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

export default VolumeChart;
