<template>
  <div id="app">
    <nav>
      <router-link to="/">Inicio</router-link>
      <router-link to="/TradeView">Operar</router-link>
      <router-link to="/history">Historial</router-link> 
      <router-link to="/analysis">analysis</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
#app {
  text-align: center;
  padding: 20px;
}
nav {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}
nav a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}
nav a:hover {
  text-decoration: underline;
}
</style>
