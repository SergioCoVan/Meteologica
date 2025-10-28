<script lang="ts">
  import { onMount } from 'svelte';
  import { loadInitialData } from '../api';
  import { temperatureData, powerData } from '../stores';
  import { drawCharts } from '../charts';
  import { listenToEvents } from '../sse';
  import potencia from "../../assets/images/pot.svg";
  import temperatura from "../../assets/images/temp.svg";
  import ReactiveChart from '../components/ReactiveCharts.svelte';

  onMount(async () => {
    const { temperature, power } = await loadInitialData();
    temperatureData.set(temperature);
    powerData.set(power);
    
    listenToEvents();
  });
</script>

<div id="charts">
  <div class="chart-container">
    <ReactiveChart
      title="Temperatura (°C)"
      color="#ff5722"
      data={$temperatureData.map(d => ({ time: d.time, value: d.temperatureC }))}
    />
    <img src={temperatura} alt="icono de temperatura" class="img-t" />
  </div>

  <div class="chart-container">
    <ReactiveChart
      title="Potencia (kW)"
      color="#2196f3"
      data={$powerData.map(d => ({ time: d.time, value: d.powerKW }))}
    />
    <img src={potencia} alt="icono de potencia" class="img-p" />
  </div>
</div>

<style>
  #charts {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    max-width: 1400px;
    margin: auto;
    position: relative;
  }

  .chart-container {
    position: relative;
    background-color: #c1ccee;
    border-radius: 15px;
    padding: 1.5rem 1rem 0 1rem;
  }

  .img-t, .img-p {
    position: absolute;
    right: 10px;
    top: -20px;
    width: 40px;
  }
</style>