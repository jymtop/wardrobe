import type { ClothingItem, ExportData } from '../types';
import { clothingDB } from './db';

// 生成导出文件名
export function generateExportFileName(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `wardrobe_${year}${month}${day}_${hours}${minutes}.json`;
}

// 导出数据到JSON文件
export async function exportToJSON(): Promise<void> {
  try {
    const data = await clothingDB.exportData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = generateExportFileName();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('导出失败:', error);
    throw new Error('导出数据失败，请重试');
  }
}

// 验证导入数据格式
function validateImportData(data: unknown): data is ExportData {
  if (!data || typeof data !== 'object') return false;
  
  const d = data as Record<string, unknown>;
  if (!d.version || typeof d.version !== 'string') return false;
  if (!d.items || !Array.isArray(d.items)) return false;
  
  // 验证每个衣物项
  for (const item of d.items) {
    if (!item.id || typeof item.id !== 'string') return false;
    if (!item.name || typeof item.name !== 'string') return false;
    if (!item.category || typeof item.category !== 'string') return false;
  }
  
  return true;
}

// 数据迁移（版本兼容）
function migrateData(data: ExportData): ClothingItem[] {
  // 当前版本不需要迁移，直接返回
  // 未来版本升级时在此处添加迁移逻辑
  return data.items.map(item => ({
    ...item,
    // 确保必填字段有默认值
    images: item.images || [],
    season: item.season || ['all'],
    occasion: item.occasion || ['home'],
    color: item.color || '#FFFFFF',
    wearFrequency: item.wearFrequency || 3,
    needsWash: item.needsWash ?? false,
    isFavorite: item.isFavorite ?? false,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  }));
}

// 从JSON文件导入数据
export async function importFromJSON(
  file: File, 
  mode: 'replace' | 'merge' = 'replace'
): Promise<{ success: boolean; message: string; count?: number }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (!validateImportData(data)) {
          resolve({ 
            success: false, 
            message: '文件格式不正确，请选择正确的衣柜备份文件' 
          });
          return;
        }
        
        const migratedItems = migrateData(data);
        
        if (mode === 'replace') {
          await clothingDB.importData(migratedItems);
          resolve({ 
            success: true, 
            message: `成功导入 ${migratedItems.length} 件衣物`,
            count: migratedItems.length
          });
        } else {
          const result = await clothingDB.mergeData(migratedItems);
          resolve({ 
            success: true, 
            message: `新增 ${result.added} 件，更新 ${result.updated} 件`,
            count: result.added + result.updated
          });
        }
      } catch (error) {
        console.error('导入失败:', error);
        resolve({ 
          success: false, 
          message: '文件解析失败，请确保文件未损坏' 
        });
      }
    };
    
    reader.onerror = () => {
      resolve({ success: false, message: '文件读取失败' });
    };
    
    reader.readAsText(file);
  });
}

// 创建备份（本地存储最近备份时间）
export async function createBackup(): Promise<void> {
  await exportToJSON();
  localStorage.setItem('lastBackupTime', new Date().toISOString());
}

// 获取最近备份时间
export function getLastBackupTime(): string | null {
  return localStorage.getItem('lastBackupTime');
}

// 检查是否需要提醒备份（超过7天未备份）
export function shouldRemindBackup(): boolean {
  const lastBackup = getLastBackupTime();
  if (!lastBackup) return true;
  
  const lastBackupDate = new Date(lastBackup);
  const now = new Date();
  const daysDiff = (now.getTime() - lastBackupDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysDiff > 7;
}

// 图片压缩
export async function compressImage(
  file: File, 
  maxWidth: number = 800,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // 按比例缩放
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建画布上下文'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // 转换为 base64
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

// 计算存储使用量（估算）
export async function getStorageUsage(): Promise<{ used: string; available: string }> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const used = estimate.usage || 0;
    const quota = estimate.quota || 0;
    
    const formatSize = (bytes: number): string => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
    
    return {
      used: formatSize(used),
      available: formatSize(quota - used)
    };
  }
  
  return { used: '未知', available: '未知' };
}
