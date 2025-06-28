<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- User Info Card -->
      <div class="user-header">
        <div class="user-info">
          <h2>Bienvenue, <strong>{{ username }}</strong></h2>
          <p>Rôle : <span class="role-badge">{{ role }}</span></p>
        </div>
        <button @click="onLogout" class="btn-logout">Déconnexion</button>
      </div>

      <!-- Dashboard Title -->
      <h1 class="dashboard-title">Mon Tableau de Bord</h1>

      <!-- Files Card -->
      <div v-if="role === 'USER'" class="card">
        <h3>Mes fichiers</h3>
        <div class="actions-row">
          <input id="file-upload" type="file" @change="onUpload" class="file-input" />
          <button @click="refreshFiles" class="btn-primary">Actualiser</button>
        </div>
        <div v-if="loading" class="loading-indicator">Chargement…</div>
        <ul v-else-if="files.length" class="file-list">
          <li v-for="file in files" :key="file.id" class="file-item">
            <div>
              <p class="file-name">{{ file.filename }}</p>
              <p class="file-size">{{ file.size }} bytes</p>
            </div>
            <div class="file-actions">
              <a :href="file.url" download class="icon-button download-icon" title="Télécharger">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
                </svg>
              </a>
              <button @click="onDelete(file.id)" class="icon-button delete-icon" title="Supprimer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M6 7h12M9 7v10m6-10v10M4 7l1-4h14l1 4" />
                </svg>
              </button>
            </div>
          </li>
        </ul>
        <p v-else class="no-files">Aucun fichier disponible.</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>

      <!-- Admin Stats Card -->
      <div v-else-if="role === 'ADMIN'" class="card">
        <h3>Statistiques utilisateurs</h3>
        <!-- Contenu Admin -->
      </div>

      <!-- Unknown Role -->
      <div v-else class="card unknown-role">
        Rôle inconnu – accès impossible.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ auth: true })

interface FileEntry { id: string; filename: string; size: number; url: string }

const router = useRouter()
const loading = ref<boolean>(true)
const errorMessage = ref<string | null>(null)
const username = ref<string>('')
const role = ref<string | null>(null)
const files = ref<FileEntry[]>([])

async function init() {
  try {
    const response = await fetch('/api/auth/me', { credentials: 'include' })
    if (response.status === 401) { router.replace('/'); return }
    const { user } = await response.json()
    username.value = user.username
    role.value = user.role.toUpperCase()
    if (role.value === 'USER') await refreshFiles()
  } catch (err: any) { errorMessage.value = err.message }
  finally { loading.value = false }
}

async function refreshFiles() {
  loading.value = true; errorMessage.value = null
  try {
    const res = await fetch('/api/files/list', { credentials: 'include' })
    if (!res.ok) throw new Error('Erreur récupération fichiers')
    const data = await res.json() as { files: FileEntry[] }
    files.value = data.files
  } catch (err: any) { errorMessage.value = err.message }
  finally { loading.value = false }
}

async function onUpload(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.[0]) return
  const form = new FormData(); form.append('file', input.files[0])
  try { const res = await fetch('/api/files/upload', { method: 'POST', credentials: 'include', body: form }); if (!res.ok) throw new Error('Erreur upload') }
  catch (err: any) { errorMessage.value = err.message }
  finally { await refreshFiles() }
}

async function onDelete(id: string) {
  if (!confirm('Supprimer ce fichier ?')) return
  try { const res = await fetch('/api/files/delete', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); if (!res.ok) throw new Error('Erreur suppression') }
  catch (err: any) { errorMessage.value = err.message }
  finally { await refreshFiles() }
}

async function onLogout() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
  router.replace('/')
}

onMounted(init)
</script>

<style scoped>
.dashboard-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2d3748;
  text-align: center;
}

.user-header {
  background: #fff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info h2 {
  font-size: 1.25rem;
  color: #1a202c;
  margin: 0;
}

.user-info p {
  margin: 0.25rem 0 0;
  color: #4a5568;
}

.role-badge {
  font-weight: 600;
  color: #3182ce;
}

.btn-logout {
  background: #e53e3e;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: #c53030;
}

.card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.actions-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.file-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.75rem;
}

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

.loading-indicator {
  text-align: center;
  color: #a0aec0;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.file-item:last-child {
  border-bottom: none;
}

.file-name {
  font-weight: 500;
  color: #2d3748;
}

.file-size {
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.25rem;
}

.file-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #edf2f7;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.icon-button:hover {
  background: #e2e8f0;
}

.download-icon svg {
  stroke: #3182ce;
  width: 1.25rem;
  height: 1.25rem;
}

.delete-icon svg {
  stroke: #e53e3e;
  width: 1.25rem;
  height: 1.25rem;
}

.no-files {
  text-align: center;
  color: #a0aec0;
}

.error-message {
  text-align: center;
  color: #e53e3e;
  margin-top: 1rem;
}

.unknown-role {
  text-align: center;
  color: #e53e3e;
}
</style>
