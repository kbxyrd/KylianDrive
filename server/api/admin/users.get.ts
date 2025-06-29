// server/api/admin/users.get.ts
import type { H3Event } from 'h3'
import { defineEventHandler, sendError, createError } from 'h3'
import { db } from '../../../src/db/db'
import { users } from '../../../src/db/schema/user'

export default defineEventHandler(async (event: H3Event) => {
  // Optionnel: vérifier rôle ADMIN via token dans cookie
  try {
    const allUsers = await db.select().from(users)
    // Retirer le champ password
    return allUsers.map(u => ({ id: u.id, username: u.username, role: u.role }))
  } catch (err) {
    console.error(err)
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Erreur serveur' }))
  }
})

---

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold">Gestion des utilisateurs</h1>
      <table class="w-full bg-white rounded-lg shadow">
        <thead class="bg-gray-200">
          <tr>
            <th class="p-3 text-left">ID</th>
            <th class="p-3 text-left">Nom d’utilisateur</th>
            <th class="p-3 text-left">Rôle</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-t">
            <td class="p-3">{{ user.id }}</td>
            <td class="p-3">{{ user.username }}</td>
            <td class="p-3">{{ user.role }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="loading" class="text-gray-500">Chargement…</div>
      <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const users = ref<{ id: number; username: string; role: string }[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()

onMounted(async () => {
  // Vérifier rôle ADMIN côté front si nécessaire
  try {
    const res = await fetch('/api/admin/users')
    if (!res.ok) throw new Error('Erreur récupération')
    users.value = await res.json()
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Reprendre vos styles existants */
</style>
