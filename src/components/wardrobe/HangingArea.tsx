import { motion } from 'framer-motion';
import type { ClothingItem } from '../../types';
import ClothingCard from './ClothingCard';

interface HangingAreaProps {
  items: ClothingItem[];
  onItemClick: (item: ClothingItem) => void;
}

export default function HangingArea({ items, onItemClick }: HangingAreaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-b from-amber-50/80 to-white/80 rounded-2xl p-4 backdrop-blur-sm"
    >
      {/* 区域标题 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">👚</span>
        <h3 className="font-serif text-lg text-wood-dark">挂衣区</h3>
        <span className="text-xs text-gray-400 ml-auto">
          {items.length} 件
        </span>
      </div>

      {/* 衣架杆 */}
      <div className="relative">
        {/* 杆子 */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-wood-dark to-wood rounded-full shadow-md z-10" />
        
        {/* 杆子支架 */}
        <div className="absolute -top-4 left-4 w-1 h-4 bg-wood-dark" />
        <div className="absolute -top-4 right-4 w-1 h-4 bg-wood-dark" />

        {/* 衣物列表 */}
        <div className="pt-6 overflow-x-auto">
          <div className="flex gap-4 pb-2 min-h-[140px]">
            {items.length > 0 ? (
              items.map((item, index) => (
                <ClothingCard
                  key={item.id}
                  item={item}
                  onClick={() => onItemClick(item)}
                  displayMode="hanging"
                  index={index}
                />
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                暂无挂衣
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
