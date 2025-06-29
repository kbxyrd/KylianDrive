<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-5xl mx-auto space-y-6">

      <div class="user-header">
        <div class="user-info">
          <h2>Bienvenue, <strong>{{ username }}</strong></h2>
          <p>Rôle : <span class="role-badge">{{ role }}</span></p>
        </div>
        <button @click="onLogout" class="btn-logout">Déconnexion</button>
      </div>

      <div class="flex items-center justify-between">
        <h1 class="dashboard-title">Mon Tableau de Bord</h1>
        <button
            v-if="role === 'ADMIN'"
            @click="router.push('/stat')"
            class="btn-primary"
        >
          Liste des Utilisateurs
        </button>
      </div>

      <div class="card">
        <h3 class="card-title">
          {{ role === 'ADMIN' ? 'Tous les fichiers' : 'Mes fichiers' }}
        </h3>

        <div class="actions-row" v-if="role === 'USER' || role === 'ADMIN'">
          <input id="file-upload" type="file" @change="onUpload" class="file-input" />
        </div>

        <div v-if="loading" class="loading-indicator">Chargement…</div>

        <table v-else class="table-list w-full text-left">
          <thead>
          <tr>
            <th>Nom du fichier</th>
            <th>Taille</th>
            <th v-if="role === 'ADMIN'">Utilisateur</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="file in files" :key="file.id" class="hover:bg-gray-50">
            <td>{{ file.filename }}</td>
            <td>{{ file.size }} bytes</td>
            <td v-if="role === 'ADMIN'">{{ file.username }}</td>
            <td>
              <div class="file-actions">
                <!-- Téléchargement via méthode fetch pour garantir un GET -->
                <button @click="downloadFile(file.id, file.filename)" class="icon-button download-icon" title="Télécharger">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16"/></svg>
                </button>
                <button @click="onDelete(file.id)" class="icon-button delete-icon" title="Supprimer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 7h12M9 7v10m6-10v10M4 7l1-4h14l1 4"/></svg>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

        <p v-if="!loading && files.length === 0" class="no-files">Aucun fichier disponible.</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ auth: true })

interface FileEntry { id: string; filename: string; size: number; username?: string }

const router = useRouter()
const loading = ref<boolean>(true)
const errorMessage = ref<string | null>(null)
const username = ref<string>('')
const role = ref<'USER' | 'ADMIN' | null>(null)
const files = ref<FileEntry[]>([])

async function init() {
  loading.value = true
  errorMessage.value = null
  try {
    const response = await fetch('/api/auth/me', { credentials: 'include' })
    if (response.status === 401) { router.replace('/'); return }
    const { user } = await response.json()
    username.value = user.username
    role.value = user.role.toUpperCase() as 'USER' | 'ADMIN'
    await refreshFiles()
  } catch (err: any) {
    errorMessage.value = err.message
  } finally {
    loading.value = false
  }
}

async function refreshFiles() {
  loading.value = true
  errorMessage.value = null
  try {
    const endpoint = role.value === 'ADMIN' ? '/api/admin/files' : '/api/files/list'
    const res = await fetch(endpoint, { credentials: 'include' })
    if (!res.ok) throw new Error('Erreur récupération fichiers')
    const data = await res.json() as { files: FileEntry[] }
    files.value = data.files
  } catch (err: any) {
    errorMessage.value = err.message
  } finally {
    loading.value = false
  }
}

async function onUpload(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.[0]) return
  const form = new FormData()
  form.append('file', input.files[0])
  try {
    const res = await fetch('/api/files/upload', { method: 'POST', credentials: 'include', body: form })
    if (!res.ok) throw new Error('Erreur upload')
  } catch (err: any) {
    errorMessage.value = err.message
  } finally {
    await refreshFiles()
  }
}


async function downloadFile(id: string, filename: string) {
  try {
    const res = await fetch(`/api/files/${id}`, { credentials: 'include' })
    if (!res.ok) throw new Error('Erreur de téléchargement')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (err: any) {
    errorMessage.value = err.message
  }
}

async function onDelete(id: string) {
  if (!confirm('Supprimer ce fichier ?')) return
  try {
    const res = await fetch('/api/files/delete', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (!res.ok) throw new Error('Erreur suppression')
  } catch (err: any) {
    errorMessage.value = err.message
  } finally {
    await refreshFiles()
  }
}

async function onLogout() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
  router.replace('/')
}

onMounted(init)
</script>

<style scoped>
/* styles inchangés */
.min-h-screen { min-height: 100vh; }
.bg-gray-100 { background-color: #f7fafc; }
.p-6 { padding: 1.5rem; }
.max-w-5xl { max-width: 64rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.space-y-6 > * + * { margin-top: 1.5rem; }

.user-header { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.user-info h2 { font-size: 1.25rem; color: #1a202c; margin: 0; }
.user-info p { margin: 0.25rem 0 0; color: #4a5568; }
.role-badge { font-weight: 600; color: #3182ce; }
.btn-logout { background: #e53e3e; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 0.75rem; cursor: pointer; transition: background 0.2s; }
.btn-logout:hover { background: #c53030; }

.dashboard-title { font-size: 2rem; text-align: center; color: #2d3748; }
.card { background: #fff; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.card-title { font-size: 1.125rem; margin-bottom: 1rem; color: #2d3748; }
.actions-row { display: flex; gap: 1rem; margin-bottom: 1rem; }
.file-input { flex: 1; padding: 0.5rem; border: 1px solid #cbd5e0; border-radius: 0.75rem; }
.loading-indicator { text-align: center; color: #a0aec0; }
.table-list { width: 100%; border-collapse: collapse; }
.table-list th, .table-list td { padding: 0.75rem; border-bottom: 1px solid #e2e8f0; }
.table-list th { text-align: left; background: #f1f5f9; }
.file-actions { display: flex; gap: 0.5rem; }
.icon-button { width: 2rem; height: 2rem; display: inline-flex; align-items: center; justify-content: center; background: #edf2f7; border-radius: 0.5rem; transition: background 0.2s; cursor: pointer; }
.icon-button:hover { background: #e2e8f0; }
.download-icon svg { stroke: #3182ce; width: 1.25rem; height: 1.25rem; }
.delete-icon svg { stroke: #e53e3e; width: 1.25rem; height: 1.25rem; }
.no-files, .unknown-role { text-align: center; color: #a0aec0; }
.error-message { text-align: center; color: #e53e3e; margin-top: 1rem; }
.btn-primary { background: #3182ce; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 0.75rem; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover { background: #2b6cb0; }
</style>
