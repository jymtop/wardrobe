import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClothingItem } from '../../types';

interface UnderwearAreaProps {
  items: ClothingItem[];
  onItemClick: (item: ClothingItem) => void;
}

export default function UnderwearArea({ items, onItemClick }: UnderwearAreaProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-gradient-to-b from-pink-50/80 to-white/80 rounded-2xl overflow-hidden backdrop-blur-sm border border-pink-100"
    >
      {/* 区域头部（可点击） */}
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: 'rgba(232, 180, 184, 0.1)' }}
        className="p-4 cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">👙</span>
          <h3 className="font-serif text-lg text-pink-700">内衣区</h3>
          <span className="text-xs text-gray-400">
            {items.length} 件
          </span>
          <span className="text-xs text-pink-400 ml-2">🔒 私密</span>
        </div>
        
        {/* 展开/收起图标 */}
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-pink-400"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* 内容区域 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-pink-100">
              {/* 内部区域 - 柔和背景 */}
              <div className="bg-gradient-to-b from-pink-100/30 to-pink-50/20 rounded-lg p-4 min-h-[100px]">
                {items.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -3, scale: 1.05 }}
                        onClick={() => onItemClick(item)}
                        className="relative cursor-pointer group"
                      >
                        {/* 图片 */}
                        <div className="aspect-square rounded-xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow bg-white border border-pink-100">
                          {item.images[0] ? (
                            <img 
                              src={item.images[0]} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div 
                              className="w-full h-full flex items-center justify-center text-2xl bg-pink-50"
                            >
                              👙
                            </div>
                          )}
                          
                          {/* 收藏标记 */}
                          {item.isFavorite && (
                            <div className="absolute top-1 right-1 text-xs">❤️</div>
                          )}
                          
                          {/* 待洗标记 */}
                          {item.needsWash && (
                            <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                              洗
                            </div>
                          )}
                        </div>
                        
                        {/* 名称 */}
                        <p className="mt-1 text-xs text-center text-gray-600 truncate">
                          {item.name}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-pink-300 text-sm h-[80px]">
                    暂无内衣
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
