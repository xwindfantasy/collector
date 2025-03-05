# Collector

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Collector 是一个个人网站收藏管理系统，帮助您高效管理和分类喜爱的网站。

## 功能特性

- 📁 网站分类管理
- 🔍 快速搜索
- 🌐 多语言支持 (英文/中文)
- 🎨 主题切换
- 📱 响应式设计

## 技术栈

- **前端框架**: [Svelte](https://svelte.dev) v5 + [SvelteKit](https://kit.svelte.dev) v2
- **构建工具**: [Vite](https://vitejs.dev) v6
- **UI库**: [DaisyUI](https://daisyui.com) v4 + [TailwindCSS](https://tailwindcss.com) v3
- **图标库**: [Iconify](https://iconify.design)
- **搜索**: [Fuse.js](https://fusejs.io)
- **国际化**: [Paraglide](https://inlang.com)
- **代码质量**: ESLint + Prettier

## 开发环境准备

1. 确认已安装 [Node.js](https://nodejs.org) (≥18.x)
2. 安装 pnpm:
```bash
npm install -g pnpm
```
3. 克隆项目:
```bash
git clone https://github.com/your-username/collector.git
```
4. 安装依赖:
```bash
pnpm install 
```
5. 启动开发服务器:
```bash
pnpm run dev
```

## 项目结构

```
collector/
├── src/               # 源代码
│   ├── lib/           # 共享工具和组件
│   ├── routes/        # 页面路由
│   └── app.css        # 全局样式
├── static/            # 静态资源
├── messages/          # 国际化文件
├── package.json       # 项目依赖
├── vite.config.js     # Vite 配置
└── tailwind.config.js # Tailwind 配置
```

## 构建与部署

生产环境构建：
```bash
pnpm run build
```

本地预览：
```bash
pnpm run preview
```

## 贡献指南

我们欢迎各种形式的贡献！请先阅读 [贡献指南](CONTRIBUTING.md)。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。