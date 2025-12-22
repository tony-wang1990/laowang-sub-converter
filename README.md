# LaoWang Sub-converter

<div align="center">

![Logo](https://img.shields.io/badge/LaoWang-Sub--converter-blue?style=for-the-badge)
![License](https://img.shields.io/github/license/tony-wang1990/laowang-sub-converter?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge)

**强大的订阅转换工具 - 支持多种协议和客户端**

[English](./README_EN.md) | 简体中文

</div>

---

## 界面预览

<div align="center">

<a href="https://laowang-sub-conv.vercel.app/">
  <img src="https://img.shields.io/badge/%E7%82%B9%E5%87%BB%E4%BD%93%E9%AA%8C-laowang--sub--conv.vercel.app-38b2ac?style=for-the-badge" alt="Demo">
</a>

<br><br>

| 首页 | 转换器 |
|:---:|:---:|
| ![首页](./docs/screenshots/home.png) | ![转换器](./docs/screenshots/converter.png) |

</div>

---

## 功能特性

- **多协议支持** - SS、SSR、VMess、VLESS（含 Reality）、Trojan、Hysteria、Hysteria2、TUIC
- **多客户端支持** - Clash、Surge、Quantumult X、Shadowrocket、Loon、V2RayN、V2RayNG、NekoBox、sing-box 等
- **短链接服务** - 生成短链接便于分享，支持访问统计
- **多主题切换** - 8 种精美主题随心切换
- **多语言支持** - 简体中文、繁体中文、English
- **多种部署方式** - Docker、Cloudflare、Vercel、Netlify
- **备用 API** - 支持多个后端 API 自动切换

---

## 一键部署

| 平台 | 部署按钮 |
|------|----------|
| **Vercel** | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tony-wang1990/laowang-sub-converter) |
| **Netlify** | [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tony-wang1990/laowang-sub-converter) |

---

## 本地部署

```bash
git clone https://github.com/tony-wang1990/laowang-sub-converter.git
cd laowang-sub-converter
npm install
npm run dev
```

### Docker 部署

```bash
docker run -d -p 3000:3000 --name sub-converter ghcr.io/tony-wang1990/laowang-sub-converter:latest
```

---

## 支持功能一览

| 类型 | 项目 | 平台/说明 | 状态 |
|:---|:---|:---|:---:|
| **协议** | Shadowsocks (SS) | 标准支持 | ✓ |
| | ShadowsocksR (SSR) | 标准支持 | ✓ |
| | VMess | 标准支持 | ✓ |
| | VLESS | 标准支持 | ✓ |
| | VLESS + Reality | Vision/Reality | ✓ |
| | Trojan | 标准支持 | ✓ |
| | Hysteria | v1 | ✓ |
| | Hysteria2 | v2 | ✓ |
| | TUIC | v5 | ✓ |
| **客户端** | Clash | 全平台 | ✓ |
| | Clash Meta | 全平台 | ✓ |
| | Surge | iOS/macOS | ✓ |
| | Quantumult X | iOS | ✓ |
| | Shadowrocket | iOS | ✓ |
| | Loon | iOS | ✓ |
| | V2RayN | Windows | ✓ |
| | V2RayNG | Android | ✓ |
| | NekoBox | Android | ✓ |
| | Surfboard | Android | ✓ |
| | Stash | iOS/macOS | ✓ |
| | sing-box | 全平台 | ✓ |

---

## 备用 API

当主服务不可用时，系统会自动切换到备用 API：

- 本地服务
- api.v1.mk
- sub.xeton.dev
- api.dler.io

---

## 技术栈

- **前端**: Vue 3 + Vite
- **后端**: Node.js + Express
- **样式**: CSS Variables + Glassmorphism
- **部署**: Docker, Vercel, Netlify, Cloudflare

---

## 开源协议

MIT License
