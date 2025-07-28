# NextJS 15 Authentication Tutorial
Simple implementation of Auth.js with Prisma in Next.js 15

## Requirements
- Node.js 22+

## Quick Start

1. **Clone the repository**
```bash
# For tutorial
git clone -b starter https://github.com/codegenixdev/auth-nextjs-tutorial.git

# For complete code
git clone https://github.com/codegenixdev/auth-nextjs-tutorial.git
```

2. **Setup environment for complete code**
```bash
cp .env.sample .env
# Update .env with your values
```

3. **Install & Run**
```bash
npm install
npm run db:migrate
npm run dev
```

## Branches
- `starter`: Initial setup
- `master`: Complete implementation

## Tech Stack
- Next.js 15
- Node.js 22
- TypeScript
- Prisma
- Auth.js

---
Happy coding! 🚀



npx auth secret

https://www.prisma.io/docs


crud

https://www.prisma.io/docs/orm/prisma-client/queries/crud

1. 首先生成 Prisma 客户端

npx prisma generate

2. 创建并初始化数据库

# 创建数据库迁移
npx prisma migrate dev --name init



# 将 Prisma 数据库配置从 SQLite 改为 MySQL。

1. 修改 Prisma Schema 配置

```
// ... existing code ...
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
// ... existing code ...
```

2. 安装 MySQL 依赖

npm install mysql2
# 或者使用 pnpm
pnpm add mysql2


3. 配置环境变量

.env 

# MySQL 数据库连接
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# 示例配置
DATABASE_URL="mysql://root:your_password@localhost:3306/auth_nextjs"


4. 重置数据库迁移


# 删除现有迁移文件（如果存在）
rm -rf prisma/migrations

# 重新生成 Prisma 客户端
npx prisma generate

# 创建新的数据库和迁移
npx prisma migrate dev --name init



```
Error: P3014

Prisma Migrate could not create the shadow database. Please make sure the database user has permission to create databases. Read more about the shadow database (and workarounds) at https://pris.ly/d/migrate-shadow

Original error: Error code: P1010

User was denied access on the database `prisma_migrate_shadow_db_1631ace2-614d-4ade-bc0c-5420a12540c3`

```


您想在现有数据库中创建表，而不需要 Prisma 创建新的数据库。这个错误是因为 Prisma Migrate 试图创建影子数据库（shadow database）来验证迁移。

# 直接推送 schema 到现有数据库，不创建迁移文件
npx prisma db push