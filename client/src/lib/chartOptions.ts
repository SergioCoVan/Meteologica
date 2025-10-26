export const baseChartOptions = {
  chart: {
    type: 'area',
    height: 350,
    toolbar: { show: false },
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth' },
  xaxis: {
    type: 'category',
    labels: { rotate: -45 },
  },
  tooltip: { x: { show: true } },
};
