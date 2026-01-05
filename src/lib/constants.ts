import type { ClothingCategory, Season, Occasion, WardrobeArea } from '../types';

// 衣物分类配置
export const CATEGORY_CONFIG: Record<ClothingCategory, { label: string; icon: string; defaultArea: WardrobeArea }> = {
  top: { label: '上衣', icon: '👚', defaultArea: 'hanging' },
  pants: { label: '裤子', icon: '👖', defaultArea: 'drawer' },
  skirt: { label: '裙子', icon: '👗', defaultArea: 'hanging' },
  dress: { label: '连衣裙', icon: '👗', defaultArea: 'hanging' },
  outerwear: { label: '外套', icon: '🧥', defaultArea: 'hanging' },
  underwear: { label: '内衣', icon: '👙', defaultArea: 'underwear' },
  shoes: { label: '鞋子', icon: '👟', defaultArea: 'shoes' },
  bag: { label: '包包', icon: '👜', defaultArea: 'shelf' },
  accessory: { label: '配饰', icon: '💍', defaultArea: 'drawer' },
};

// 衣柜区域配置
export const AREA_CONFIG: Record<WardrobeArea, { label: string; icon: string }> = {
  hanging: { label: '挂衣区', icon: '👚' },
  shelf: { label: '叠放区', icon: '📦' },
  drawer: { label: '抽屉区', icon: '🗄️' },
  underwear: { label: '内衣区', icon: '👙' },
  shoes: { label: '鞋区', icon: '👟' },
};

export const ALL_AREAS: WardrobeArea[] = ['hanging', 'shelf', 'drawer', 'underwear', 'shoes'];

// 季节配置
export const SEASON_CONFIG: Record<Season, { label: string; icon: string; color: string }> = {
  spring: { label: '春季', icon: '🌸', color: '#FFB7C5' },
  summer: { label: '夏季', icon: '☀️', color: '#FFD700' },
  autumn: { label: '秋季', icon: '🍂', color: '#FF8C00' },
  winter: { label: '冬季', icon: '❄️', color: '#87CEEB' },
  all: { label: '四季', icon: '🌈', color: '#9370DB' },
};

// 场所配置
export const OCCASION_CONFIG: Record<Occasion, { label: string; icon: string; color: string }> = {
  work: { label: '通勤', icon: '💼', color: '#4A90D9' },
  date: { label: '约会', icon: '💕', color: '#FF69B4' },
  sports: { label: '运动', icon: '🏃', color: '#32CD32' },
  home: { label: '居家', icon: '🏠', color: '#DEB887' },
  travel: { label: '旅行', icon: '✈️', color: '#00CED1' },
  formal: { label: '正式场合', icon: '🎩', color: '#2F4F4F' },
};

// 预设颜色
export const PRESET_COLORS = [
  { value: '#FFFFFF', label: '白色' },
  { value: '#000000', label: '黑色' },
  { value: '#808080', label: '灰色' },
  { value: '#F5F5DC', label: '米色' },
  { value: '#FFB6C1', label: '粉色' },
  { value: '#FF0000', label: '红色' },
  { value: '#FF8C00', label: '橙色' },
  { value: '#FFD700', label: '黄色' },
  { value: '#228B22', label: '绿色' },
  { value: '#4169E1', label: '蓝色' },
  { value: '#800080', label: '紫色' },
  { value: '#8B4513', label: '棕色' },
  { value: '#000080', label: '藏青' },
  { value: '#F0E68C', label: '卡其' },
  { value: '#E6E6FA', label: '薰衣草' },
  { value: '#98FB98', label: '薄荷绿' },
];

// 常穿程度描述
export const WEAR_FREQUENCY_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: '很少穿',
  2: '偶尔穿',
  3: '一般',
  4: '经常穿',
  5: '超爱穿',
};

// 数据版本（用于迁移）
export const DATA_VERSION = '1.0.0';

// 所有分类数组
export const ALL_CATEGORIES: ClothingCategory[] = [
  'top', 'pants', 'skirt', 'dress', 'outerwear', 'underwear', 'shoes', 'bag', 'accessory'
];

export const ALL_SEASONS: Season[] = [
  'spring', 'summer', 'autumn', 'winter', 'all'
];

export const ALL_OCCASIONS: Occasion[] = [
  'work', 'date', 'sports', 'home', 'travel', 'formal'
];
