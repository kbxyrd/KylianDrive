<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = async () => {
  error.value = ''

  try {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })

    if (res && res.success) {
      router.push('/dashboard')
    } else {
      error.value = res.message || 'Connexion échouée'
    }
  } catch (err: any) {
    error.value = err?.data?.message || 'Erreur inconnue'
  }
}
</script>

<template>
  <div class="login-container">
    <h1>Connexion</h1>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Nom d'utilisateur" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button type="submit">Se connecter</button>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
}
</style>
