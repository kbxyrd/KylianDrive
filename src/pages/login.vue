<script setup>
const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = async () => {
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username, password }
    })

    if (res.success) {
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = err?.data?.message || 'Erreur'
  }
}
</script>

<template>
  <form @submit.prevent="login">
    <input v-model="username" placeholder="Nom d'utilisateur" />
    <input v-model="password" type="password" />
    <button type="submit">Connexion</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>
