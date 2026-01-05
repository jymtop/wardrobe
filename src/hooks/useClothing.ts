import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ClothingItem, ClothingFormData } from '../types';
import { clothingDB } from '../lib/db';
import { sampleClothingItems } from '../data/sampleData';

// 防抖延迟
const DEBOUNCE_DELAY = 500;

export function useClothing() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 用于防抖的 ref
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 初始化加载数据
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // 检查是否有数据
        const isEmpty = await clothingDB.isEmpty();
        
        if (isEmpty) {
          // 首次使用，加载示例数据
          await clothingDB.bulkAdd(sampleClothingItems);
          setItems(sampleClothingItems);
        } else {
          // 加载已有数据
          const data = await clothingDB.getAll();
          setItems(data);
        }
      } catch (err) {
        console.error('加载数据失败:', err);
        setError('数据加载失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // 刷新数据
  const refresh = useCallback(async () => {
    try {
      const data = await clothingDB.getAll();
      setItems(data);
    } catch (err) {
      console.error('刷新数据失败:', err);
    }
  }, []);

  // 添加衣物
  const addItem = useCallback(async (formData: ClothingFormData): Promise<ClothingItem> => {
    const now = new Date().toISOString();
    const newItem: ClothingItem = {
      id: uuidv4(),
      name: formData.name,
      images: formData.images,
      category: formData.category,
      area: formData.area,
      season: formData.season,
      occasion: formData.occasion,
      color: formData.color,
      brand: formData.brand || undefined,
      notes: formData.notes || undefined,
      purchaseDate: formData.purchaseDate || undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      wearFrequency: formData.wearFrequency,
      needsWash: formData.needsWash,
      isFavorite: formData.isFavorite,
      createdAt: now,
      updatedAt: now,
    };

    await clothingDB.add(newItem);
    setItems(prev => [newItem, ...prev]);
    
    return newItem;
  }, []);

  // 更新衣物
  const updateItem = useCallback(async (
    id: string, 
    formData: Partial<ClothingFormData>
  ): Promise<void> => {
    const updates: Partial<ClothingItem> = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : undefined,
      updatedAt: new Date().toISOString(),
    };

    // 防抖保存
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      await clothingDB.update(id, updates);
    }, DEBOUNCE_DELAY);

    // 立即更新本地状态
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  // 删除衣物
  const deleteItem = useCallback(async (id: string): Promise<void> => {
    await clothingDB.delete(id);
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // 批量删除
  const deleteItems = useCallback(async (ids: string[]): Promise<void> => {
    await clothingDB.bulkDelete(ids);
    setItems(prev => prev.filter(item => !ids.includes(item.id)));
  }, []);

  // 切换收藏
  const toggleFavorite = useCallback(async (id: string): Promise<void> => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const newValue = !item.isFavorite;
    await clothingDB.update(id, { isFavorite: newValue });
    setItems(prev => prev.map(i => 
      i.id === id ? { ...i, isFavorite: newValue } : i
    ));
  }, [items]);

  // 切换待洗状态
  const toggleNeedsWash = useCallback(async (id: string): Promise<void> => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const newValue = !item.needsWash;
    await clothingDB.update(id, { needsWash: newValue });
    setItems(prev => prev.map(i => 
      i.id === id ? { ...i, needsWash: newValue } : i
    ));
  }, [items]);

  // 清空所有数据
  const clearAll = useCallback(async (): Promise<void> => {
    await clothingDB.clear();
    setItems([]);
  }, []);

  // 重置为示例数据
  const resetToSample = useCallback(async (): Promise<void> => {
    await clothingDB.clear();
    await clothingDB.bulkAdd(sampleClothingItems);
    setItems(sampleClothingItems);
  }, []);

  // 清理
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    items,
    loading,
    error,
    refresh,
    addItem,
    updateItem,
    deleteItem,
    deleteItems,
    toggleFavorite,
    toggleNeedsWash,
    clearAll,
    resetToSample,
  };
}

export default useClothing;
