// 📁 src/pages/me.vue
<template>
  <div>
    <h2>Profil</h2>
    <div v-if="user">
      <p>Bienvenue, {{ user.email }}</p>
    </div>
    <div v-else>
      <p>Chargement...</p>
    </div>
  </div>
</template>

<script setup>
const user = useCookie('session')
</script>
