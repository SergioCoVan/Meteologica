<script>
  import logo from "../../assets/images/logo.png"
</script>

<nav>
  <div class="nav-logo">
    <img src={logo} alt="logo de meteologica" class="logo">
    Meteologica
  </div>
  <div class="nav-a">
    <a>Servicios</a>
    <a>Sobre nosotros</a>
    <a>Contacto</a>
  </div>
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 2rem;
    background-color: rgba(255, 255, 255, 0.203);
    margin-bottom: 2rem;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    font-size: 1.7rem;
  }

  .logo {
    width: 100px;
    padding-right: 1rem;
  }

  .nav-a {
    display: flex;
    gap: 1rem;

    a {
      text-decoration: none;
      color: black;
      font-size: 1.2rem;
    }
  }

</style>