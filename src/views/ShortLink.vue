<template>
  <main class="page">
    <section class="page-shell stack">
      <header class="hero-surface short-hero">
        <div>
          <p class="section-label">SHORTLINK REGISTRY</p>
          <h1 class="title-xl">把长订阅地址压缩成固定短码</h1>
          <p class="subtitle">
            为转换后的长链接创建可分享、可统计、可删除的短链接，适合 NAS、移动客户端和团队内部分发。
          </p>
        </div>
        <LinkIcon :size="34" />
      </header>

      <section class="panel control-panel">
        <div class="form-grid">
          <label class="field wide">
            <span>原始地址</span>
            <input class="input mono" v-model="newUrl" placeholder="https://example.com/api/convert?target=..." />
          </label>
          <label class="field">
            <span>自定义短码</span>
            <input class="input mono" v-model="customCode" placeholder="my-profile" />
          </label>
          <label class="field">
            <span>管理口令（仅当服务器设置了 ADMIN_TOKEN 时需要）</span>
            <input class="input mono" v-model="adminToken" type="password" placeholder="留空表示未设置" autocomplete="off" />
          </label>
        </div>

        <div class="actions">
          <button class="btn btn-primary" type="button" @click="createShortLink" :disabled="!newUrl.trim() || loading">
            <Loader2 v-if="loading" :size="18" class="spin" />
            <Plus v-else :size="18" />
            <span>{{ loading ? '创建中' : '创建短链接' }}</span>
          </button>
          <button class="btn btn-secondary" type="button" @click="loadShortLinks">
            <RefreshCw :size="18" />
            <span>刷新列表</span>
          </button>
        </div>

        <p v-if="error" class="alert alert-error">{{ error }}</p>
        <p v-if="success" class="alert alert-success">{{ success }}</p>
      </section>

      <section class="panel result-panel">
        <div class="list-header">
          <div>
            <p class="section-label">LINKS</p>
            <h2>{{ shortLinks.length }} 个短链接</h2>
          </div>
          <span class="mono">/s/:code</span>
        </div>

        <div v-if="shortLinks.length" class="link-list">
          <article v-for="link in shortLinks" :key="link.id" class="link-row">
            <div class="link-main">
              <strong>{{ link.shortUrl }}</strong>
              <span :title="link.originalUrl">{{ link.originalUrl }}</span>
            </div>
            <div class="link-meta">
              <span>{{ link.clicks }} 次访问</span>
              <span>{{ formatDate(link.createdAt) }}</span>
            </div>
            <div class="row-actions">
              <button title="复制" type="button" @click="copyLink(link.shortUrl)">
                <Copy :size="17" />
              </button>
              <button title="删除" type="button" @click="deleteLink(link.id)">
                <Trash2 :size="17" />
              </button>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <LinkIcon :size="30" />
          <p>还没有创建短链接。</p>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Copy, Link as LinkIcon, Loader2, Plus, RefreshCw, Trash2 } from 'lucide-vue-next'
import { apiErrorMessage } from '../utils/apiError.js'
import { copyText } from '../utils/clipboard.js'

const newUrl = ref('')
const customCode = ref('')
const adminToken = ref(sessionStorage.getItem('laowang-admin-token') || '')
const loading = ref(false)
const shortLinks = ref([])
const error = ref('')
const success = ref('')

// The admin token is kept only in sessionStorage (cleared when the tab
// closes) and sent as the X-Admin-Token header. It is never persisted to
// the server or written into any file.
const adminHeaders = () => {
  const token = adminToken.value.trim()
  if (token) sessionStorage.setItem('laowang-admin-token', token)
  return token ? { 'X-Admin-Token': token } : {}
}

const createShortLink = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const response = await fetch('/api/shortlink', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
      body: JSON.stringify({ url: newUrl.value.trim(), code: customCode.value.trim() || undefined })
    })
    const data = await response.json()
    if (!response.ok || data.error) throw new Error(apiErrorMessage(data, `创建失败（HTTP ${response.status}）`))
    shortLinks.value = [normalizeLink(data), ...shortLinks.value.filter(link => link.id !== data.id)]
    newUrl.value = ''
    customCode.value = ''
    success.value = '短链接已创建。'
  } catch (err) {
    error.value = apiErrorMessage(err, '创建失败')
  } finally {
    loading.value = false
  }
}

const loadShortLinks = async () => {
  error.value = ''
  try {
    const response = await fetch('/api/shortlink/list', { headers: { ...adminHeaders() } })
    const data = await response.json()
    if (!response.ok || data.error) throw new Error(apiErrorMessage(data, `加载失败（HTTP ${response.status}）`))
    shortLinks.value = (data.links || []).map(normalizeLink)
  } catch (err) {
    error.value = apiErrorMessage(err, '加载失败')
  }
}

const copyLink = async (url) => {
  error.value = ''
  try {
    await copyText(url)
    success.value = '已复制到剪贴板。'
  } catch {
    error.value = '复制失败，请手动复制链接。'
  }
}

const deleteLink = async (id) => {
  if (!confirm('确定删除这个短链接吗？')) return
  error.value = ''
  try {
    const response = await fetch(`/api/shortlink/${id}`, { method: 'DELETE', headers: { ...adminHeaders() } })
    const data = await response.json()
    if (!response.ok || data.error) throw new Error(apiErrorMessage(data, `删除失败（HTTP ${response.status}）`))
    shortLinks.value = shortLinks.value.filter(link => link.id !== id)
    success.value = '短链接已删除。'
  } catch (err) {
    error.value = apiErrorMessage(err, '删除失败')
  }
}

const normalizeLink = item => ({
  id: item.id,
  shortUrl: item.shortUrl,
  originalUrl: item.originalUrl,
  clicks: item.clicks || 0,
  createdAt: item.createdAt || item.created || new Date().toISOString()
})

const formatDate = date => date ? new Date(date).toLocaleDateString('zh-CN') : '-'

onMounted(loadShortLinks)
</script>

<style scoped>
.short-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.short-hero > svg {
  flex: 0 0 auto;
  color: var(--accent);
}

.control-panel,
.result-panel {
  display: grid;
  gap: 15px;
}

.form-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 250px;
  gap: 12px;
}

.actions,
.row-actions,
.list-header,
.link-row,
.link-meta {
  display: flex;
  gap: 10px;
}

.actions,
.list-header,
.link-row {
  align-items: center;
}

.list-header,
.link-row {
  justify-content: space-between;
}

.list-header h2 {
  margin: 0;
  color: var(--text);
}

.list-header > span {
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 900;
}

.link-list {
  display: grid;
  gap: 10px;
}

.link-row {
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.035);
}

.link-main {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.link-main strong,
.link-main span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-main strong {
  color: var(--text);
}

.link-main span,
.link-meta,
.empty-state {
  color: var(--text-muted);
}

.link-meta {
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-end;
  font-family: var(--mono);
  font-size: 0.78rem;
}

.row-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  color: var(--text-soft);
  background: rgba(255, 255, 255, 0.045);
  cursor: pointer;
}

.row-actions button:hover {
  border-color: var(--line-strong);
  color: var(--accent);
}

.empty-state {
  display: grid;
  place-items: center;
  gap: 10px;
  min-height: 180px;
}

.empty-state svg {
  color: var(--accent);
}

@media (max-width: 820px) {
  .form-grid,
  .link-row,
  .short-hero {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .link-meta {
    align-items: flex-start;
  }
}
</style>
