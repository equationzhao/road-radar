# 技术选型

## 约束条件

- **平台**：桌面端
- **使用模式**：纯本地工具，无需服务器
- **技术栈偏好**：TypeScript 全栈
- **优先级**：功能丰富、体验精致

---

## 1. 桌面框架：Tauri vs Electron

| 维度 | Tauri 2.x | Electron |
|------|-----------|----------|
| 包体积 | ~3-8 MB | ~150+ MB |
| 内存占用 | ~30-80 MB | ~150-300 MB |
| 后端语言 | Rust (高性能) | Node.js |
| 前端渲染 | 系统原生 WebView | 内置 Chromium |
| 跨平台一致性 | 需测试不同 WebView | 完全一致 (自带 Chromium) |
| 生态成熟度 | 快速成长中 | 非常成熟 |
| 插件生态 | Tauri 插件 + Rust crate | npm 生态 |
| 数据库支持 | 内置 SQLite 插件 | 需 better-sqlite3 |

**推荐：Tauri 2.x**

理由：
- 纯本地工具，轻量和性能是核心体验——3MB 启动 vs 150MB
- Tauri 2.0 已稳定，移动端支持也有了（未来可扩展到 iOS/Android）
- 内置 SQLite 支持，数据持久化开箱即用
- Rust 后端适合做 GPX 解析、地理计算等 CPU 密集型任务

风险：
- macOS 用 WKWebView，Windows 用 WebView2，极端 CSS/JS 场景有差异——本项目以地图和图表为主，影响可控

---

## 2. 前端框架：React vs Vue vs Svelte

| 维度 | React | Vue 3 | Svelte 5 |
|------|-------|-------|----------|
| 生态规模 | 最大 | 大 | 较小但增长快 |
| 地图库支持 | react-map-gl, deck.gl | vue-maplibre | 原生集成好 |
| 图表库 | Recharts, Visx, Nivo | 原生 ECharts 集成 | LayerCake |
| 学习曲线 | 中 | 低 | 低 |
| Tauri 适配 | 优秀 | 优秀 | 优秀 |
| 动画生态 | Framer Motion | Vue Transition + Motion | 内置动画极强 |

**推荐：React + TypeScript**

理由：
- 地图和数据可视化生态最丰富（react-map-gl、deck.gl、visx、nivo）
- 组件库选择多（shadcn/ui、Radix）
- Tauri 官方模板默认支持
- 与 shadcn/ui 组合可以快速搭建精致的 UI

---

## 3. 地图方案

| 方案 | 说明 | 许可 |
|------|------|------|
| **MapLibre GL JS** | Mapbox GL 的开源分支，矢量瓦片，3D 地形 | BSD-3 |
| Mapbox GL JS | 商业方案，效果最好，需 API key | 商业 |
| Leaflet | 经典轻量，栅格瓦片为主 | BSD-2 |
| deck.gl | 大数据量可视化，WebGL 渲染 | MIT |

**推荐：MapLibre GL JS**

理由：
- 开源免费，无需 API key，本地工具不应有外部服务依赖
- 矢量瓦片渲染，路线绘制效果好
- 支持 3D 地形（可展示海拔）
- 搭配免费瓦片源（OpenFreeMap / MapTiler 免费额度）
- 本地工具可缓存瓦片实现离线使用

路线绘制 + 海拔剖面联动用 MapLibre + 自定义 React 组件即可。

---

## 4. 图表方案

| 方案 | 说明 |
|------|------|
| **Nivo** | React 优先，声明式，内置动画，支持 SVG/Canvas |
| Recharts | React 生态最流行，简单易用 |
| Visx | Airbnb 出品，底层 D3 + React，灵活度最高 |
| ECharts | 功能最全，但体积大，React 集成一般 |

**推荐：Nivo**

理由：
- React 原生，TypeScript 类型完善
- 内置动画和主题系统，适合"精致体验"的需求
- 海拔剖面图、坡度分布图、统计图表全覆盖
- 支持 Canvas 模式，大数据量下性能好

海拔剖面图的交互（悬停联动地图）需要自定义实现，Nivo 提供 Responsive 组件 + 自定义图层支持。

---

## 5. 数据库：SQLite

**推荐：SQLite（通过 Tauri 内置插件）**

理由：
- 纯本地工具的天然选择，无需安装数据库服务器
- Tauri 2 内置 `@tauri-apps/plugin-sql`，开箱即用
- 单文件存储，方便备份/迁移
- 路书量级（几千条）下性能绰绰有余
- 支持全文搜索（FTS5 扩展）

### 数据模型概览

```
routes          — 路书主表（名称、距离、爬升、难度、坐标等）
route_points    — 轨迹点（经纬度、海拔、时间，外键关联 route）
climbs          — 爬坡区段（坡度、距离、分类）
tags            — 标签表
route_tags      — 路书-标签关联（多对多）
ride_entries    — 骑行记录（每次骑行一条）
ride_media      — 骑行媒体（照片/视频）
collections     — 收藏集
route_collections — 路书-收藏集关联
user_settings   — 用户设置（JSON 存储）
```

### 媒体文件存储

- 照片/视频不存数据库，存在文件系统（Tauri app data 目录）
- 数据库只存文件路径引用
- 自动生成缩略图，单独存储

---

## 6. UI 组件库

**推荐：shadcn/ui + Tailwind CSS**

理由：
- 复制粘贴式组件，完全可控，无外部依赖包袱
- 设计语言现代、简洁
- 与 Tailwind CSS 深度集成
- 支持暗色模式

---

## 7. GPX 解析与地理计算

| 功能 | 推荐方案 |
|------|----------|
| GPX 解析 | Rust 侧：`gpx` crate（性能好） 或 TS 侧：`@tmcw/togeojson` |
| 反向地理编码 | `photon` (开源) 离线数据库 或 Nominatim API（需联网） |
| 路线自动规划 | OSRM 本地实例 / GraphHopper（可选，US-10 用） |
| 海拔数据修正 | NASA SRTM DEM 数据，本地缓存 |
| 爬坡检测 | 自定义算法（滑动窗口 + 阈值），Rust 实现 |

**GPX 解析推荐在 Rust 侧完成**，理由：
- 大文件解析性能关键
- Rust 的 `gpx` crate 成熟
- 解析结果直接写入 SQLite，一次完成

---

## 8. 构建工具与开发体验

| 工具 | 用途 |
|------|------|
| Vite | 前端构建（Tauri 官方推荐） |
| pnpm | 包管理 |
| Biome | Lint + Format（替代 ESLint + Prettier，更快） |
| vitest | 单元测试 |
| Playwright | E2E 测试 |

---

## 推荐技术栈总览

```
桌面框架：  Tauri 2.x (Rust)
前端框架：  React 19 + TypeScript
UI 组件：   shadcn/ui + Tailwind CSS 4
地图：      MapLibre GL JS
图表：      Nivo
数据库：    SQLite (Tauri 内置插件)
GPX 解析：  Rust gpx crate
构建工具：  Vite 6
包管理：    pnpm
Lint/格式： Biome
测试：      vitest + Playwright
```

### 架构分层

```
┌─────────────────────────────────────┐
│          React Frontend             │
│  ┌──────┐ ┌──────┐ ┌──────────┐   │
│  │ Map  │ │Charts│ │ UI (shadcn)│  │
│  └──┬───┘ └──┬───┘ └────┬─────┘   │
│     └────────┼──────────┘          │
│              │ Tauri IPC           │
├──────────────┼─────────────────────┤
│       Tauri Rust Backend           │
│  ┌──────┐ ┌──────┐ ┌──────────┐   │
│  │ GPX  │ │ Geo  │ │ Media    │   │
│  │Parser│ │ Calc │ │ Process  │   │
│  └──┬───┘ └──┬───┘ └────┬─────┘   │
│     └────────┼──────────┘          │
│              │                     │
│         ┌────┴────┐               │
│         │ SQLite  │               │
│         └─────────┘               │
└─────────────────────────────────────┘
```
