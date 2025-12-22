<template>
  <div class="about-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">
          <span class="text-gradient">{{ $t('about.title') }}</span>
        </h1>
        <p class="page-subtitle">{{ $t('about.description') }}</p>
      </div>

      <!-- Features -->
      <section class="about-section">
        <h2>{{ $t('about.features') }}</h2>
        <div class="features-grid">
          <div class="feature-item glass-card">
            <span class="icon"></span>
            <span>{{ $t('about.featureList.protocols') }}</span>
          </div>
          <div class="feature-item glass-card">
            <span class="icon"></span>
            <span>{{ $t('about.featureList.clients') }}</span>
          </div>
          <div class="feature-item glass-card">
            <span class="icon"></span>
            <span>{{ $t('about.featureList.deploy') }}</span>
          </div>
          <div class="feature-item glass-card">
            <span class="icon"></span>
            <span>{{ $t('about.featureList.i18n') }}</span>
          </div>
        </div>
      </section>

      <!-- Deploy -->
      <section class="about-section">
        <h2>{{ $t('about.deploy') }}</h2>
        
        <!-- Recommended Deployment -->
        <div class="deploy-category">
          <h3 class="category-title recommended">
            <span> {{ $t('about.deployRecommended') }}</span>
          </h3>
          <p class="category-desc">{{ $t('about.deployRecommendedDesc') }}</p>
          
          <div class="deploy-options">
            <div class="deploy-card glass-card">
              <div class="deploy-header">
                <span class="deploy-icon"></span>
                <h3>Docker Compose</h3>
              </div>
              <p>VPS / Linux</p>
              <pre class="code-block"><code>docker-compose up -d</code></pre>
            </div>

            <div class="deploy-card glass-card">
              <div class="deploy-header">
                <span class="deploy-icon"></span>
                <h3>Zeabur</h3>
              </div>
              <p>国内友好，一键部署容器</p>
              <a href="https://zeabur.com/new" target="_blank" class="btn btn-secondary"> 一键部署</a>
            </div>

            <div class="deploy-card glass-card">
              <div class="deploy-header">
                <span class="deploy-icon"></span>
                <h3>Railway</h3>
              </div>
              <p>免费额度，自动部署</p>
              <a href="https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Ftony-wang1990%2Flaowang-sub-converter" target="_blank" class="btn btn-secondary"> 一键部署</a>
            </div>

            <div class="deploy-card glass-card">
              <div class="deploy-header">
                <span class="deploy-icon"></span>
                <h3>Render</h3>
              </div>
              <p>免费托管，自动 SSL</p>
              <a href="https://render.com/deploy?repo=https://github.com/tony-wang1990/laowang-sub-converter" target="_blank" class="btn btn-secondary"> 一键部署</a>
            </div>

            <div class="deploy-card glass-card">
              <div class="deploy-header">
                <span class="deploy-icon"></span>
                <h3>Fly.io</h3>
              </div>
              <p>全球边缘容器</p>
              <pre class="code-block"><code>fly launch</code></pre>
            </div>

             <div class="deploy-card glass-card">
              <div class="deploy-header">
                <span class="deploy-icon"></span>
                <h3>Koyeb</h3>
              </div>
              <p>高性能全球部署</p>
              <a href="https://app.koyeb.com/deploy?type=git&repository=tony-wang1990/laowang-sub-converter" target="_blank" class="btn btn-secondary"> 一键部署</a>
            </div>
          </div>
        </div>

        <!-- Limited Deployment -->
        <div class="deploy-category mt-8">
          <h3 class="category-title limited">
             <span> {{ $t('about.deployLimited') }}</span>
          </h3>
          <p class="category-desc warning">{{ $t('about.deployLimitedDesc') }}</p>

          <div class="deploy-options">
            <div class="deploy-card glass-card">
              <div class="deploy-header">
                <span class="deploy-icon"></span>
                <h3>Vercel</h3>
              </div>
              <p>GitHub 导入即部署</p>
              <a href="https://vercel.com/new/clone?repository-url=https://github.com/tony-wang1990/laowang-sub-converter" target="_blank" class="btn btn-secondary"> 一键部署</a>
            </div>

            <div class="deploy-card glass-card">
              <div class="deploy-header">
                <span class="deploy-icon"></span>
                <h3>Netlify</h3>
              </div>
              <p>免费静态托管</p>
              <a href="https://app.netlify.com/start/deploy?repository=https://github.com/tony-wang1990/laowang-sub-converter" target="_blank" class="btn btn-secondary"> 一键部署</a>
            </div>

            <div class="deploy-card glass-card">
              <div class="deploy-header">
                <span class="deploy-icon"></span>
                <h3>Cloudflare Pages</h3>
              </div>
              <p>免费静态托管，全球 CDN</p>
              <a href="https://deploy.workers.cloudflare.com/?url=https://github.com/tony-wang1990/laowang-sub-converter" target="_blank" class="btn btn-secondary"> 一键部署</a>
            </div>
          </div>
        </section>

      <!-- API Docs -->
      <section class="about-section">
        <h2>API 文档</h2>
        <div class="api-docs glass-card">
          <h3>订阅转换 API</h3>
          <pre class="code-block"><code>GET /api/convert?target={client}&url={subscription_url}

参数说明：
- target: 目标客户端 (clash/surge/quantumultx/shadowrocket/loon/v2rayn)
- url: 订阅链接 (需 URL 编码)
- emoji: 是否添加 Emoji (1/0)
- udp: 是否启用 UDP (1/0)
- sort: 是否排序 (1/0)
- include: 节点过滤关键词
- rename: 重命名规则</code></pre>

          <h3>短链接 API</h3>
          <pre class="code-block"><code>POST /api/shortlink
Content-Type: application/json

{
  "url": "https://example.com/subscription"
}

返回：
{
  "shortUrl": "https://lw.to/abc123",
  "id": "abc123"
}</code></pre>
        </div>
      </section>

      <!-- GitHub -->
      <section class="about-section">
        <h2>{{ $t('about.github') }}</h2>
        <div class="github-card glass-card">
          <a 
            href="https://github.com/tony-wang1990/laowang-sub-converter" 
            target="_blank"
            class="github-link"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <div>
              <h3>laowang-sub-converter</h3>
              <p>Star  如果这个项目对你有帮助</p>
            </div>
          </a>
        </div>
      </section>

      <!-- License -->
      <section class="about-section">
        <h2>{{ $t('about.license') }}</h2>
        <div class="license-card glass-card">
          <p>MIT License  2024 LaoWang Sub-converter</p>
          <p class="muted">本项目仅供学习交流使用，请遵守当地法律法规。</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  padding-top: 100px;
  padding-bottom: 4rem;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 4rem;
}

.page-title {
  font-size: var(--font-size-3xl);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--color-text-secondary);
}

.about-section {
  max-width: 900px;
  margin: 0 auto 3rem;
}

.about-section h2 {
  font-size: var(--font-size-xl);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.feature-item .icon {
  font-size: 2rem;
}

.deploy-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.deploy-card {
  padding: 1.5rem;
}

.deploy-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.deploy-icon {
  font-size: 2rem;
}

.deploy-card h3 {
  font-size: var(--font-size-lg);
}

.deploy-card p {
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  font-size: var(--font-size-sm);
}

.code-block {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.code-block code {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--color-accent-cyan);
  white-space: pre;
}

.api-docs {
  padding: 2rem;
}

.api-docs h3 {
  font-size: var(--font-size-base);
  color: var(--color-accent-cyan);
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.api-docs h3:first-child {
  margin-top: 0;
}

.github-card {
  padding: 2rem;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: var(--color-text-primary);
  text-decoration: none;
}

.github-link h3 {
  font-size: var(--font-size-lg);
  margin-bottom: 0.25rem;
}

.github-link p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.license-card {
  padding: 2rem;
  text-align: center;
}

.license-card .muted {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin-top: 0.5rem;
}

/* Category Styles */
.category-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
}
.category-title.recommended span {
  color: #4ade80; 
}
.category-title.limited span {
  color: #facc15;
}

.category-desc {
  margin-bottom: 1.5rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.category-desc.warning {
  color: #fca5a5;
  font-weight: 500;
}

.mt-8 {
  margin-top: 3rem;
}

.deploy-category {
    margin-bottom: 2rem;
}

/* Button override for link matching original styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  font-size: 0.875rem;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}
</style>
