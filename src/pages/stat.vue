<!-- pages/stat.vue -->
<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto space-y-8">

      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">Statistiques Utilisateurs</h1>
        <button @click="router.push('/dashboard')" class="btn-primary">
          Retour
        </button>
      </div>

      <div v-if="loading" class="flex justify-center text-gray-600">Chargement…</div>
      <div v-else-if="error" class="flex justify-center text-red-500">{{ error }}</div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-xl shadow-lg">
          <thead>
          <tr class="bg-blue-100">
            <th class="px-6 py-4 text-left text-gray-700 uppercase">ID</th>
            <th class="px-6 py-4 text-left text-gray-700 uppercase">Utilisateur</th>
            <th class="px-6 py-4 text-left text-gray-700 uppercase">Rôle</th>
            <th class="px-6 py-4 text-left text-gray-700 uppercase">Espace consommé de l'utilisateur (Ko)</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="user in users"
              :key="user.id"
              class="border-b hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-gray-800">{{ user.id }}</td>
            <td class="px-6 py-4 text-gray-800">{{ user.username }}</td>
            <td class="px-6 py-4 text-gray-800">{{ user.role }}</td>
            <td class="px-6 py-4 text-gray-800">{{ user.totalSize }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface UserEntry { id: number; username: string; role: string; totalSize: number }
const users = ref<UserEntry[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()

onMounted(async () => {
  try {
    const res = await fetch('/api/admin/users')
    if (res.status === 401) { router.replace('/login'); return }
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
.min-h-screen { min-height: 100vh; }
.bg-gray-100 { background-color: #f7fafc; }
.p-8 { padding: 2rem; }
.max-w-6xl { max-width: 72rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.space-y-8 > * + * { margin-top: 2rem; }

.bg-white { background: #ffffff; }
.rounded-xl { border-radius: 1rem; }
.shadow-lg { box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
.min-w-full { min-width: 100%; }

.bg-blue-100 { background-color: #ebf8ff; }
.text-gray-700 { color: #4a5568; }
.uppercase { text-transform: uppercase; }
.border-b { border-bottom: 1px solid #e2e8f0; }
.hover\:bg-gray-50:hover { background-color: #f9fafb; }
.transition-colors { transition: background-color 0.2s; }

.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.text-gray-800 { color: #2d3748; }
.text-gray-600 { color: #718096; }
.text-red-500 { color: #f56565; }

.btn-primary {
  background: #3182ce;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #2b6cb0;
}
</style>