import { motion } from 'framer-motion';
import type { ClothingItem } from '../../types';

interface ShoesAreaProps {
  items: ClothingItem[];
  onItemClick: (item: ClothingItem) => void;
}

export default function ShoesArea({ items, onItemClick }: ShoesAreaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-b from-amber-50/80 to-white/80 rounded-2xl p-4 backdrop-blur-sm"
    >
      {/* 区域标题 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">👟</span>
        <h3 className="font-serif text-lg text-wood-dark">鞋区</h3>
        <span className="text-xs text-gray-400 ml-auto">
          {items.length} 双
        </span>
      </div>

      {/* 鞋架 */}
      <div className="relative">
        {/* 鞋架层板 */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-wood to-wood-light rounded-t-sm shadow-sm" />
        
        {/* 鞋子展示 */}
        <div className="pt-4 pb-2 min-h-[100px]">
          {items.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
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
                  {/* 鞋子图片 */}
                  <div className="aspect-square rounded-lg overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow bg-white">
                    {item.images[0] ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: item.color + '20' }}
                      >
                        👟
                      </div>
                    )}
                    
                    {/* 收藏标记 */}
                    {item.isFavorite && (
                      <div className="absolute top-0.5 right-0.5 text-xs">❤️</div>
                    )}
                  </div>
                  
                  {/* 鞋子名称 */}
                  <p className="mt-1 text-xs text-center text-gray-600 truncate">
                    {item.name}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center text-gray-400 text-sm h-[80px]">
              暂无鞋子
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
