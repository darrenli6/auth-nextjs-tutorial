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





🔄 两种不同的会话处理方式

方式 1: OAuth 登录（Google/GitHub）
1. 用户登录 → JWT Token 存储在 Cookie 中
2. auth() 调用 → 解析 JWT Token
3. ❌ 不查询数据库
4. ✅ 直接从 Token 中获取用户信息

方式 2: 邮箱密码登录（Credentials）

1. 用户登录 → 创建 sessionToken（UUID）
2. sessionToken 存储到数据库 Session 表
3. sessionToken 作为 Cookie 返回给浏览器
4. auth() 调用 → ✅ 查询数据库 Session 表
5. 根据 sessionToken 获取完整会话信息


```
jwt: {
  encode: async function (params) {
    if (params.token?.credentials) {
      // 🔑 密码登录：创建数据库会话
      const sessionToken = uuid();
      
      const createdSession = await adapter?.createSession?.({
        sessionToken: sessionToken,
        userId: params.token.sub,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      
      return sessionToken; // 返回会存储到 Cookie 的 sessionToken
    }
    // 🌐 OAuth 登录：使用 JWT（不查数据库）
    return defaultEncode(params);
  },
}
```


方式 1: 密码登录（Credentials）


```
if (params.token?.credentials) {
  // 🎫 给用户一个实体门票（数据库记录）
  const sessionToken = uuid(); // 生成门票号码：abc-123-def
  
  // 📝 在游乐园的登记册上写下这张门票
  await adapter?.createSession?.({
    sessionToken: sessionToken,    // 门票号：abc-123-def
    userId: params.token.sub,      // 谁的门票：用户ID
    expires: new Date(...),        // 门票有效期：30天
  });
  
  return sessionToken; // 🍪 把门票号放到用户的Cookie里
}
```

方式 2: OAuth 登录（Google/GitHub）

```
// 🌐 OAuth 登录：使用 JWT（不查数据库）
return defaultEncode(params); // 🎫 给用户一个加密徽章（不用登记册）
```


1. 用户输入: 邮箱 + 密码
2. 验证成功后运行: if (params.token?.credentials)
3. 生成门票号: "550e8400-e29b-41d4-a716-446655440000"
4. 数据库记录:
   Session 表插入新记录:
   ┌─────────────────────────────────────┬─────────┬──────────────┐
   │ sessionToken                        │ userId  │ expires      │
   ├─────────────────────────────────────┼─────────┼──────────────┤
   │ 550e8400-e29b-41d4-a716-446655440000│ user123 │ 2024-02-15   │
   └─────────────────────────────────────┴─────────┴──────────────┘
5. Cookie存储: "550e8400-e29b-41d4-a716-446655440000"


1. 用户点击: "用 Google 登录"
2. 不运行 if 条件（因为不是 credentials）
3. 直接运行: return defaultEncode(params)
4. 生成 JWT: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTIzIn0..."
5. 不查数据库，不插入 Session 表
6. Cookie存储: JWT 字符串


# 我来详细解释 NextAuth 配置中这四个核心部分的运行逻辑和场景：


🏗️ 1. Adapter（适配器）
作用：数据库操作的桥梁

const adapter = PrismaAdapter(db);

NextAuth ←→ PrismaAdapter ←→ 数据库

运行场景：
✅ 用户登录时：查询/创建用户记录
✅ 创建会话时：插入 Session 表
✅ OAuth 关联时：插入 Account 表
✅ 会话验证时：查询 Session 表


具体操作：

// adapter 会自动执行这些数据库操作：
await adapter.createUser(userData);      // 创建用户
await adapter.createSession(sessionData); // 创建会话
await adapter.getUser(userId);           // 获取用户
await adapter.deleteSession(sessionToken); // 删除会话


🔑 2. Providers（身份提供商）

```
providers: [
  Google,        // OAuth 提供商
  GitHub,        // OAuth 提供商  
  Credentials({  // 自定义凭据提供商
    authorize: async (credentials) => { /* 验证逻辑 */ }
  })
]

```

运行场景和逻辑：

用户点击 "Google 登录" 
→ 重定向到 Google OAuth 页面
→ 用户授权后返回 authorization code
→ NextAuth 用 code 换取 access_token
→ 用 access_token 获取用户信息
→ 自动创建/更新 User 和 Account 记录


