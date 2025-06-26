<template>
  <div class="p-6 max-w-4xl mx-auto space-y-8">
    <h1 class="text-3xl font-bold">Tableau de bord</h1>

    <!-- Autres sections de ton dashboard -->
    <section class="bg-white shadow rounded p-4">
      <h2 class="text-2xl font-semibold mb-4">Bienvenue, {{ user.username }}</h2>
      <!-- … -->
    </section>

    <!-- Gestionnaire de fichiers -->
    <section class="bg-white shadow rounded p-6">
      <h2 class="text-2xl font-semibold mb-4">Mes fichiers</h2>

      <!-- Upload -->
      <div class="mb-6">
        <label class="block mb-2 font-medium">Ajouter un fichier</label>
        <input
            type="file"
            @change="upload"
            class="border rounded p-2 w-full"
        />
      </div>

      <!-- Liste des fichiers -->
      <ul class="space-y-4">
        <li
            v-for="f in files"
            :key="f.id"
            class="flex items-center justify-between border rounded p-3"
        >
          <div>
            <p class="font-medium">{{ f.filename }}</p>
            <p class="text-sm text-gray-600">{{ f.size }} bytes</p>
          </div>
          <div class="flex space-x-2">
            <a
                :href="`/api/files/download/${f.id}`"
                download
                class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Télécharger
            </a>
            <button
                @click="remove(f.id)"
                class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
// Si tu as déjà récupéré ton utilisateur dans ce composant, sinon adapte
import { ref, onMounted } from 'vue'
import { useFetch } from '#app'

interface FileEntry {
  id: string
  filename: string
  size: number
  url?: string
}
const files = ref<FileEntry[]>([])
const user = ref<{ username: string }>({ username: '' })

// Charge ton profil et ta liste de fichiers
async function fetchDashboard() {
  // Charge le user
  try {
    const me = await $fetch<{ sub: number; username: string; role: string }>('/api/auth/me', {
      credentials: 'include'
    })
    user.value.username = me.username
  } catch {
    // si pas loggé, rediriger ou handle
  }

  // Charge les fichiers
  const res = await $fetch<{ files: FileEntry[] }>('/api/files/list')
  files.value = res.files
}

onMounted(fetchDashboard)

// Upload
async function upload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const form = new FormData()
  form.append('file', file)
  await $fetch('/api/files/upload', { method: 'POST', body: form })
  await fetchDashboard()
}

// Suppression
async function remove(id: string) {
  await $fetch('/api/files/delete', { method: 'POST', body: { id } })
  await fetchDashboard()
}
</script>

<style scoped>
/* Styles éventuels pour ton dashboard */
</style>
