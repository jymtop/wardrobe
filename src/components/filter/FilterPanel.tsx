import { motion, AnimatePresence } from 'framer-motion';
import type { FilterOptions, ClothingCategory, Season, Occasion } from '../../types';
import { 
  CATEGORY_CONFIG, 
  SEASON_CONFIG, 
  OCCASION_CONFIG,
  PRESET_COLORS,
  ALL_CATEGORIES,
  ALL_SEASONS,
  ALL_OCCASIONS
} from '../../lib/constants';
import SearchBar from './SearchBar';
import Button from '../ui/Button';

interface FilterPanelProps {
  filters: FilterOptions;
  onCategoryChange: (category: ClothingCategory | undefined) => void;
  onSeasonChange: (season: Season | undefined) => void;
  onOccasionChange: (occasion: Occasion | undefined) => void;
  onColorChange: (color: string | undefined) => void;
  onKeywordChange: (keyword: string | undefined) => void;
  onFavoriteChange: (isFavorite: boolean | undefined) => void;
  onNeedsWashChange: (needsWash: boolean | undefined) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  totalCount: number;
  filteredCount: number;
}

export default function FilterPanel({
  filters,
  onCategoryChange,
  onSeasonChange,
  onOccasionChange,
  onColorChange,
  onKeywordChange,
  onFavoriteChange,
  onNeedsWashChange,
  onClear,
  hasActiveFilters,
  totalCount,
  filteredCount,
}: FilterPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-card space-y-4"
    >
      {/* 搜索栏 */}
      <SearchBar
        value={filters.keyword || ''}
        onChange={(v) => onKeywordChange(v || undefined)}
        placeholder="搜索名称、品牌、备注..."
      />

      {/* 筛选标签组 */}
      <div className="space-y-3">
        {/* 衣物分类 */}
        <div>
          <label className="text-xs text-gray-500 mb-2 block">衣物分类</label>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={!filters.category}
              onClick={() => onCategoryChange(undefined)}
            >
              全部
            </FilterChip>
            {ALL_CATEGORIES.map((cat) => (
              <FilterChip
                key={cat}
                active={filters.category === cat}
                onClick={() => onCategoryChange(filters.category === cat ? undefined : cat)}
              >
                {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* 季节 */}
        <div>
          <label className="text-xs text-gray-500 mb-2 block">季节</label>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={!filters.season}
              onClick={() => onSeasonChange(undefined)}
            >
              全部
            </FilterChip>
            {ALL_SEASONS.map((s) => (
              <FilterChip
                key={s}
                active={filters.season === s}
                onClick={() => onSeasonChange(filters.season === s ? undefined : s)}
                activeColor={SEASON_CONFIG[s].color}
              >
                {SEASON_CONFIG[s].icon} {SEASON_CONFIG[s].label}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* 场所 */}
        <div>
          <label className="text-xs text-gray-500 mb-2 block">场所</label>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={!filters.occasion}
              onClick={() => onOccasionChange(undefined)}
            >
              全部
            </FilterChip>
            {ALL_OCCASIONS.map((o) => (
              <FilterChip
                key={o}
                active={filters.occasion === o}
                onClick={() => onOccasionChange(filters.occasion === o ? undefined : o)}
                activeColor={OCCASION_CONFIG[o].color}
              >
                {OCCASION_CONFIG[o].icon} {OCCASION_CONFIG[o].label}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* 颜色 */}
        <div>
          <label className="text-xs text-gray-500 mb-2 block">颜色</label>
          <div className="flex flex-wrap gap-2 items-center">
            <FilterChip
              active={!filters.color}
              onClick={() => onColorChange(undefined)}
            >
              全部
            </FilterChip>
            {PRESET_COLORS.slice(0, 10).map((c) => (
              <motion.button
                key={c.value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onColorChange(filters.color === c.value ? undefined : c.value)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  filters.color === c.value
                    ? 'border-primary scale-110 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* 快捷筛选 */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <FilterChip
            active={filters.isFavorite === true}
            onClick={() => onFavoriteChange(filters.isFavorite ? undefined : true)}
            activeColor="#FF6B6B"
          >
            ❤️ 收藏
          </FilterChip>
          <FilterChip
            active={filters.needsWash === true}
            onClick={() => onNeedsWashChange(filters.needsWash ? undefined : true)}
            activeColor="#4A90D9"
          >
            🧺 待洗
          </FilterChip>
        </div>
      </div>

      {/* 结果统计和清空 */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          {hasActiveFilters ? (
            <>
              筛选结果：<span className="text-primary font-medium">{filteredCount}</span> / {totalCount} 件
            </>
          ) : (
            <>共 <span className="text-primary font-medium">{totalCount}</span> 件衣物</>
          )}
        </span>
        
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              >
                清空筛选
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// 筛选标签组件
function FilterChip({ 
  children, 
  active, 
  onClick,
  activeColor = '#E8B4B8'
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
  activeColor?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
        active
          ? 'text-white shadow-md'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      style={{
        backgroundColor: active ? activeColor : undefined
      }}
    >
      {children}
    </motion.button>
  );
}
