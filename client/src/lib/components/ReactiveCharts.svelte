<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import ApexCharts from 'apexcharts';

  export let title: string;
  export let color: string = '#2196f3';
  export let data: { time: string; value: number }[] = [];

  let chartEl: HTMLDivElement;
  let chart: ApexCharts;

  // opciones base
  let options = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: {
      categories: [],
      labels: { rotate: -45, hideOverlappingLabels: true }
    },
    yaxis: {
      labels: {
        formatter: (val) => val.toFixed(2),
        style: { colors: '#293b71' }
      }
    },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0 }
    },
    colors: [color],
    title: { text: title, align: 'left', style: { color: '#293b71' } },
    series: [{ name: title, data: [] }]
  };

  // Se monta el gráfico una sola vez
  onMount(() => {
    chart = new ApexCharts(chartEl, options);
    chart.render();
  });

  // Se destruye al desmontar
  onDestroy(() => {
    chart?.destroy();
  });

  // ⚡ Reacción automática: cuando cambia `data`, actualiza sin redibujar
  $: if (chart && data.length) {
    chart.updateSeries(
      [{ name: title, data: data.map((d) => d.value) }],
      false
    );
    chart.updateOptions(
      { xaxis: { categories: data.map((d) => d.time.slice(0, 5)) } },
      false
    );
  }
</script>

<div bind:this={chartEl} style="width: 100%; height: 100%;"></div>
