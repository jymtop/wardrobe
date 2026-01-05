import { useState, useMemo, useCallback } from 'react';
import type { ClothingItem, FilterOptions, ClothingCategory, Season, Occasion } from '../types';

export function useFilter(items: ClothingItem[]) {
  const [filters, setFilters] = useState<FilterOptions>({});

  // 更新筛选条件
  const updateFilter = useCallback(<K extends keyof FilterOptions>(
    key: K, 
    value: FilterOptions[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' || value === undefined ? undefined : value,
    }));
  }, []);

  // 设置分类筛选
  const setCategory = useCallback((category: ClothingCategory | undefined) => {
    updateFilter('category', category);
  }, [updateFilter]);

  // 设置季节筛选
  const setSeason = useCallback((season: Season | undefined) => {
    updateFilter('season', season);
  }, [updateFilter]);

  // 设置场所筛选
  const setOccasion = useCallback((occasion: Occasion | undefined) => {
    updateFilter('occasion', occasion);
  }, [updateFilter]);

  // 设置颜色筛选
  const setColor = useCallback((color: string | undefined) => {
    updateFilter('color', color);
  }, [updateFilter]);

  // 设置关键词搜索
  const setKeyword = useCallback((keyword: string | undefined) => {
    updateFilter('keyword', keyword);
  }, [updateFilter]);

  // 设置待洗筛选
  const setNeedsWash = useCallback((needsWash: boolean | undefined) => {
    updateFilter('needsWash', needsWash);
  }, [updateFilter]);

  // 设置收藏筛选
  const setFavorite = useCallback((isFavorite: boolean | undefined) => {
    updateFilter('isFavorite', isFavorite);
  }, [updateFilter]);

  // 清空所有筛选
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // 检查是否有活动筛选
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(v => v !== undefined && v !== '');
  }, [filters]);

  // 应用筛选
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 分类筛选
      if (filters.category && item.category !== filters.category) {
        return false;
      }

      // 季节筛选
      if (filters.season && !item.season.includes(filters.season)) {
        return false;
      }

      // 场所筛选
      if (filters.occasion && !item.occasion.includes(filters.occasion)) {
        return false;
      }

      // 颜色筛选
      if (filters.color && item.color !== filters.color) {
        return false;
      }

      // 关键词搜索
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const searchFields = [
          item.name,
          item.brand,
          item.notes,
        ].filter(Boolean).map(s => s!.toLowerCase());
        
        if (!searchFields.some(field => field.includes(keyword))) {
          return false;
        }
      }

      // 待洗筛选
      if (filters.needsWash !== undefined && item.needsWash !== filters.needsWash) {
        return false;
      }

      // 收藏筛选
      if (filters.isFavorite !== undefined && item.isFavorite !== filters.isFavorite) {
        return false;
      }

      return true;
    });
  }, [items, filters]);

  // 按区域分组（用于衣柜内部展示）
  const groupedByArea = useMemo(() => {
    const groups: {
      hanging: ClothingItem[];
      shelf: ClothingItem[];
      drawer: ClothingItem[];
      underwear: ClothingItem[];
      shoes: ClothingItem[];
    } = {
      hanging: [],    // 挂衣区：上衣、裙子、连衣裙、外套
      shelf: [],      // 叠放区：包包
      drawer: [],     // 抽屉区：裤子、配饰
      underwear: [],  // 内衣区：内衣
      shoes: [],      // 鞋区：鞋子
    };

    filteredItems.forEach(item => {
      // 如果用户自定义了区域，优先使用
      if (item.area) {
        groups[item.area].push(item);
        return;
      }
      
      // 否则根据分类自动分配
      switch (item.category) {
        case 'top':
        case 'skirt':
        case 'dress':
        case 'outerwear':
          groups.hanging.push(item);
          break;
        case 'bag':
          groups.shelf.push(item);
          break;
        case 'pants':
        case 'accessory':
          groups.drawer.push(item);
          break;
        case 'underwear':
          groups.underwear.push(item);
          break;
        case 'shoes':
          groups.shoes.push(item);
          break;
      }
    });

    return groups;
  }, [filteredItems]);

  // 按分类分组
  const groupedByCategory = useMemo(() => {
    const groups: Record<ClothingCategory, ClothingItem[]> = {
      top: [],
      pants: [],
      skirt: [],
      dress: [],
      outerwear: [],
      underwear: [],
      shoes: [],
      bag: [],
      accessory: [],
    };

    filteredItems.forEach(item => {
      groups[item.category].push(item);
    });

    return groups;
  }, [filteredItems]);

  return {
    filters,
    filteredItems,
    groupedByArea,
    groupedByCategory,
    hasActiveFilters,
    setCategory,
    setSeason,
    setOccasion,
    setColor,
    setKeyword,
    setNeedsWash,
    setFavorite,
    clearFilters,
    updateFilter,
  };
}

export default useFilter;
