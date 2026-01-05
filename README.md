# 她的衣柜 - 电子衣柜管理应用

一个温柔治愈的电子衣柜管理网页应用，像打开真实衣柜一样管理衣物。

## ✨ 功能特性

### 核心功能
- **衣物管理**：新增/编辑/删除衣物，支持多图上传
- **分类体系**：衣物分类、季节、场所多维度分类
- **筛选搜索**：组合筛选 + 关键词搜索
- **统计图表**：分类统计、季节分布、颜色分析、趋势图表
- **数据备份**：JSON 导入/导出，数据不丢失

### 特色体验
- 🚪 **真实衣柜体验**：3D 开门动画，区域化布局
- 👚 **挂衣区**：上衣、裙子、外套悬挂展示
- 📦 **叠放区**：包包整齐摆放
- 🗄️ **抽屉区**：裤子、配饰收纳
- 👟 **鞋区**：鞋子陈列展示

### UI/UX
- 💕 治愈系配色（樱花粉主题）
- 📱 响应式设计（手机优先）
- ✨ 流畅动效（Framer Motion）
- 🔔 操作反馈（Toast 提示）

## 🛠️ 技术栈

| 类型 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 |
| 样式 | TailwindCSS 3 |
| 动画 | Framer Motion |
| 图表 | Recharts |
| 存储 | IndexedDB (Dexie.js) |
| PWA | Vite PWA Plugin |

## 🚀 快速开始

### 安装依赖

```bash
cd wardrobe-app
npm install
```

### 开发模式

```bash
npm run dev
```

打开 http://localhost:5173 即可预览。

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录。

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
wardrobe-app/
├── public/                 # 静态资源
│   ├── wardrobe-icon.svg  # 应用图标
│   └── ...
├── src/
│   ├── components/
│   │   ├── wardrobe/      # 衣柜组件
│   │   │   ├── WardrobeDoor.tsx      # 衣柜门
│   │   │   ├── WardrobeInterior.tsx  # 衣柜内部
│   │   │   ├── HangingArea.tsx       # 挂衣区
│   │   │   ├── ShelfArea.tsx         # 叠放区
│   │   │   ├── DrawerArea.tsx        # 抽屉区
│   │   │   ├── ShoesArea.tsx         # 鞋区
│   │   │   └── ClothingCard.tsx      # 衣物卡片
│   │   ├── clothing/      # 衣物管理
│   │   │   ├── ClothingForm.tsx      # 表单
│   │   │   ├── ClothingDetail.tsx    # 详情
│   │   │   └── ImageUploader.tsx     # 图片上传
│   │   ├── filter/        # 筛选组件
│   │   │   ├── FilterPanel.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── stats/         # 统计组件
│   │   │   └── StatsPanel.tsx
│   │   └── ui/            # 通用组件
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       └── EmptyState.tsx
│   ├── hooks/             # 自定义 Hooks
│   │   ├── useWardrobe.ts
│   │   ├── useClothing.ts
│   │   └── useFilter.ts
│   ├── lib/               # 工具库
│   │   ├── db.ts          # IndexedDB 操作
│   │   ├── storage.ts     # 导入导出
│   │   └── constants.ts   # 常量配置
│   ├── types/             # TypeScript 类型
│   │   └── index.ts
│   ├── data/              # 示例数据
│   │   └── sampleData.ts
│   ├── App.tsx            # 主应用
│   ├── main.tsx           # 入口
│   └── index.css          # 全局样式
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 📊 数据模型

```typescript
interface ClothingItem {
  id: string;
  name: string;
  images: string[];              // base64 图片
  category: ClothingCategory;    // 上衣/裤子/裙子/外套/鞋子/包包/配饰
  season: Season[];              // 春/夏/秋/冬/四季
  occasion: Occasion[];          // 通勤/约会/运动/居家/旅行/正式
  color: string;                 // 主色调
  brand?: string;                // 品牌
  notes?: string;                // 备注
  purchaseDate?: string;         // 购买日期
  price?: number;                // 价格
  wearFrequency: 1 | 2 | 3 | 4 | 5;  // 常穿程度
  needsWash: boolean;            // 待洗
  isFavorite: boolean;           // 收藏
  createdAt: string;
  updatedAt: string;
}
```

## 💾 数据存储

### 本地存储
- 使用 IndexedDB 存储所有衣物数据
- 自动保存，防抖 500ms 避免频繁写入
- 首次使用自动加载示例数据

### 备份恢复
- **导出**：生成带时间戳的 JSON 文件
- **导入**：选择 JSON 文件覆盖导入
- 建议定期备份，避免清除浏览器缓存导致数据丢失

## 📱 PWA 支持

应用支持 PWA，可以：
1. 添加到手机主屏幕
2. 像原生 App 一样运行
3. 支持离线访问（需先在线加载一次）

### 添加到主屏幕
- **iOS Safari**：点击分享 → 添加到主屏幕
- **Android Chrome**：菜单 → 添加到主屏幕
- **鸿蒙浏览器**：菜单 → 添加到桌面

## 🎨 自定义

### 修改主题色
编辑 `tailwind.config.js` 中的 `colors` 配置：

```javascript
colors: {
  primary: '#E8B4B8',      // 主色调
  secondary: '#A28089',    // 次要色
  accent: '#EED6D3',       // 强调色
  background: '#FDF6F0',   // 背景色
  wood: '#C9A66B',         // 木质色
}
```

### 添加新分类
编辑 `src/lib/constants.ts`，在 `CATEGORY_CONFIG` 中添加新分类。

## 🔮 可选增强功能

以下功能可按需扩展：

- [ ] **搭配推荐**：基于颜色/风格推荐搭配
- [ ] **穿搭日历**：记录每日穿搭
- [ ] **待洗提醒**：定时提醒清洗衣物
- [ ] **收藏夹**：快速访问常穿衣物
- [ ] **多用户**：支持多个衣柜账户
- [ ] **云同步**：可选的云端备份

## 📄 许可证

MIT License

---

💕 送给最爱的她
