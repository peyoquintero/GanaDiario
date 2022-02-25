<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>
<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Ganancias</RouterLink>
        <RouterLink to="/pesajes">Pesajes</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style>
@import "@/assets/base.css";
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}
nav {
  width: 100%;
  font-size: 20px;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  
  background-color: #e7e7e7;
  color: #000000;
}
nav a.router-link-exact-active {
  color: var(--color-text);
}
nav a.router-link-exact-active:hover {
  background-color: transparent;
  background-color: darkslategray;
}
nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}
nav a:first-of-type {
  border: 0;
}
</style>
