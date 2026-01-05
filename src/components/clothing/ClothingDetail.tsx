import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClothingItem } from '../../types';
import { 
  CATEGORY_CONFIG, 
  SEASON_CONFIG, 
  OCCASION_CONFIG,
  WEAR_FREQUENCY_LABELS 
} from '../../lib/constants';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import ClothingForm from './ClothingForm';
import type { ClothingFormData } from '../../types';

interface ClothingDetailProps {
  item: ClothingItem;
  onClose: () => void;
  onEdit: (id: string, data: ClothingFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleFavorite: (id: string) => void;
  onToggleNeedsWash: (id: string) => void;
}

export default function ClothingDetail({
  item,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleNeedsWash,
}: ClothingDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const categoryInfo = CATEGORY_CONFIG[item.category];

  const handleEdit = async (data: ClothingFormData) => {
    await onEdit(item.id, data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(item.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  // 编辑模式
  if (isEditing) {
    return (
      <Modal isOpen onClose={() => setIsEditing(false)} title="编辑衣物" size="lg">
        <ClothingForm
          initialData={item}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
          isEdit
        />
      </Modal>
    );
  }

  return (
    <>
      <Modal isOpen onClose={onClose} title={item.name} size="lg">
        <div className="space-y-6">
          {/* 图片展示 */}
          <div className="relative">
            {item.images.length > 0 ? (
              <>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={item.images[currentImageIndex]}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* 图片指示器 */}
                {item.images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-3">
                    {item.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex 
                            ? 'bg-primary' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                {/* 左右切换按钮 */}
                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(i => 
                        i === 0 ? item.images.length - 1 : i - 1
                      )}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(i => 
                        i === item.images.length - 1 ? 0 : i + 1
                      )}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </>
            ) : (
              <div 
                className="aspect-[4/3] rounded-2xl flex items-center justify-center text-6xl"
                style={{ backgroundColor: item.color + '20' }}
              >
                {categoryInfo.icon}
              </div>
            )}
          </div>

          {/* 快捷操作 */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggleFavorite(item.id)}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                item.isFavorite 
                  ? 'bg-red-50 text-red-500' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-xl">{item.isFavorite ? '❤️' : '🤍'}</span>
              <span>{item.isFavorite ? '已收藏' : '收藏'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggleNeedsWash(item.id)}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                item.needsWash 
                  ? 'bg-blue-50 text-blue-500' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-xl">🧺</span>
              <span>{item.needsWash ? '待洗' : '已洗净'}</span>
            </motion.button>
          </div>

          {/* 详细信息 */}
          <div className="space-y-4">
            {/* 分类和颜色 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">{categoryInfo.icon}</span>
                <span className="text-gray-700">{categoryInfo.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-gray-200"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-500 text-sm">主色调</span>
              </div>
            </div>

            {/* 季节和场所 */}
            <div className="flex flex-wrap gap-2">
              {item.season.map(s => (
                <span 
                  key={s}
                  className="tag"
                  style={{ 
                    backgroundColor: SEASON_CONFIG[s].color + '20',
                    color: SEASON_CONFIG[s].color 
                  }}
                >
                  {SEASON_CONFIG[s].icon} {SEASON_CONFIG[s].label}
                </span>
              ))}
              {item.occasion.map(o => (
                <span 
                  key={o}
                  className="tag"
                  style={{ 
                    backgroundColor: OCCASION_CONFIG[o].color + '20',
                    color: OCCASION_CONFIG[o].color 
                  }}
                >
                  {OCCASION_CONFIG[o].icon} {OCCASION_CONFIG[o].label}
                </span>
              ))}
            </div>

            {/* 其他信息 */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {item.brand && (
                <div>
                  <span className="text-gray-500">品牌：</span>
                  <span className="text-gray-700">{item.brand}</span>
                </div>
              )}
              {item.price !== undefined && (
                <div>
                  <span className="text-gray-500">价格：</span>
                  <span className="text-gray-700">¥{item.price}</span>
                </div>
              )}
              {item.purchaseDate && (
                <div>
                  <span className="text-gray-500">购买日期：</span>
                  <span className="text-gray-700">{item.purchaseDate}</span>
                </div>
              )}
              <div>
                <span className="text-gray-500">常穿程度：</span>
                <span className="text-primary">
                  {'★'.repeat(item.wearFrequency)}
                  {'☆'.repeat(5 - item.wearFrequency)}
                </span>
                <span className="text-gray-500 ml-1 text-xs">
                  {WEAR_FREQUENCY_LABELS[item.wearFrequency]}
                </span>
              </div>
            </div>

            {/* 备注 */}
            {item.notes && (
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-gray-500 text-sm block mb-1">备注</span>
                <p className="text-gray-700">{item.notes}</p>
              </div>
            )}

            {/* 时间信息 */}
            <div className="text-xs text-gray-400 flex gap-4">
              <span>创建：{new Date(item.createdAt).toLocaleDateString()}</span>
              <span>更新：{new Date(item.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-shrink-0"
            >
              删除
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex-1"
            >
              编辑
            </Button>
            <Button
              variant="primary"
              onClick={onClose}
              className="flex-1"
            >
              完成
            </Button>
          </div>
        </div>
      </Modal>

      {/* 删除确认弹窗 */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <Modal 
            isOpen 
            onClose={() => setShowDeleteConfirm(false)} 
            title="确认删除"
            size="sm"
          >
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🗑️</div>
              <p className="text-gray-700 mb-2">
                确定要删除 <strong>{item.name}</strong> 吗？
              </p>
              <p className="text-gray-500 text-sm mb-6">
                删除后无法恢复
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  loading={deleting}
                  className="flex-1"
                >
                  确认删除
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
