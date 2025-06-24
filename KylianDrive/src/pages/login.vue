// 📁 src/pages/login.vue
<template>
  <div>
    <h2>Connexion</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />
    <button @click="login">Se connecter</button>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const message = ref('')
const router = useRouter()

const login = async () => {
  try {
    const res = await $fetch('/api/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    useCookie('session').value = res.user
    router.push('/me')
  } catch (err) {
    message.value = '❌ ' + (err.data?.statusMessage || 'Email ou mot de passe invalide')
  }
}
</script>
