<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>
<template>
   <div>
      <nav>
        <RouterLink to="/">Ganancias</RouterLink>
        <RouterLink to="/pesajes">Pesajes</RouterLink>
        <RouterLink to="/ganado">Codigos</RouterLink>
      </nav>
      <RouterView />
 </div>
</template>

<style>
@import "@/assets/base.css";
a {
  text-decoration: none;
  transition: 0.4s;
  color:black;
}
@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}
nav {
  font-size: 20px;
  text-align: center;
  color: #000000;
}
nav a.router-link-exact-active {
  color:hsla(160, 100%, 37%, 1);
}
nav a.router-link-exact-active:hover {
  background-color: transparent;
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
