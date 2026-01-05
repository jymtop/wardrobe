// 衣物分类
export type ClothingCategory = 
  | 'top'        // 上衣
  | 'pants'      // 裤子
  | 'skirt'      // 裙子
  | 'dress'      // 连衣裙
  | 'outerwear'  // 外套
  | 'underwear'  // 内衣
  | 'shoes'      // 鞋子
  | 'bag'        // 包包
  | 'accessory'; // 配饰

// 衣柜区域
export type WardrobeArea = 'hanging' | 'shelf' | 'drawer' | 'underwear' | 'shoes';

// 季节
export type Season = 
  | 'spring'  // 春
  | 'summer'  // 夏
  | 'autumn'  // 秋
  | 'winter'  // 冬
  | 'all';    // 四季

// 场所
export type Occasion = 
  | 'work'    // 通勤
  | 'date'    // 约会
  | 'sports'  // 运动
  | 'home'    // 居家
  | 'travel'  // 旅行
  | 'formal'; // 正式场合

// 衣物接口
export interface ClothingItem {
  id: string;
  name: string;
  images: string[];              // base64 图片数组
  category: ClothingCategory;
  area?: WardrobeArea;           // 存放区域
  season: Season[];              // 可多选
  occasion: Occasion[];          // 可多选
  color: string;                 // 主色调 hex
  brand?: string;                // 品牌/来源
  notes?: string;                // 备注
  purchaseDate?: string;         // 购买日期 YYYY-MM-DD
  price?: number;                // 价格
  wearFrequency: 1 | 2 | 3 | 4 | 5;  // 常穿程度
  needsWash: boolean;            // 是否待洗
  isFavorite: boolean;           // 收藏
  createdAt: string;             // ISO 日期字符串
  updatedAt: string;             // ISO 日期字符串
}

// 筛选条件
export interface FilterOptions {
  category?: ClothingCategory;
  season?: Season;
  occasion?: Occasion;
  color?: string;
  keyword?: string;
  needsWash?: boolean;
  isFavorite?: boolean;
}

// 统计数据
export interface StatsData {
  totalCount: number;
  categoryStats: { category: ClothingCategory; count: number; label: string; icon: string }[];
  seasonStats: { season: Season; count: number; label: string; fill: string }[];
  occasionStats: { occasion: Occasion; count: number; label: string; fill: string }[];
  colorStats: { color: string; count: number }[];
  recentTrend: { date: string; count: number }[];
  totalValue: number;
  favoriteCount: number;
  needsWashCount: number;
}

// 衣柜状态
export interface WardrobeState {
  isOpen: boolean;
  activeArea: 'hanging' | 'shelf' | 'drawer' | 'shoes' | null;
  soundEnabled: boolean;
}

// 导出数据格式
export interface ExportData {
  version: string;
  exportDate: string;
  items: ClothingItem[];
}

// 表单数据（用于新增/编辑）
export interface ClothingFormData {
  name: string;
  images: string[];
  category: ClothingCategory;
  area?: WardrobeArea;
  season: Season[];
  occasion: Occasion[];
  color: string;
  brand: string;
  notes: string;
  purchaseDate: string;
  price: string;
  wearFrequency: 1 | 2 | 3 | 4 | 5;
  needsWash: boolean;
  isFavorite: boolean;
}

// Toast 类型
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}
