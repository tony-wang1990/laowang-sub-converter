# LaoWang Sub Converter


A self-hosted subscription conversion, merging, health-check and distribution platform for proxy clients. It ships a Vue console, a Node.js API, persistent short links and production Docker images for `linux/amd64` and `linux/arm64`.


[![Docker Build and Publish](https://github.com/tony-wang1990/laowang-sub-converter/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/tony-wang1990/laowang-sub-converter/actions/workflows/docker-publish.yml)
[![GitHub Container Registry](https://img.shields.io/badge/GHCR-latest-2496ED?logo=docker&logoColor=white)](https://github.com/tony-wang1990/laowang-sub-converter/pkgs/container/laowang-sub-converter)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.19-339933?logo=node.js&logoColor=white)](package.json)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)


[中文文档](README.md)


## Demo

![Demo: paste a subscription URL → pick Clash → generate an importable config](docs/images/demo.gif)

> Recorded with a local sample subscription (fake `demo.example.com` nodes). The core flow in about 10 seconds: paste a subscription URL, pick Clash, and generate an importable config.

## Screenshots


### Overview


![LaoWang Sub Converter overview](docs/screenshots/production-home.png)


<details>
<summary>More screenshots</summary>


### Subscription conversion


![Subscription conversion](docs/screenshots/production-converter.png)


### Subscription merging


![Subscription merging](docs/screenshots/production-merge.png)


### Short link management


![Short link management](docs/screenshots/production-shortlink.png)


</details>


## Features


- **Subscription conversion**: paste a subscription URL and get YAML, JSON, CONF or share links.
- **Subscription merging**: pull up to 20 subscriptions in one batch, with exact dedupe, sorting, keyword filtering, renaming and region flags.
- **Client compatibility filtering**: nodes are emitted only in the formats the target client actually supports; if no node is compatible, the API returns a clear error instead of an empty config.
- **Node health check**: test TCP reachability and latency from the server and export the online nodes.
- **Short links**: turn long subscription URLs into fixed short codes, with click counts, listing and deletion.
- **QR code import**: conversion results can be rendered as a subscription QR code; supported share-link formats can also generate QR codes.
- **Rule presets**: basic, standard, developer, gaming and streaming rule templates for YAML clients.
- **Production deployment**: non-root container, read-only filesystem, health check, persistent data directory and multi-arch images.


## Protocols and Clients


### Input protocols


| Type | Supported |
| --- | --- |
| Shadowsocks | SS, simple-obfs plugin |
| ShadowsocksR | SSR |
| V2Ray / Xray | VMess, VLESS, VLESS Reality, Trojan |
