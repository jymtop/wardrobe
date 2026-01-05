import { motion } from 'framer-motion';
import type { ClothingItem } from '../../types';
import ClothingCard from './ClothingCard';

interface ShelfAreaProps {
  items: ClothingItem[];
  onItemClick: (item: ClothingItem) => void;
}

export default function ShelfArea({ items, onItemClick }: ShelfAreaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-b from-amber-50/80 to-white/80 rounded-2xl p-4 backdrop-blur-sm"
    >
      {/* 区域标题 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">👜</span>
        <h3 className="font-serif text-lg text-wood-dark">叠放区</h3>
        <span className="text-xs text-gray-400 ml-auto">
          {items.length} 件
        </span>
      </div>

      {/* 层板 */}
      <div className="relative">
        {/* 层板效果 */}
        <div className="shelf-shadow bg-gradient-to-b from-wood-light to-wood h-3 rounded-t-sm" />
        
        {/* 衣物网格 */}
        <div className="bg-gradient-to-b from-amber-100/50 to-transparent pt-4 pb-2 px-2 rounded-b-lg min-h-[100px]">
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
              暂无物品
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
