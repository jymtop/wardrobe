# 部署到 GitHub Pages 教程

按以下步骤操作，5分钟内你就能拥有一个随时可访问的衣柜网址！

---

## 第一步：创建 GitHub 仓库

1. 打开 https://github.com 并登录（没有账号就注册一个）
2. 点击右上角 **+** → **New repository**
3. 填写信息：
   - **Repository name**: `wardrobe`（或其他你喜欢的名字）
   - **Public**: 选择公开（免费用户必须公开才能用 Pages）
4. 点击 **Create repository**

---

## 第二步：上传代码

### 方法一：使用命令行（推荐）

在 WSL 终端中执行：

```bash
cd /home/jym/wardrobe-app

# 初始化 Git
git init
git add .
git commit -m "初始化衣柜应用"

# 连接到你的 GitHub 仓库（把 YOUR_USERNAME 换成你的用户名）
git remote add origin https://github.com/YOUR_USERNAME/wardrobe.git
git branch -M main
git push -u origin main
```

### 方法二：直接上传文件

1. 在 GitHub 仓库页面点击 **uploading an existing file**
2. 把 `wardrobe-app` 文件夹里的所有文件拖进去
3. 点击 **Commit changes**

---

## 第三步：开启 GitHub Pages

1. 在仓库页面点击 **Settings**（设置）
2. 左侧菜单找到 **Pages**
3. 在 **Build and deployment** 下：
   - **Source**: 选择 **GitHub Actions**
4. 点击 **Configure** 或创建一个 workflow 文件

### 创建自动部署配置

在仓库中创建文件 `.github/workflows/deploy.yml`，内容如下：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 第四步：等待部署完成

1. 点击仓库的 **Actions** 标签
2. 等待绿色 ✓ 出现（约1-2分钟）
3. 部署成功后访问：`https://YOUR_USERNAME.github.io/wardrobe/`

---

## 使用方式

### 电脑访问
直接打开浏览器访问你的网址

### 手机访问
1. 用手机浏览器打开网址
2. 点击浏览器菜单 → **添加到主屏幕**
3. 之后就像 App 一样从桌面图标打开

---

## 常见问题

### Q: 页面显示 404？
A: 检查 `vite.config.ts` 中的 `base` 配置是否和仓库名一致

### Q: 数据会丢失吗？
A: 数据存在浏览器本地（IndexedDB），只要不清除浏览器数据就不会丢失。建议定期在"统计"页面导出备份。

### Q: 换手机/换浏览器数据还在吗？
A: 不在。数据存在每个浏览器本地。可以用导出/导入功能迁移数据。

### Q: 别人能看到我的衣物数据吗？
A: 不能！数据只存在你自己的浏览器里，网站只是个空壳。

---

## 快速链接

- GitHub Pages 文档: https://docs.github.com/cn/pages
- 如果遇到问题，可以搜索 "GitHub Pages 部署 Vite"

---

💕 部署完成后，把网址发给她吧！
