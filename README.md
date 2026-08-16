# 云商城管理后台

基于 Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui（base-ui 风格）构建的商城后台管理系统。

## 功能

- 仪表盘：销售额 / 订单 / 用户统计，recharts 图表
- 商品管理：增删改查、搜索、状态筛选、分页、批量上下架 / 删除
- 订单管理：状态流转、详情查看、搜索、分页、批量发货 / 取消
- 用户管理：角色与状态管理、批量封禁 / 解封
- 分类管理：树形结构增删改
- 系统设置：站名 / 描述 / 搜索词 / 公告 Tab
- 登录认证：JWT 会话（HttpOnly Cookie）+ 路由保护 + 登录后回跳
- 暗色模式：`next-themes` 亮色 / 暗色 / 跟随系统

## 快速开始

```bash
npm install
cp .env.example .env.local   # 配置 SESSION_SECRET
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

- 登录账号：`admin`
- 登录密码：`admin123`

## 常用命令

```bash
npm run dev        # 开发服务器
npm run build      # 构建
npm start          # 启动生产服务器
npm run lint       # 代码检查
```

## 目录结构

- `src/app/(admin)` — 后台页面（路由组）
- `src/app/login` — 登录页
- `src/lib` — 会话与 JWT 工具
- `src/components/admin` — 后台组件（Header、图表、分页条）
- `src/components/ui` — shadcn/ui 组件