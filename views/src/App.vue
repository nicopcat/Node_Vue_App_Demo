<script setup lang="ts">

</script>

<template>
  <div class="main">
    <nav class="navbar">
      <RouterLink to="/" class="nav-item">首页</RouterLink>
      <RouterLink to="/article" class="nav-item">日记</RouterLink>
      <RouterLink to="/todos" class="nav-item">待办</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>


<style scoped>

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.nav-item {
  margin-right: 2rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}
.nav-item:hover {
  color: #42b883;
}
.main {
  padding-top: 70px;
}
</style>
