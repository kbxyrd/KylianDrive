<template>
  <div class="container">
    <h1>Bienvenue sur DriveKylian</h1>

    <div v-if="user" class="user-info">
      <p>
        Connecté en tant que&nbsp;
        <span class="username">{{ user.username }}</span>&nbsp;(
        <span class="user-role">{{ user.role }}</span> )
      </p>
      <p v-if="user.role === 'admin'" class="alert admin">
        🔑 Vous avez les droits administrateur.
      </p>
      <p v-else class="alert user">
        👤 Vous êtes un utilisateur standard.
      </p>
    </div>

    <div v-else class="login-prompt">
      <NuxtLink to="/login" class="login-link">Se connecter</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface MeResponse { id: number; username: string; role: string }

const user = ref<MeResponse | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' })
    if (!res.ok) throw new Error()
    user.value = await res.json()
  } catch {
    user.value = null
  }
})
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 3rem auto;
  padding: 1.5rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  font-family: sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #333;
}

.user-info {
  font-size: 1rem;
  color: #444;
  line-height: 1.6;
}

.username {
  font-weight: 600;
}

.user-role {
  font-style: italic;
  color: #555;
}

.alert {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
}

.alert.admin {
  background: #e0f7e9;
  border-left: 4px solid #2a9d8f;
  color: #276749;
}

.alert.user {
  background: #e8f0fe;
  border-left: 4px solid #3b82f6;
  color: #1e40af;
}

.login-prompt {
  text-align: center;
  margin-top: 2rem;
}

.login-link {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background: #3b82f6;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  transition: background .2s;
}

.login-link:hover {
  background: #2563eb;
}
</style>
