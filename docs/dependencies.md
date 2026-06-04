# 依赖文档

## 项目概述

Road Radar — GPX 路书管理桌面工具

技术栈：Tauri 2 (Rust) + React 19 + TypeScript

---

## 前端依赖 (package.json)

### 核心运行时

| 包名 | 版本 | 用途 |
|------|------|------|
| `react` | ^19.1.0 | UI 框架 |
| `react-dom` | ^19.1.0 | React DOM 渲染 |
| `@tauri-apps/api` | ^2 | Tauri 前端 API（IPC 通信、窗口管理等） |

### 地图

| 包名 | 版本 | 用途 |
|------|------|------|
| `maplibre-gl` | ^5.24.0 | 开源矢量地图渲染引擎，绘制路线、标记点、交互式地图 |

### 图表 (Nivo)

| 包名 | 版本 | 用途 |
|------|------|------|
| `@nivo/core` | ^0.99.0 | Nivo 核心库（主题、响应式容器） |
| `@nivo/line` | ^0.99.0 | 折线图 — 海拔剖面图 |
| `@nivo/bar` | ^0.99.0 | 柱状图 — 坡度分布、骑行统计 |
| `@nivo/pie` | ^0.99.0 | 饼图 — 路书类型分布、标签占比 |

### UI 工具

| 包名 | 版本 | 用途 |
|------|------|------|
| `class-variance-authority` | ^0.7.1 | 组件变体管理（shadcn/ui 依赖） |
| `clsx` | ^2.1.1 | 条件 className 拼接 |
| `tailwind-merge` | ^3.6.0 | 合并 Tailwind CSS 类名，解决冲突 |
| `lucide-react` | ^1.17.0 | 图标库（SVG 图标组件） |

### Tauri 插件（前端侧）

| 包名 | 版本 | 用途 |
|------|------|------|
| `@tauri-apps/plugin-opener` | ^2 | 打开外部链接/文件 |
| `@tauri-apps/plugin-sql` | ^2.4.0 | 前端调用 SQLite 数据库 |
| `@tauri-apps/plugin-dialog` | ^2.7.1 | 系统对话框（文件选择、确认框） |
| `@tauri-apps/plugin-fs` | ^2.5.1 | 文件系统读写（媒体文件存储） |

### 开发依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `typescript` | ~5.8.3 | TypeScript 编译器 |
| `vite` | ^7.0.0 | 前端构建工具（HMR、打包） |
| `@vitejs/plugin-react` | ^4.6.0 | Vite 的 React 插件（JSX 转换、Fast Refresh） |
| `tailwindcss` | ^4.3.0 | 原子化 CSS 框架 |
| `@tailwindcss/vite` | ^4.3.0 | Tailwind CSS 的 Vite 插件（v4 方式） |
| `@tauri-apps/cli` | ^2 | Tauri CLI（dev/build 项目） |
| `@biomejs/biome` | ^2.4.16 | Lint + Format（替代 ESLint + Prettier） |
| `@types/react` | ^19.1.8 | React 类型定义 |
| `@types/react-dom` | ^19.1.6 | React DOM 类型定义 |
| `@types/node` | ^25.9.1 | Node.js 类型定义 |

---

## Rust 后端依赖 (Cargo.toml)

### Tauri 框架

| crate | 版本 | 用途 |
|-------|------|------|
| `tauri` | 2 | Tauri 核心框架 |
| `tauri-build` | 2 | 构建时依赖（生成资源、图标处理） |
| `tauri-plugin-opener` | 2 | 打开外部链接/文件插件 |
| `tauri-plugin-sql` | 2 (sqlite) | SQLite 数据库插件 |
| `tauri-plugin-dialog` | 2 | 系统对话框插件 |
| `tauri-plugin-fs` | 2 | 文件系统操作插件 |

### 数据序列化

| crate | 版本 | 用途 |
|-------|------|------|
| `serde` | 1 (derive) | Rust 序列化/反序列化框架 |
| `serde_json` | 1 | JSON 处理 |

### GPX 与地理

| crate | 版本 | 用途 |
|-------|------|------|
| `gpx` | 0.9 | GPX 文件解析（读取轨迹、航点、元数据） |
| `geo` | 0.29 | 地理空间计算（距离、面积、几何操作） |
| `quick-xml` | 0.37 | 快速 XML 解析（GPX 底层依赖） |

### 时间与错误处理

| crate | 版本 | 用途 |
|-------|------|------|
| `chrono` | 0.4 (serde) | 日期时间处理（骑行日期、时间戳解析） |
| `thiserror` | 2 | 错误类型派生宏 |
| `tokio` | 1 (full) | 异步运行时（文件 I/O、数据库操作） |

---

## 开发环境要求

| 工具 | 最低版本 | 说明 |
|------|----------|------|
| Rust | 1.77+ | Tauri 2 要求 |
| Node.js | 20+ | 前端构建 |
| pnpm | 9+ | 包管理器 |

### macOS 额外要求
- Xcode Command Line Tools
- 已通过 `rustup` 安装 Rust 工具链

---

## 常用命令

```bash
# 安装前端依赖
pnpm install

# 开发模式（启动前端 + Tauri 窗口）
pnpm tauri dev

# 构建生产版本
pnpm tauri build

# 仅前端开发（浏览器，无 Tauri API）
pnpm dev

# Lint & Format
pnpm biome check --write .

# Rust 侧检查
cd src-tauri && cargo check
```
