# 🍿️ DualSubs: 🔣 Universal

## 本地构建

### 1) 拉取（包含 submodule）

```bash
git clone --recurse-submodules <repo-url>
cd DualSubs-Universal-Source
```

如果你已经克隆完成但 submodule 目录是空的：

```bash
npm run submodule:init
```

### 2) 安装依赖并构建

```bash
npm ci
npm run build
```

### 备注：GitHub Packages（可选）

仓库默认使用 npmjs 安装 `@nsnanocat/*` 依赖，避免本地未配置 token 时出现 `401 Unauthorized`。
如果你希望改用 GitHub Packages，请在本机 `~/.npmrc` 配置 scope registry 与 `NODE_AUTH_TOKEN`。
