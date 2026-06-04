# 项目规范

## 目录结构

```
road-radar/
├── src/                          # 前端
│   ├── api/                      # Tauri IPC 调用封装
│   ├── components/
│   │   ├── ui/                   # 通用 UI 基础组件（Button, Card, Badge...）
│   │   └── *.tsx                 # 业务组件（RouteCard, ElevationChart...）
│   ├── data/                     # 类型定义 + mock 数据（开发阶段）
│   ├── hooks/                    # 自定义 hooks
│   ├── layouts/                  # 布局组件
│   ├── pages/                    # 页面组件
│   └── utils/                    # 纯函数工具
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs                # Tauri command 注册入口
│   │   ├── main.rs               # 程序入口
│   │   ├── db.rs                 # 数据库初始化 + CRUD
│   │   ├── gpx_parser.rs         # GPX 解析核心逻辑
│   │   ├── error.rs              # 统一错误类型
│   │   └── models.rs             # 共享数据结构（Serialize/Deserialize）
│   ├── fixtures/                 # 测试用 GPX 文件
│   │   ├── valid_flat.gpx        # 平路 GPX
│   │   ├── valid_mountain.gpx    # 山路 GPX
│   │   ├── no_tracks.gpx         # 无轨迹 GPX
│   │   ├── no_elevation.gpx      # 无海拔 GPX
│   │   ├── multi_track.gpx       # 多轨迹 GPX
│   │   ├── minimal.gpx           # 最小有效 GPX
│   │   └── invalid.xml           # 非 GPX 文件
│   ├── migrations/               # SQL migration 文件
│   └── tests/                    # 集成测试
├── docs/
│   └── user-story/               # 用户故事
```

---

## Rust 规范

### 模块职责
- `models.rs` — 纯数据结构，derive Serialize/Deserialize，不包含业务逻辑
- `error.rs` — 统一 AppError 枚举，用 thiserror 派生，实现 `Into<InvokeError>` 给 Tauri
- `gpx_parser.rs` — 纯函数，输入 GPX 字符串/文件路径，输出 ParsedRoute，无副作用
- `db.rs` — 所有 SQLite 操作，函数签名以 `db` 参数开头
- `lib.rs` — 只做 command 注册，不含业务逻辑

### 错误处理
```rust
// error.rs
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("GPX 解析失败: {0}")]
    GpxParse(String),
    #[error("数据库错误: {0}")]
    Database(String),
    #[error("文件读取失败: {0}")]
    Io(#[from] std::io::Error),
}
```

### 命名
- 文件名：`snake_case.rs`
- 函数名：`snake_case`
- 类型名：`PascalCase`
- Tauri command 名：`snake_case`（前端调用时自动映射为 camelCase）
- 测试函数名：`test_描述性名称`

### 测试
- 单元测试放在文件底部 `#[cfg(test)] mod tests { ... }`
- 集成测试放在 `src-tauri/tests/` 目录
- 测试用 `#[test]`，异步测试用 `#[tokio::test]`
- 每个公开函数至少一个测试
- **内联字符串测试**：最小 GPX 片段用字符串字面量，快速验证逻辑
- **真实文件测试**：`fixtures/` 目录存放真实 GPX 文件，覆盖各种边界情况

---

## TypeScript / React 规范

### 文件组织
- 页面组件：`src/pages/xxx.tsx`，一个页面一个文件
- 通用组件：`src/components/ui/Xxx.tsx`，一个组件一个文件
- 业务组件：`src/components/Xxx.tsx`
- API 封装：`src/api/tauri.ts`，所有 Tauri invoke 调用集中在此
- Hooks：`src/hooks/useXxx.ts`
- 类型定义：与使用处就近定义，不单独建 types 目录

### 组件规范
- Props 用 `interface` 定义，不用 `type`（除非是联合类型）
- 不用 `React.FC`，直接函数声明
- 组件内部状态用 `useState`，跨页面状态暂不引入状态管理库
- Tauri IPC 调用只能在 `src/api/tauri.ts` 中，页面不直接 `invoke`

### API 层
```typescript
// src/api/tauri.ts
import { invoke } from "@tauri-apps/api/core";

export interface ParsedRoute { ... }

export async function parseGpx(filePath: string): Promise<ParsedRoute> {
  return invoke<ParsedRoute>("parse_gpx", { filePath });
}
```

### 样式
- 只用 Tailwind CSS，不写 CSS 文件
- 颜色用 Tailwind 内置色板（stone, amber, emerald, red 等）
- 字体通过 `font-display` / `font-mono` utility class 切换

---

## 数据库规范

### Migration 管理
- 使用 `tauri-plugin-sql` 内建 migration 支持
- 在 `lib.rs` 初始化时注册 migration 列表
- 文件命名：`{version}_{description}.sql`（纯记录用途，实际执行通过插件 API）
- 只允许 ADD COLUMN / CREATE TABLE，不允许 DROP / DELETE（桌面应用数据宝贵）

### 表设计
- 主键用 TEXT 类型的 UUID（`uuid` crate 生成）
- 时间字段用 ISO 8601 字符串（`chrono::Utc::now().to_rfc3339()`）
- 布尔字段用 INTEGER（0/1）
- 有默认值的字段在 schema 中显式声明 DEFAULT

---

## Git 规范

### Commit Message
```
<type>(<scope>): <description>
```

Type:
- `feat` — 新功能
- `fix` — 修复
- `refactor` — 重构
- `test` — 测试
- `chore` — 构建/工具链

Scope:
- `backend` — Rust 后端
- `frontend` — React 前端
- `db` — 数据库
- `gpx` — GPX 解析

示例：
```
feat(backend): add GPX parsing with distance and elevation calculation
feat(frontend): wire import flow to parse_gpx command
test(backend): add unit tests for gpx_parser module
refactor(frontend): extract API layer from pages
```

---

## 测试规范

### Rust 后端
- `cargo test` — 运行所有测试
- 纯逻辑函数必须有单元测试
- Tauri command 用集成测试覆盖

### 测试数据策略

**内联字符串（快速逻辑验证）**
- 最小有效 GPX 片段，直接写在测试函数里
- 用于验证解析逻辑的各个分支（空 track、无海拔、单点等）

**fixtures/ 目录（真实文件验证）**
- `fixtures/valid_flat.gpx` — 真实平路骑行记录（带完整 metadata、时间戳）
- `fixtures/valid_mountain.gpx` — 真实山路骑行记录（含连续爬坡）
- `fixtures/no_tracks.gpx` — 只有 waypoints，无 track
- `fixtures/no_elevation.gpx` — track 无 ele 字段
- `fixtures/multi_track.gpx` — 包含多条 track
- `fixtures/minimal.gpx` — 最小可解析 GPX（只有一个 track segment，两个点）
- `fixtures/invalid.xml` — 有效 XML 但不是 GPX 格式

**fixtures 管理原则**
- 文件尽量小（< 10KB），只保留必要的 track points
- 可以从真实 GPX 中截取前 N 个点
- 文件名清晰表达测试场景
- 真实文件测试验证的是端到端：XML → 解析 → 距离/爬升/海拔剖面的正确性

**测试分层**
```rust
// 内联测试：验证逻辑分支
#[test]
fn test_parse_empty_gpx_returns_error() {
    let result = parse_gpx_content("<gpx></gpx>");
    assert!(result.is_err());
}

// 真实文件测试：验证端到端正确性
#[test]
fn test_parse_real_mountain_gpx() {
    let content = include_str!("../fixtures/valid_mountain.gpx");
    let result = parse_gpx_content(content).unwrap();
    assert!(result.elevation_gain > 500.0);
    assert_eq!(result.ride_type, "mountainous");
}
```

### 前端
- `pnpm vitest` — 运行单元测试
- API 层的纯函数（类型映射、数据转换）写测试
- 组件测试后续补充，不阻塞当前开发

### TDD 流程
1. 先写测试（RED）
2. 写最小实现让测试通过（GREEN）
3. 重构（REFACTOR）
4. 每次只做一个小功能点的红绿循环
