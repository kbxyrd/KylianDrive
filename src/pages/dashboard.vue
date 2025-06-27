<template>
  <div class="p-6 max-w-4xl mx-auto space-y-8">
    <h1 class="text-3xl font-bold">Tableau de bord</h1>

    <!-- Loader global -->
    <div v-if="loading" class="text-center py-10">Chargement…</div>

    <!-- SECTION USER -->
    <section v-else-if="role === 'USER'" class="space-y-6">
      <h2 class="text-2xl font-semibold">Mes fichiers</h2>
      <!-- Upload -->
      <div>
        <label class="block mb-2 font-medium">Ajouter un fichier</label>
        <input type="file" @change="onUpload" class="border rounded p-2 w-full" />
      </div>
      <!-- Liste des fichiers -->
      <ul class="space-y-4">
        <li v-for="file in files" :key="file.id" class="flex items-center justify-between border rounded p-3">
          <div>
            <p class="font-medium">{{ file.filename }}</p>
            <p class="text-sm text-gray-600">{{ file.size }} bytes</p>
          </div>
          <div class="flex space-x-2">
            <a :href="file.url" download class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Télécharger
            </a>
            <button @click="onDelete(file.id)" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
              Supprimer
            </button>
          </div>
        </li>
      </ul>
    </section>

    <!-- SECTION ADMIN -->
    <section v-else-if="role === 'ADMIN'" class="space-y-6">
      <h2 class="text-2xl font-semibold">Statistiques utilisateurs</h2>
      <table class="w-full table-auto border-collapse">
        <thead>
        <tr class="bg-gray-100">
          <th class="border px-4 py-2">Username</th>
          <th class="border px-4 py-2">Email</th>
          <th class="border px-4 py-2">Nb fichiers</th>
          <th class="border px-4 py-2">Stockage total</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="u in stats" :key="u.id">
          <td class="border px-4 py-2">{{ u.username }}</td>
          <td class="border px-4 py-2">{{ u.email }}</td>
          <td class="border px-4 py-2">{{ u.count }}</td>
          <td class="border px-4 py-2">{{ u.totalSize }}</td>
        </tr>
        </tbody>
      </table>
    </section>

    <!-- CAS IMPREVU -->
    <section v-else class="text-red-500">
      Rôle inconnu – accès impossible.
    </section>
  </div>
</template>

<script setup lang="ts">
// Composition API
import { ref, onMounted, computed } from 'vue'
// Import explicite pour lever l'erreur TS
import { useAuth } from '@sidebase/nuxt-auth'

// Protége la page (Nuxt-Auth détecte et redirige si non auth)
definePageMeta({ auth: true })

interface FileEntry {
  id: string
  filename: string
  size: number
  url: string
}
interface Stat {
  id: number
  username: string
  email: string
  count: number
  totalSize: number
}

// Récupère status & data
const { status, data: session } = useAuth()

// Traitement du rôle
const role = computed<string | null>(() => {
  if (status.value !== 'authenticated' || !session.value?.user) return null
  return session.value.user.role.toUpperCase()
})

// États locaux
const loading = ref(true)
const files   = ref<FileEntry[]>([])
const stats   = ref<Stat[]>([])

// Methods USER
async function fetchFiles() {
  const { files: f } = await $fetch<{ files: FileEntry[] }>('/api/files/list', { credentials: 'include' })
  files.value = f
}
async function onUpload(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.[0]) return
  const form = new FormData()
  form.append('file', input.files[0])
  await $fetch('/api/files/upload', { method: 'POST', body: form })
  await fetchFiles()
}
async function onDelete(id: string) {
  await $fetch('/api/files/delete', { method: 'POST', body: { id } })
  await fetchFiles()
}

// Method ADMIN
async function fetchStats() {
  const { stats: s } = await $fetch<{ stats: Stat[] }>('/api/admin/stats', { credentials: 'include' })
  stats.value = s
}

// Initialisation
onMounted(async () => {
  if (role.value === 'USER') {
    await fetchFiles()
  } else if (role.value === 'ADMIN') {
    await fetchStats()
  }
  loading.value = false
})
</script>

<style scoped>
/* Tes styles Tailwind ou custom ici */
</style>
