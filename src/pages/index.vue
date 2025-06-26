<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Se connecter</h1>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="username">Nom d’utilisateur</label>
          <input
              id="username"
              v-model="form.username"
              type="text"
              required
          />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
              id="password"
              v-model="form.password"
              type="password"
              required
          />
        </div>
        <button :disabled="loading">
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const loading = ref(false)
const error = ref<string | null>(null)

async function onSubmit() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({} as any))
      throw new Error(data.statusMessage || data.message || 'Échec de la connexion')
    }
    // une fois connecté·e, on va au dashboard
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f2f4f7;
  font-family: Arial, sans-serif;
}

.login-card {
  background: #fff;
  padding: 2rem;
  width: 320px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-card h1 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccd0d5;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.6rem;
  background: #0070f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

button:disabled {
  background: #a0bce6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #005bb5;
}

.error {
  margin-top: 1rem;
  color: #d00;
  font-size: 0.9rem;
  text-align: center;
}
</style>
