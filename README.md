# IVHMS 视力健康管理平台 · 校端原型

面向学校的视力健康管理平台「校端」高保真原型，用于演示与评审。

- **纯静态**：HTML + 内联 CSS/JS，无构建、无框架、无后端
- **零依赖运行**：双击 HTML 文件即可打开，数据为内存 mock，刷新即重置
- **当前版本**：v2.2

## 快速开始

直接用浏览器打开任意页面即可，无需启动服务。

> 若需通过 HTTP 访问（避免部分浏览器的 `file://` 限制），可在项目根目录起一个静态服务器，例如：
>
> ```bash
> python -m http.server 8000
> # 然后访问 http://localhost:8000/login.html
> ```

## 页面清单

| 页面 | 文件 | 说明 |
|------|------|------|
| 登录 | `login.html` | 手机号 + 验证码登录 |
| 数据概览 | `index.html` | 首页总览，含个人中心 / 管理后台 / 消息（hash 路由 `#profile` `#admin` `#messages`） |
| 统计分析 | `statistics.html` | 视力健康多维度统计与图表 |
| 健康档案 | `health-records.html` | 学生视力档案列表、新建、导入导出 |
| 任务管理 | `task-management.html` | 视力评估 / 视力训练任务，列表 + 新建编辑 |
| 设备状态 | `device-status.html` | 终端 / 训练设备状态与在线率 |
| 视力评估 | `vision-assessment.html` | 视力评估相关流程（废弃） |
| 授权导入 | `license-import.html` | 授权 / License 导入（废弃） |

## 目录结构

```
ivhms-saas/
├── index.html              数据概览（含 hash 路由）
├── statistics.html         统计分析
├── health-records.html     健康档案（设计系统基准页）
├── task-management.html    任务管理
├── device-status.html      设备状态
├── vision-assessment.html  视力评估（废弃）
├── license-import.html     授权导入（废弃）
├── login.html              登录
├── js/
│   ├── chart.umd.min.js    图表库（Chart.js）
│   ├── msg-badge.js        未读消息徽标全站同步
│   └── sidebar-toggle.js   侧边栏移动端抽屉（≤1024px）
└── REVIEW-2026-10-24.md    代码审查与修复清单
```

## 设计系统

设计基准页为 **`health-records.html`**。新增页面请从它复制以下内容，保持风格一致：

- `:root` 中的 CSS 变量（配色、圆角、阴影、字体）
- 侧边栏、用户/消息浮动面板
- toast 消息、表格、分页、自定义下拉
- 确认弹窗、按钮样式

**配色要点**：主色 `#18E299`（青绿），文字 `#0d0d0d`，浅灰背景 `#f5f5f5`，错误红 `#d45656`。

## 约定与注意事项

- **数据**：所有数据变更只改内存数组，不写 `localStorage`（`js/msg-badge.js` 用 `sessionStorage` 做未读同步是唯一例外）。
- **跨页跳转**：统一用 `index.html#xxx` 的 hash 路由（`#profile` `#admin` `#messages`）。
- **移动端**：宽度 ≤1024px 时侧边栏收起为抽屉，左上角汉堡按钮呼出。
- **XSS 防护**：任务名 / 人员名等用户输入在拼接 `innerHTML` 时须用 `escHtml()` 转义；CSV 导出须用 `esc()` 转义并中和公式注入前缀。

## 已知遗留问题

详见 `REVIEW-2026-10-24.md`，主要包括：

1. `login.html` 中约 300 行忘记/重置密码代码被整段注释，未启用，恢复前勿删。
2. `statistics.html` / `device-status.html` 含 `console.log` 调试输出，上线前应移除。
3. 退出登录仅跳转 `login.html`，无状态清理（接入真实认证后需补）。
4. 任务导出与档案导出文件名命名不一致，待统一。
5. XSS 防护仅覆盖已知拼接点，接入真实后端数据时建议整体改为安全渲染。
