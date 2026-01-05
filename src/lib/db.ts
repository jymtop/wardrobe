import Dexie, { type Table } from 'dexie';
import type { ClothingItem } from '../types';
import { DATA_VERSION } from './constants';

// 定义数据库
class WardrobeDatabase extends Dexie {
  clothes!: Table<ClothingItem, string>;

  constructor() {
    super('WardrobeDB');
    
    this.version(1).stores({
      clothes: 'id, category, color, isFavorite, needsWash, createdAt, updatedAt'
    });
  }
}

// 创建数据库实例
export const db = new WardrobeDatabase();

// 数据库操作函数
export const clothingDB = {
  // 获取所有衣物
  async getAll(): Promise<ClothingItem[]> {
    return await db.clothes.toArray();
  },

  // 根据ID获取单件衣物
  async getById(id: string): Promise<ClothingItem | undefined> {
    return await db.clothes.get(id);
  },

  // 添加衣物
  async add(item: ClothingItem): Promise<string> {
    return await db.clothes.add(item);
  },

  // 批量添加衣物
  async bulkAdd(items: ClothingItem[]): Promise<void> {
    await db.clothes.bulkAdd(items);
  },

  // 更新衣物
  async update(id: string, changes: Partial<ClothingItem>): Promise<void> {
    await db.clothes.update(id, {
      ...changes,
      updatedAt: new Date().toISOString()
    });
  },

  // 删除衣物
  async delete(id: string): Promise<void> {
    await db.clothes.delete(id);
  },

  // 批量删除
  async bulkDelete(ids: string[]): Promise<void> {
    await db.clothes.bulkDelete(ids);
  },

  // 清空所有数据
  async clear(): Promise<void> {
    await db.clothes.clear();
  },

  // 获取衣物数量
  async count(): Promise<number> {
    return await db.clothes.count();
  },

  // 按分类获取
  async getByCategory(category: string): Promise<ClothingItem[]> {
    return await db.clothes.where('category').equals(category).toArray();
  },

  // 获取收藏
  async getFavorites(): Promise<ClothingItem[]> {
    return await db.clothes.where('isFavorite').equals(1).toArray();
  },

  // 获取待洗衣物
  async getNeedsWash(): Promise<ClothingItem[]> {
    return await db.clothes.where('needsWash').equals(1).toArray();
  },

  // 检查数据库是否为空
  async isEmpty(): Promise<boolean> {
    const count = await db.clothes.count();
    return count === 0;
  },

  // 导出所有数据
  async exportData(): Promise<{ version: string; exportDate: string; items: ClothingItem[] }> {
    const items = await this.getAll();
    return {
      version: DATA_VERSION,
      exportDate: new Date().toISOString(),
      items
    };
  },

  // 导入数据（覆盖模式）
  async importData(items: ClothingItem[]): Promise<void> {
    await this.clear();
    await this.bulkAdd(items);
  },

  // 导入数据（合并模式）
  async mergeData(items: ClothingItem[]): Promise<{ added: number; updated: number }> {
    let added = 0;
    let updated = 0;
    
    for (const item of items) {
      const existing = await this.getById(item.id);
      if (existing) {
        await this.update(item.id, item);
        updated++;
      } else {
        await this.add(item);
        added++;
      }
    }
    
    return { added, updated };
  }
};

export default db;
