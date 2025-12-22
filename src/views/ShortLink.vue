<template>
  <div class="shortlink-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">
          <span class="text-gradient">{{ $t('shortlink.title') }}</span>
        </h1>
        <p class="page-subtitle">{{ $t('shortlink.subtitle') }}</p>
      </div>

      <div class="shortlink-content glass-card">
        <div class="create-section">
          <h2 class="section-title"> {{ $t('shortlink.createTitle') }}</h2>
          
          <div class="form-group">
            <label class="form-label">{{ $t('shortlink.originalUrl') }}</label>
            <input type="text" class="form-input" v-model="newUrl" :placeholder="$t('shortlink.urlPlaceholder')" />
          </div>

          <div class="form-group">
            <label class="form-label">{{ $t('shortlink.customCode') }}</label>
            <input type="text" class="form-input" v-model="customCode" :placeholder="$t('shortlink.codePlaceholder')" />
          </div>

          <button class="btn btn-primary" @click="createShortLink" :disabled="!newUrl || loading">
            <span v-if="loading"> {{ $t('common.loading') }}</span>
            <span v-else> {{ $t('shortlink.create') }}</span>
          </button>
        </div>

        <div class="links-section">
          <h2 class="section-title"> {{ $t('shortlink.myLinks') }}</h2>
          
          <div class="links-table" v-if="shortLinks.length > 0">
            <div class="table-header">
              <span>{{ $t('shortlink.shortUrl') }}</span>
              <span>{{ $t('shortlink.originalUrl') }}</span>
              <span>{{ $t('shortlink.clicks') }}</span>
              <span>{{ $t('shortlink.created') }}</span>
              <span>{{ $t('shortlink.actions') }}</span>
            </div>
            
            <div v-for="link in shortLinks" :key="link.id" class="table-row">
              <span class="short-url">{{ link.shortUrl }}</span>
              <span class="original-url" :title="link.originalUrl">{{ truncateUrl(link.originalUrl) }}</span>
              <span class="clicks">{{ link.clicks }}</span>
              <span class="created">{{ formatDate(link.createdAt) }}</span>
              <span class="actions">
                <button class="btn-icon" @click="copyLink(link.shortUrl)"></button>
                <button class="btn-icon delete" @click="deleteLink(link.id)"></button>
              </span>
            </div>
          </div>

          <div v-else class="empty-state">
            <p>{{ $t('shortlink.noLinks') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const newUrl = ref('')
const customCode = ref('')
const loading = ref(false)
const shortLinks = ref([])

const createShortLink = async () => {
  if (!newUrl.value) return
  loading.value = true
  try {
    const response = await fetch('/api/shortlink', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: newUrl.value, code: customCode.value || undefined })
    })
    if (!response.ok) throw new Error('Failed')
    const data = await response.json()
    shortLinks.value.unshift({
      id: data.code,
      shortUrl: window.location.origin + '/s/' + data.code,
      originalUrl: newUrl.value,
      clicks: 0,
      createdAt: new Date()
    })
    newUrl.value = ''
    customCode.value = ''
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadShortLinks = async () => {
  try {
    const response = await fetch('/api/shortlink')
    if (response.ok) {
      const data = await response.json()
      shortLinks.value = data.map(item => ({
        id: item.code,
        shortUrl: window.location.origin + '/s/' + item.code,
        originalUrl: item.url,
        clicks: item.clicks || 0,
        createdAt: new Date(item.createdAt)
      }))
    }
  } catch (e) {
    console.error(e)
  }
}

const copyLink = (url) => { navigator.clipboard.writeText(url) }
const deleteLink = async (id) => {
  try {
    await fetch('/api/shortlink/' + id, { method: 'DELETE' })
    shortLinks.value = shortLinks.value.filter(link => link.id !== id)
  } catch (e) { console.error(e) }
}
const truncateUrl = (url) => url.length > 40 ? url.substring(0, 40) + '...' : url
const formatDate = (date) => new Date(date).toLocaleDateString()

onMounted(() => { loadShortLinks() })
</script>

<style scoped>
.shortlink-page { padding-top: 100px; padding-bottom: 4rem; min-height: 100vh; }
.page-header { text-align: center; margin-bottom: 3rem; }
.page-title { font-size: var(--font-size-3xl); margin-bottom: 0.5rem; }
.page-subtitle { color: var(--color-text-secondary); }
.shortlink-content { max-width: 1000px; margin: 0 auto; padding: 2rem; }
.section-title { font-size: 1.25rem; margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.create-section { margin-bottom: 3rem; }
.links-table { overflow-x: auto; }
.table-header, .table-row { display: grid; grid-template-columns: 1fr 2fr 80px 100px 80px; gap: 1rem; padding: 0.75rem; align-items: center; }
.table-header { font-weight: 600; color: var(--color-text-secondary); border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.table-row { border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.table-row:hover { background: rgba(255, 255, 255, 0.05); }
.short-url { color: var(--color-primary); }
.original-url { color: var(--color-text-secondary); font-size: 0.875rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.clicks { text-align: center; }
.actions { display: flex; gap: 0.5rem; }
.btn-icon { background: none; border: none; cursor: pointer; padding: 0.5rem; border-radius: var(--radius-sm); transition: background 0.2s; }
.btn-icon:hover { background: rgba(255, 255, 255, 0.1); }
.btn-icon.delete:hover { background: rgba(255, 0, 110, 0.1); }
.empty-state { text-align: center; padding: 2rem; color: var(--color-text-secondary); }
</style>
