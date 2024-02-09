<template>
  <div class="main">
    <img alt="Vue logo" src="./assets/capybara_janew.jpg" width="250" />
    <MyArticles msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import MyArticles from './components/MyArticles.vue'

export default {
  name: 'App',
  components: {
    MyArticles
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.main {
  margin: 6rem;
}

img {
  margin-bottom: 2rem;
}
</style>
