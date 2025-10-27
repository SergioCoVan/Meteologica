<script lang="ts">
  import { onMount } from 'svelte';
  import { loadInitialData } from './lib/api';
  import { temperatureData, powerData } from './lib/stores';
  import { drawCharts } from './lib/charts';
  import { listenToEvents } from './lib/sse';
  import potencia from "./assets/images/pot.svg";
  import temperatura from "./assets/images/temp.svg";
  import Navbar from "./lib/components/Navbar.svelte";
  import Footer from "./lib/components/Footer.svelte";

  onMount(async () => {
    const { temperature, power } = await loadInitialData();
    temperatureData.set(temperature);
    powerData.set(power);
    drawCharts(temperature, power);
    listenToEvents();
  });
</script>

<style>

  main {
    min-height: calc(100dvh - 52px);
  }
  
  #charts {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    max-width: 1400px;
    margin: auto;
    position: relative;
  }

  h1 {
    text-align: center;
    color: #293b71;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .chart-color {
    background-color: #c1ccee;
    border-radius: 15px;
    padding: 1rem;
  }

  .chart-container {
    position: relative;
  }

  .img-t, .img-p {
    position: absolute;
    right: 10px;
    top: -20px;
    width: 40px;
  }
</style>
<header>
  <Navbar />
</header>
<main>
  <h1>Monitor en Tiempo Real</h1>
  <div id="charts">
    <div class="chart-container">
      <div id="tempChart" class="chart-color"></div>
      <img src={temperatura} alt="icono de temperatura" class="img-t">
    </div>
    <div class="chart-container">
      <div id="powerChart" class="chart-color"></div>
      <img src={potencia} alt="icono de potencia" class="img-p">
    </div>
  </div>
</main>
<Footer />
