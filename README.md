# LaoWang Sub-converter

<div align="center">

![Logo](https://img.shields.io/badge/LaoWang-Sub--converter-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggZD0iTTEzIDJMMyAxNGgxMGwtMSAxMCAxMC0xMkgxMnoiLz48L3N2Zz4=)

**专业的代理订阅转换服务**

[![GitHub license](https://img.shields.io/github/license/laowang-sub-converter/laowang-sub-converter)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://hub.docker.com)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Ready-orange?logo=cloudflare)](https://cloudflare.com)

[English](./README_EN.md) | 简体中文

</div>

---

## ✨ 功能特性

- 🔄 **多协议支持** - SS、SSR、VMess、VLESS、Trojan、Hysteria、TUIC
- 📱 **多客户端格式** - Clash、Surge、Quantumult X、Shadowrocket、Loon、V2RayN 等 10+ 客户端
- 🔗 **短链接服务** - 生成短链接便于分享，支持访问统计
- 🌍 **多语言界面** - 中文、英文、俄语、波斯语
- 🐳 **多种部署方式** - Docker、Cloudflare、Vercel、Netlify、VPS
- ⚙️ **高级配置** - 节点过滤、重命名、排序、Emoji 添加
- 🎨 **多主题切换** - 8 种精美主题随心切换

---

## 🌐 在线演示

<p>
  <a href="https://laowang-sub-conv.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🔗_点击体验_Demo-laowang--sub--conv.vercel.app-38b2ac?style=for-the-badge" alt="Demo">
  </a>
</p>

<table>
  <tr>
    <td align="center">
      <img src="docs/images/preview_home.png" width="400" alt="首页"><br>
      <b>首页</b>
    </td>
    <td align="center">
      <img src="docs/images/preview_converter.png" width="400" alt="转换器"><br>
      <b>订阅转换</b>
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <img src="docs/images/preview_theme.png" width="600" alt="主题切换"><br>
      <b>多主题支持（星空紫主题示例）</b>
    </td>
  </tr>
</table>

---

## 🚀 快速开始

### Docker Compose (推荐)

```bash
# 克隆仓库
git clone https://github.com/tony-wang1990/laowang-sub-converter.git
cd laowang-sub-converter

# 启动服务
docker-compose up -d

# 访问 http://localhost
```

### Docker

```bash
docker run -d \
  -p 8080:80 \
  --name sub-converter \
  --restart always \
  ghcr.io/tony-wang1990/laowang-sub-converter:main
```

访问 `http://localhost:8080`

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

---

## ☁️ 一键部署

| 平台 | 部署按钮 |
|------|----------|
| **Vercel** | [![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tony-wang1990/laowang-sub-converter) |
| **Netlify** | [![Deploy](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tony-wang1990/laowang-sub-converter) |
| **Cloudflare Pages** | [![Deploy](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/tony-wang1990/laowang-sub-converter) |

> 💡 **多架构支持**：Docker 镜像同时支持 **AMD64** (Intel/AMD 服务器) 和 **ARM64** (树莓派/Oracle ARM 等)。

---

## 📘 Cloudflare Pages 部署教程

如果您想使用 GitHub Actions 自动部署到 Cloudflare Pages，请按以下步骤操作：

### 步骤 1：Fork 本仓库

点击右上角 **Fork** 按钮，将本项目复制到您的账号下。

### 步骤 2：获取 Cloudflare 凭据

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 在首页左侧边栏找到并复制 **Account ID**
3. 点击右上角头像 → **My Profile** → **API Tokens** → **Create Token**
4. 选择 **Cloudflare Pages** 模板（或自定义权限：Account-Cloudflare Pages-Edit）
5. 复制生成的 **API Token**

### 步骤 3：配置 GitHub Secrets

1. 进入您 Fork 的仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**，添加以下两个：

| Name | Value |
|------|-------|
| `CLOUDFLARE_ACCOUNT_ID` | 您的 Account ID |
| `CLOUDFLARE_API_TOKEN` | 您的 API Token |

### 步骤 4：触发部署

1. 进入 **Actions** 标签页
2. 点击左侧 **Deploy to Cloudflare Pages**
3. 点击 **Run workflow** → **Run workflow**
4. 等待部署完成（约 2-3 分钟）

### 步骤 5：访问您的站点

部署完成后，访问 `https://laowang-sub-converter.pages.dev` 或您在 Cloudflare 设置的自定义域名。

---

## 📖 API 文档

### 订阅转换

```
GET /api/convert
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | string | ✅ | 目标客户端 (clash/surge/quantumultx/shadowrocket/loon/v2rayn/singbox) |
| `url` | string | ✅ | 订阅链接 (需 URL 编码) |
| `emoji` | string | | 添加 Emoji (1/0，默认 1) |
| `udp` | string | | 启用 UDP (1/0，默认 1) |
| `scert` | string | | 跳过证书验证 (1/0，默认 0) |
| `sort` | string | | 按名称排序 (1/0，默认 0) |
| `include` | string | | 节点过滤关键词 (用 \| 分隔) |
| `exclude` | string | | 排除节点关键词 (用 \| 分隔) |
| `rename` | string | | 重命名规则 (旧名称->新名称) |

**示例：**
```
/api/convert?target=clash&url=https%3A%2F%2Fexample.com%2Fsub&emoji=1&udp=1
```

### 短链接

**创建短链接：**
```
POST /api/shortlink
Content-Type: application/json

{
  "url": "https://example.com/subscription"
}
```

**响应：**
```json
{
  "shortUrl": "https://your-domain.com/s/abc123",
  "id": "abc123",
  "originalUrl": "https://example.com/subscription",
  "clicks": 0
}
```

---

## 📱 支持的客户端

| 客户端 | 平台 | 格式 |
|--------|------|------|
| Clash | 全平台 | YAML |
| Clash Meta | 全平台 | YAML |
| Surge | iOS/macOS | 配置文件 |
| Quantumult X | iOS | 配置片段 |
| Shadowrocket | iOS | Base64 |
| Loon | iOS | 配置文件 |
| V2RayN | Windows | Base64/JSON |
| V2RayNG | Android | Base64 |
| Surfboard | Android | 配置文件 |
| Stash | iOS/macOS | YAML |
| sing-box | 全平台 | JSON |

---

## 🔧 项目结构

```
laowang-sub-converter/
├── src/                    # 前端源码
│   ├── assets/            # 样式和资源
│   ├── components/        # Vue 组件
│   ├── views/             # 页面视图
│   ├── i18n/              # 多语言文件
│   └── router/            # 路由配置
├── server/                 # 后端 API
│   ├── routes/            # API 路由
│   └── index.js           # 服务入口
├── docker/                 # Docker 配置
├── .github/workflows/      # GitHub Actions
├── Dockerfile             # Docker 镜像
├── docker-compose.yml     # Docker Compose
├── vercel.json            # Vercel 配置
├── netlify.toml           # Netlify 配置
└── wrangler.toml          # Cloudflare 配置
```

---

## 🌍 多语言支持

- 🇨🇳 简体中文
- 🇺🇸 English
- 🇷🇺 Русский
- 🇮🇷 فارسی

---

## 📝 开源协议

[MIT License](LICENSE) © 2024 LaoWang Sub-converter

---

## ⚠️ 免责声明

本项目仅供学习交流使用，请遵守当地法律法规。使用本项目导致的任何问题，开发者不承担任何责任。

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐ Star！**

</div>
