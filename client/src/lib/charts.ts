// src/lib/charts.ts
import ApexCharts from 'apexcharts';
import { baseChartOptions } from './chartOptions';
import type { TemperaturePoint, PowerPoint } from './types';

let temperatureChart: ApexCharts | null = null;
let powerChart: ApexCharts | null = null;


//Dibuja las gráficas iniciales con reducción de puntos y redondeo a 2 decimales
export const drawCharts = (
  temperatureData: TemperaturePoint[],
  powerData: PowerPoint[]
) => {
  destroyCharts();

  const tempData = downsample(temperatureData);
  const powData = downsample(powerData);

  // --- Temperatura ---
  temperatureChart = new ApexCharts(document.querySelector('#tempChart'), {
    ...baseChartOptions,
    chart: { ...baseChartOptions.chart, type: 'area' },
    series: [
      {
        name: 'Temperatura (°C)',
        data: tempData.map((d) => Number(d.temperatureC.toFixed(2))),
      },
    ],
    // ocultamos puntos en vista general y los mostramos al hover
    markers: {
      size: 0,
      hover: { size: 5 },
    },
    xaxis: {
      categories: tempData.map((d) => d.time.slice(0, 5)),
      labels: { rotate: -45, hideOverlappingLabels: true },
    },
    yaxis: {
      labels: { formatter: (val: number) => val.toFixed(2), style: { colors: '#293b71' } },
    },
    colors: ['#ff5722'],
    title: { text: 'Temperatura (°C)', align: 'left', style: { color: '#293b71' } },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0 },
    },
  });
  temperatureChart.render();

  // --- Potencia ---
  powerChart = new ApexCharts(document.querySelector('#powerChart'), {
    ...baseChartOptions,
    chart: { ...baseChartOptions.chart, type: 'area' },
    series: [
      {
        name: 'Potencia (kW)',
        data: powData.map((d) => Number(d.powerKW.toFixed(2))),
      },
    ],
    markers: { size: 0, hover: { size: 5 } },
    xaxis: {
      categories: powData.map((d) => d.time.slice(0, 5)),
      labels: { rotate: -45, hideOverlappingLabels: true },
    },
    yaxis: {
      labels: { formatter: (val: number) => val.toFixed(2), style: { colors: '#293b71' } },
    },
    colors: ['#2196f3'],
    title: { text: 'Potencia (kW)', align: 'left', style: { color: '#293b71' } },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0 },
    },
  });
  powerChart.render();
}


//Actualiza las gráficas sin redibujarlas, aplicando downsampling y redondeo - Conserva el zoom/viewport si existe.
export const updateCharts = (
  temperatureData: TemperaturePoint[],
  powerData: PowerPoint[]
) => {
  if (temperatureChart && powerChart) {
    const tempData = downsample(temperatureData);
    const powData = downsample(powerData);

    // --- Guardar vista actual (si existe) ---
    // getLowestVisibleX/getHighestVisibleX funcionan si hay zoom o selección actual
    const tempHasView =
      typeof (temperatureChart as any).getLowestVisibleX === 'function' &&
      typeof (temperatureChart as any).getHighestVisibleX === 'function';
    const powHasView =
      typeof (powerChart as any).getLowestVisibleX === 'function' &&
      typeof (powerChart as any).getHighestVisibleX === 'function';

    const tempView = tempHasView
      ? {
          min: (temperatureChart as any).getLowestVisibleX(),
          max: (temperatureChart as any).getHighestVisibleX(),
        }
      : null;

    const powView = powHasView
      ? {
          min: (powerChart as any).getLowestVisibleX(),
          max: (powerChart as any).getHighestVisibleX(),
        }
      : null;

    // --- Actualizar series (sin animación fuerte) ---
    temperatureChart.updateSeries(
      [
        {
          name: 'Temperatura (°C)',
          data: tempData.map((d) => Number(d.temperatureC.toFixed(2))),
        },
      ],
      false // evita animación que podría resetear vista
    );

    // Actualizar categorías sin redibujar/animar para evitar reset
    temperatureChart.updateOptions(
      { xaxis: { categories: tempData.map((d) => d.time.slice(0, 5)) } },
      false // redrawPaths
    );

    powerChart.updateSeries(
      [
        {
          name: 'Potencia (kW)',
          data: powData.map((d) => Number(d.powerKW.toFixed(2))),
        },
      ],
      false
    );

    powerChart.updateOptions(
      { xaxis: { categories: powData.map((d) => d.time.slice(0, 5)) } },
      false
    );

    // --- Restaurar zoom/viewport si existía ---
    if (tempView && tempView.min != null && tempView.max != null) {
      try {
        temperatureChart.zoomX(tempView.min, tempView.max);
      } catch (e) {
        // si no se puede restaurar, lo ignoramos sin romper la app
      }
    }

    if (powView && powView.min != null && powView.max != null) {
      try {
        powerChart.zoomX(powView.min, powView.max);
      } catch (e) {
        // ignorar
      }
    }
  }
}


//Reduce el número de puntos visibles para aligerar la gráfica
const downsample = <T>(data: T[], maxPoints = 60): T[] => {
  if (data.length <= maxPoints) return data;

  const step = Math.floor(data.length / maxPoints) || 1;
  return data.filter((_, i) => i % step === 0);
}


//Destruye las instancias de ApexCharts previas
export const destroyCharts = () => {
  temperatureChart?.destroy();
  powerChart?.destroy();
}
