import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ClothingItem, ClothingFormData } from '../../types';
import type { WardrobeArea } from '../../types';
import { 
  CATEGORY_CONFIG, 
  SEASON_CONFIG, 
  OCCASION_CONFIG, 
  PRESET_COLORS,
  ALL_CATEGORIES,
  ALL_SEASONS,
  ALL_OCCASIONS,
  ALL_AREAS,
  AREA_CONFIG,
  WEAR_FREQUENCY_LABELS
} from '../../lib/constants';
import Button from '../ui/Button';
import ImageUploader from './ImageUploader';

interface ClothingFormProps {
  initialData?: ClothingItem;
  onSubmit: (data: ClothingFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const defaultFormData: ClothingFormData = {
  name: '',
  images: [],
  category: 'top',
  area: undefined,
  season: ['all'],
  occasion: ['home'],
  color: '#FFFFFF',
  brand: '',
  notes: '',
  purchaseDate: '',
  price: '',
  wearFrequency: 3,
  needsWash: false,
  isFavorite: false,
};

export default function ClothingForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isEdit = false 
}: ClothingFormProps) {
  const [formData, setFormData] = useState<ClothingFormData>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 初始化表单数据
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        images: initialData.images,
        category: initialData.category,
        area: initialData.area,
        season: initialData.season,
        occasion: initialData.occasion,
        color: initialData.color,
        brand: initialData.brand || '',
        notes: initialData.notes || '',
        purchaseDate: initialData.purchaseDate || '',
        price: initialData.price?.toString() || '',
        wearFrequency: initialData.wearFrequency,
        needsWash: initialData.needsWash,
        isFavorite: initialData.isFavorite,
      });
    }
  }, [initialData]);

  // 获取当前分类的默认区域
  const getDefaultArea = (category: typeof formData.category): WardrobeArea => {
    return CATEGORY_CONFIG[category].defaultArea;
  };

  // 更新字段
  const updateField = <K extends keyof ClothingFormData>(
    key: K, 
    value: ClothingFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // 清除错误
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // 切换多选项
  const toggleArrayItem = <T extends string>(
    key: 'season' | 'occasion',
    item: T
  ) => {
    const currentArray = formData[key] as T[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    // 至少保留一个选项
    if (newArray.length > 0) {
      updateField(key, newArray as ClothingFormData[typeof key]);
    }
  };

  // 验证表单
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入衣物名称';
    }
    
    if (formData.season.length === 0) {
      newErrors.season = '请至少选择一个季节';
    }
    
    if (formData.occasion.length === 0) {
      newErrors.occasion = '请至少选择一个场所';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 图片上传 */}
      <ImageUploader
        images={formData.images}
        onChange={(images) => updateField('images', images)}
      />

      {/* 基本信息 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 名称 */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="例如：白色蕾丝衬衫"
            className={`w-full px-4 py-2 rounded-xl border ${
              errors.name ? 'border-red-500' : 'border-gray-200'
            } focus:border-primary transition-colors`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* 分类 */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            衣物分类 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  updateField('category', cat);
                  // 自动设置默认区域
                  if (!formData.area) {
                    updateField('area', getDefaultArea(cat));
                  }
                }}
                className={`p-2 rounded-lg text-center text-sm transition-colors ${
                  formData.category === cat
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg block">{CATEGORY_CONFIG[cat].icon}</span>
                <span className="text-xs">{CATEGORY_CONFIG[cat].label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 存放区域 */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            存放区域 <span className="text-gray-400 text-xs">（可自定义）</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_AREAS.map((area) => (
              <motion.button
                key={area}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateField('area', area)}
                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${
                  (formData.area || getDefaultArea(formData.category)) === area
                    ? 'bg-wood text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{AREA_CONFIG[area].icon}</span>
                <span>{AREA_CONFIG[area].label}</span>
              </motion.button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            默认根据分类自动选择，也可以手动调整
          </p>
        </div>

        {/* 颜色 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            主色调
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <motion.button
                key={c.value}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateField('color', c.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  formData.color === c.value
                    ? 'border-primary scale-110 shadow-md'
                    : 'border-gray-200'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
            <input
              type="color"
              value={formData.color}
              onChange={(e) => updateField('color', e.target.value)}
              className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-200"
              title="自定义颜色"
            />
          </div>
        </div>
      </div>

      {/* 季节选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          适合季节 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_SEASONS.map((s) => (
            <motion.button
              key={s}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleArrayItem('season', s)}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors ${
                formData.season.includes(s)
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: formData.season.includes(s) 
                  ? SEASON_CONFIG[s].color 
                  : undefined
              }}
            >
              <span>{SEASON_CONFIG[s].icon}</span>
              <span>{SEASON_CONFIG[s].label}</span>
            </motion.button>
          ))}
        </div>
        {errors.season && (
          <p className="text-red-500 text-xs mt-1">{errors.season}</p>
        )}
      </div>

      {/* 场所选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          适合场所 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_OCCASIONS.map((o) => (
            <motion.button
              key={o}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleArrayItem('occasion', o)}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors ${
                formData.occasion.includes(o)
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: formData.occasion.includes(o) 
                  ? OCCASION_CONFIG[o].color 
                  : undefined
              }}
            >
              <span>{OCCASION_CONFIG[o].icon}</span>
              <span>{OCCASION_CONFIG[o].label}</span>
            </motion.button>
          ))}
        </div>
        {errors.occasion && (
          <p className="text-red-500 text-xs mt-1">{errors.occasion}</p>
        )}
      </div>

      {/* 其他信息 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 品牌 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            品牌/来源
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => updateField('brand', e.target.value)}
            placeholder="例如：ZARA"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary transition-colors"
          />
        </div>

        {/* 购买日期 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            购买日期
          </label>
          <input
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => updateField('purchaseDate', e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary transition-colors"
          />
        </div>

        {/* 价格 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            价格
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => updateField('price', e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* 常穿程度 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            常穿程度
          </label>
          <div className="flex items-center gap-2">
            {([1, 2, 3, 4, 5] as const).map((level) => (
              <motion.button
                key={level}
                type="button"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateField('wearFrequency', level)}
                className={`text-2xl transition-colors ${
                  level <= formData.wearFrequency 
                    ? 'text-primary' 
                    : 'text-gray-300'
                }`}
              >
                ★
              </motion.button>
            ))}
            <span className="text-sm text-gray-500 ml-2">
              {WEAR_FREQUENCY_LABELS[formData.wearFrequency]}
            </span>
          </div>
        </div>
      </div>

      {/* 备注 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          备注
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="记录一些穿搭心得或注意事项..."
          rows={3}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary transition-colors resize-none"
        />
      </div>

      {/* 状态选项 */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFavorite}
            onChange={(e) => updateField('isFavorite', e.target.checked)}
            className="checkbox-custom"
          />
          <span className="text-sm text-gray-700">❤️ 收藏</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.needsWash}
            onChange={(e) => updateField('needsWash', e.target.checked)}
            className="checkbox-custom"
          />
          <span className="text-sm text-gray-700">🧺 待洗</span>
        </label>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="flex-1"
        >
          取消
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="flex-1"
        >
          {isEdit ? '保存修改' : '添加衣物'}
        </Button>
      </div>
    </form>
  );
}
