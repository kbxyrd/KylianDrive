<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-2xl mb-4">Se connecter</h1>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label for="username" class="block mb-1">Nom d’utilisateur</label>
        <input
            id="username"
            v-model="form.username"
            type="text"
            required
            class="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label for="password" class="block mb-1">Mot de passe</label>
        <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full border px-3 py-2 rounded"
        />
      </div>
      <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? 'Connexion…' : 'Se connecter' }}
      </button>
      <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
    </form>
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
    // utilise fetch à la place de $fetch
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // pour envoyer/recevoir le cookie
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'Échec de la connexion')
    }
    // tout s'est bien passé, on redirige
    router.push('/')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
