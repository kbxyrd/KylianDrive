// 📁 src/pages/register.vue
<template>
  <div>
    <h2>Inscription</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" placeholder="Mot de passe" type="password" />
    <button @click="register">S'inscrire</button>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const message = ref('')

const register = async () => {
  try {
    const res = await $fetch('/api/register', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    message.value = '✅ Inscription réussie : ' + res.user.email
  } catch (err) {
    message.value = '❌ ' + (err.data?.statusMessage || 'Erreur inconnue')
  }
}
</script>