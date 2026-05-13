# House Trend Go 后端服务

## 1. 服务定位

本目录是 House Trend 项目的 Go 后端服务骨架，目标是为后续真实房屋成交数据、利率数据采集、清洗、存储、聚合查询和接口安全能力提供基础工程结构。

当前阶段后端不直接替换前端 Mock 数据，而是先完成一个可启动、可测试、可联调、可扩展的 API 服务：

- 提供健康检查接口，便于本地和部署环境确认服务存活。
- 提供市场摘要占位接口，为后续成交均价、成交套数、成交面积、成交金额等聚合查询预留 API 形态。
- 提供利率快照占位接口，为后续商业贷款利率、公积金贷款利率、首付比例、SHIBOR 等指标预留 API 形态。
- 提供 Request ID、结构化日志、panic recover、CORS、基础限流等后端横切能力。
- 预留数据采集接口抽象，后续可接入网上房地产、上海银行间同业拆放利率、上海公积金官网等数据源。

## 2. 宏观设计结构

```text
backend/
├── cmd/api/                  # 服务入口：加载配置、组装依赖、启动 HTTP Server
├── internal/config/          # 环境变量配置、默认值、日志级别
├── internal/httpserver/      # 路由注册、HTTP Server 创建、统一 JSON 响应
├── internal/middleware/      # RequestID、日志、Recover、CORS、基础限流
├── internal/handler/         # HTTP Handler：健康检查、市场摘要、利率快照
├── internal/service/         # 业务服务层：市场聚合、利率服务占位
├── internal/model/           # 领域模型：筛选条件、指标摘要、利率、健康状态
└── internal/collector/       # 未来采集器接口抽象
```

### 2.1 分层职责

- `cmd/api`：服务启动入口，只负责组装配置、日志、服务、Handler 和 HTTP Server，不承载业务逻辑。
- `internal/config`：集中读取环境变量，并为本地开发提供安全默认值。
- `internal/httpserver`：集中注册路由，统一 API JSON 响应结构，避免 Handler 分散处理协议细节。
- `internal/middleware`：处理请求链路中的通用能力，包括请求 ID、日志、异常恢复、跨域和限流。
- `internal/handler`：负责 HTTP 参数读取、调用 service、组织响应。
- `internal/service`：承载业务逻辑。当前返回确定性的占位数据，后续会替换为 MySQL 聚合查询结果。
- `internal/model`：定义 API 与业务层共享的领域对象。
- `internal/collector`：定义未来采集器接口，便于扩展不同外部数据源。

## 3. 环境要求

- Go 1.22 或更高版本。
- 当前实现仅使用 Go 标准库，无额外第三方依赖。

检查 Go 版本：

```bash
go version
```

## 4. 如何启动本服务

### 4.1 本地开发启动

在项目根目录执行：

```bash
cd backend
go run ./cmd/api
```

默认监听地址：

```text
http://localhost:8080
```

启动成功后，终端会输出类似日志：

```json
{"level":"INFO","msg":"house trend backend started","addr":":8080"}
```

### 4.2 指定端口启动

如需避免端口冲突，可以通过环境变量指定端口：

```bash
cd backend
HOUSE_TREND_API_PORT=18080 go run ./cmd/api
```

此时服务地址为：

```text
http://localhost:18080
```

### 4.3 构建可执行文件

建议将构建产物输出到临时目录或专门的构建目录，避免污染源码目录：

```bash
cd backend
go build -o /tmp/house-trend-api ./cmd/api
/tmp/house-trend-api
```

## 5. 配置项说明

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `HOUSE_TREND_API_PORT` | `8080` | 后端 HTTP 服务端口。 |
| `HOUSE_TREND_ENV` | `development` | 运行环境，生产环境可设置为 `production`。 |
| `HOUSE_TREND_ALLOWED_ORIGINS` | `http://localhost:3000` | 允许跨域访问后端的前端 Origin，多个值使用英文逗号分隔。 |
| `HOUSE_TREND_READ_HEADER_TIMEOUT` | `5s` | HTTP 请求头读取超时时间。 |
| `HOUSE_TREND_SHUTDOWN_TIMEOUT` | `10s` | 优雅退出超时时间。 |
| `HOUSE_TREND_RATE_LIMIT_WINDOW` | `1m` | 基础限流统计窗口。 |
| `HOUSE_TREND_RATE_LIMIT_REQUESTS` | `120` | 单个客户端在一个窗口内允许的最大请求数。 |

示例：

```bash
cd backend
HOUSE_TREND_API_PORT=18080 \
HOUSE_TREND_ENV=development \
HOUSE_TREND_ALLOWED_ORIGINS=http://localhost:3000 \
HOUSE_TREND_RATE_LIMIT_REQUESTS=300 \
go run ./cmd/api
```

## 6. 当前 API 列表

当前 API 使用统一响应结构：

```json
{
  "data": {}
}
```

错误响应结构：

```json
{
  "error": {
    "code": "error_code",
    "message": "error message"
  }
}
```

### 6.1 健康检查

```http
GET /healthz
```

本地验证：

```bash
curl -sS http://localhost:8080/healthz
```

示例响应：

```json
{
  "data": {
    "status": "ok",
    "service": "house-trend-backend",
    "environment": "development",
    "checkedAt": "2026-05-11T17:48:55Z"
  }
}
```

### 6.2 市场摘要接口

```http
GET /api/v1/market/summary
```

支持查询参数：

| 参数 | 示例 | 说明 |
| --- | --- | --- |
| `city` | `上海` | 城市，默认上海。 |
| `district` | `浦东新区` | 区域，默认全市。 |
| `houseType` | `二手房` | 房屋类型，默认二手房。 |
| `range` | `90d` | 时间范围，默认 90d。 |

本地验证：

```bash
curl -sS "http://localhost:8080/api/v1/market/summary?city=上海&district=浦东新区&houseType=二手房&range=90d"
```

示例响应：

```json
{
  "data": {
    "filter": {
      "city": "上海",
      "district": "浦东新区",
      "houseType": "二手房",
      "range": "90d"
    },
    "averagePrice": 64200,
    "transactionCount": 1180,
    "transactionArea": 107380,
    "transactionAmount": 68.94,
    "generatedAt": "2026-05-11T17:48:55Z",
    "dataFreshnessLabel": "mock-backend-skeleton"
  }
}
```

### 6.3 最新利率快照接口

```http
GET /api/v1/rates/latest
```

支持查询参数：

| 参数 | 示例 | 说明 |
| --- | --- | --- |
| `city` | `上海` | 城市，默认上海。 |

本地验证：

```bash
curl -sS "http://localhost:8080/api/v1/rates/latest?city=上海"
```

示例响应：

```json
{
  "data": {
    "city": "上海",
    "commercialLoanRate": 3.45,
    "fundLoanRate": 2.85,
    "downPaymentRatio": 0.3,
    "shiborReference": 1.72,
    "updatedAt": "2026-05-11T17:48:55Z"
  }
}
```

## 7. 前端页面如何访问后端

当前前端页面仍然由 `lib/mockData.ts` 驱动，尚未正式切换到后端 API。联调阶段建议先采用“前端保持 Mock、局部接口验证”的方式，确认 Go 服务可用后，再逐步引入 BFF/API 访问层。

### 7.1 本地双服务启动

终端 A：启动 Go 后端。

```bash
cd backend
HOUSE_TREND_API_PORT=8080 go run ./cmd/api
```

终端 B：启动 Next.js 前端。

```bash
npm run dev
```

前端页面地址：

```text
http://localhost:3000
```

后端接口地址：

```text
http://localhost:8080
```

默认 CORS 允许 `http://localhost:3000` 访问后端，因此浏览器端可以直接请求后端 API。

### 7.2 浏览器控制台快速验证

打开 `http://localhost:3000` 后，在浏览器 DevTools Console 中执行：

```js
fetch("http://localhost:8080/healthz")
  .then((res) => res.json())
  .then(console.log);
```

验证市场摘要：

```js
fetch("http://localhost:8080/api/v1/market/summary?city=上海&district=浦东新区&houseType=二手房&range=90d")
  .then((res) => res.json())
  .then(console.log);
```

验证利率快照：

```js
fetch("http://localhost:8080/api/v1/rates/latest?city=上海")
  .then((res) => res.json())
  .then(console.log);
```

### 7.3 后续前端正式接入建议

正式接入时建议新增前端 API Client 或 Next.js BFF 层，不建议在多个页面中直接散落 `fetch("http://localhost:8080/...")`：

```text
Next.js 页面 / 组件
  ↓
前端 API Client 或 Next.js Route Handler(BFF)
  ↓
Go 后端 API
  ↓
MySQL / 缓存 / 外部采集数据
```

建议使用环境变量区分本地与部署环境：

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

如果通过 Next.js BFF 转发，则前端页面只访问同源接口，例如：

```text
/api/backend/market/summary
/api/backend/rates/latest
```

BFF 再请求 Go 后端。这样可以减少浏览器直接暴露后端地址，也便于后续添加接口签名、缓存和统一错误处理。

## 8. 联调指导

### 8.1 推荐联调顺序

1. 启动 Go 后端并访问 `/healthz`，确认服务存活。
2. 使用 curl 验证 `/api/v1/market/summary` 和 `/api/v1/rates/latest` 返回结构正确。
3. 启动 Next.js 前端，确认 `http://localhost:3000` 正常渲染。
4. 在浏览器 Console 中从前端页面 Origin 请求 Go 后端，确认 CORS 配置正确。
5. 再开始开发前端 API Client 或 BFF 层，将页面局部数据源从 Mock 切到后端接口。

### 8.2 常见问题

#### 端口被占用

现象：启动时报端口已被占用。

处理方式：更换端口启动。

```bash
cd backend
HOUSE_TREND_API_PORT=18080 go run ./cmd/api
```

#### 浏览器跨域失败

现象：浏览器 Console 出现 CORS 相关错误。

处理方式：确认 `HOUSE_TREND_ALLOWED_ORIGINS` 包含当前前端页面 Origin。

```bash
cd backend
HOUSE_TREND_ALLOWED_ORIGINS=http://localhost:3000 go run ./cmd/api
```

如前端端口不是 3000，例如 `http://localhost:3001`，则需要改为：

```bash
cd backend
HOUSE_TREND_ALLOWED_ORIGINS=http://localhost:3001 go run ./cmd/api
```

#### 触发限流

现象：接口返回 HTTP 429，错误码为 `rate_limited`。

处理方式：本地调试可临时调大限制。

```bash
cd backend
HOUSE_TREND_RATE_LIMIT_REQUESTS=1000 go run ./cmd/api
```

#### 前端页面数据没有变化

当前前端仍使用 Mock 数据，直接启动后端不会自动改变页面展示。需要后续新增前端 API Client 或 BFF 层，并将页面数据读取逻辑从 `lib/mockData.ts` 逐步迁移到后端接口。

## 9. 测试与质量校验

运行 Go 单元测试：

```bash
cd backend
go test ./...
```

构建后端服务：

```bash
cd backend
go build -o /tmp/house-trend-api ./cmd/api
```

前端仍在项目根目录执行原有校验：

```bash
npm run lint
npm run build
```

## 10. 当前限制

- 市场摘要与利率接口当前返回占位数据，还没有连接 MySQL。
- 数据采集器目前只有接口抽象，尚未实现具体外部站点采集逻辑。
- 限流当前为单进程内存实现，适合本地开发和服务骨架阶段；生产环境应迁移到 Redis 或托管 KV。
- 当前还没有接口签名、内部 API Key、Origin/Referer 强校验等完整安全方案。
- 当前前端尚未正式从后端读取数据，页面仍由 Mock 数据驱动。

## 11. 后端未来演进路线

### 阶段一：数据模型与数据库落地

- 设计 MySQL 表结构与 migration。
- 建立 `city`、`district`、`house_transaction_daily`、`interest_rate_daily`、`data_source_sync_log` 等核心表。
- 增加 repository 层，隔离 service 与数据库访问细节。

### 阶段二：真实数据采集与清洗

- 实现网上房地产成交数据采集器。
- 实现 SHIBOR 数据采集器。
- 实现上海公积金官网相关利率数据采集器。
- 增加采集日志、失败重试、数据去重、字段标准化和异常告警。

### 阶段三：聚合查询 API 完善

- 将市场摘要接口从占位数据切换为 MySQL 聚合查询。
- 增加趋势图接口，例如价格趋势、成交量趋势、成交面积趋势。
- 增加区域排行接口和成交日历接口。
- 增加利率趋势接口。
- 对高频聚合查询增加缓存。

### 阶段四：前端 BFF 联调迁移

- 在 Next.js 中新增 BFF API 层或统一 API Client。
- 将首页、成交数据、趋势报告、楼市利率页面逐步从 Mock 数据迁移为接口返回。
- 建立统一错误处理、loading 状态、空状态和降级策略。

### 阶段五：接口安全与访问控制

- 使用 Redis 或托管 KV 实现分布式 IP 限流。
- 增加 Origin / Referer allowlist。
- 为 BFF 到 Go 后端的请求增加内部 API Key 或 HMAC 签名。
- 限制公开接口只返回页面需要的聚合数据，避免暴露原始明细和批量抓取能力。

### 阶段六：部署与运维

- 明确 Go 后端部署平台，例如 Render、Fly.io、Railway、云服务器或容器平台。
- 配置生产环境变量、健康检查和日志采集。
- 增加 CI 流程，自动运行 `go test ./...`、`go build`、`npm run lint`、`npm run build`。
- 为采集任务增加定时调度和异常监控。
