<script lang="ts">
  import Charts from "./lib/components/Charts.svelte"
  import Navbar from "./lib/components/Navbar.svelte";
  import Footer from "./lib/components/Footer.svelte";

</script>

<header>
  <Navbar />
</header>
<main>
  <h1>Monitor en Tiempo Real</h1>
  <Charts />
</main>
<Footer />

<style>
  main {
    min-height: calc(100dvh - 52px);
  }

  h1 {
    text-align: center;
    color: #293b71;
    font-weight: bold;
    margin-bottom: 2rem;
  }
</style>