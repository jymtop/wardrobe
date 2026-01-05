import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClothingItem } from '../../types';
import ClothingCard from './ClothingCard';

interface DrawerAreaProps {
  items: ClothingItem[];
  onItemClick: (item: ClothingItem) => void;
}

export default function DrawerArea({ items, onItemClick }: DrawerAreaProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-b from-amber-50/80 to-white/80 rounded-2xl overflow-hidden backdrop-blur-sm"
    >
      {/* 抽屉头部（可点击） */}
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: 'rgba(201, 166, 107, 0.1)' }}
        className="p-4 cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🗄️</span>
          <h3 className="font-serif text-lg text-wood-dark">抽屉区</h3>
          <span className="text-xs text-gray-400">
            {items.length} 件
          </span>
        </div>
        
        {/* 抽屉把手 */}
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-wood-dark"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
          <div className="drawer-handle w-16 h-3" />
        </div>
      </motion.div>

      {/* 抽屉内容 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-wood/20">
              {/* 抽屉内部 - 深色背景 */}
              <div className="bg-gradient-to-b from-amber-900/10 to-amber-800/5 rounded-lg p-4 min-h-[100px]">
                {items.length > 0 ? (
                  <div className="flex gap-4 flex-wrap justify-center">
                    {items.map((item, index) => (
                      <ClothingCard
                        key={item.id}
                        item={item}
                        onClick={() => onItemClick(item)}
                        displayMode="folded"
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-gray-400 text-sm h-[80px]">
                    抽屉空空如也
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
