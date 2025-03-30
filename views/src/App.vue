<script setup lang="ts">
import MyArticles from './components/MyArticles.vue'
</script>

<template>
  <div class="main">
    <img alt="Vue logo" src="./assets/capybara_janew.jpg" width="250" />
    <MyArticles msg="Welcome to Your Vue.js App" />
  </div>
</template>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
