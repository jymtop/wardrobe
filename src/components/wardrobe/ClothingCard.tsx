import { motion } from 'framer-motion';
import type { ClothingItem } from '../../types';
import { CATEGORY_CONFIG, SEASON_CONFIG } from '../../lib/constants';

interface ClothingCardProps {
  item: ClothingItem;
  onClick: () => void;
  displayMode?: 'hanging' | 'folded' | 'grid';
  index?: number;
}

export default function ClothingCard({ 
  item, 
  onClick, 
  displayMode = 'grid',
  index = 0 
}: ClothingCardProps) {
  const categoryInfo = CATEGORY_CONFIG[item.category];

  // 挂衣模式
  if (displayMode === 'hanging') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: 5, scale: 1.02 }}
        onClick={onClick}
        className="relative cursor-pointer group"
        style={{ width: '100px' }}
      >
        {/* 衣架 */}
        <div className="relative mx-auto" style={{ width: '60px' }}>
          {/* 挂钩 */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-2 h-4 bg-wood-dark rounded-t-full" />
          {/* 衣架主体 */}
          <div className="h-5 border-t-4 border-x-4 border-wood-dark rounded-t-full" />
        </div>
        
        {/* 衣物图片 */}
        <div className="relative -mt-1 mx-auto w-20 h-24 rounded-b-lg overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow">
          {item.images[0] ? (
            <img 
              src={item.images[0]} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-accent flex items-center justify-center text-2xl">
              {categoryInfo.icon}
            </div>
          )}
          
          {/* 收藏标记 */}
          {item.isFavorite && (
            <div className="absolute top-1 right-1 text-red-500 text-sm">❤️</div>
          )}
          
          {/* 待洗标记 */}
          {item.needsWash && (
            <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
              待洗
            </div>
          )}
        </div>
        
        {/* 名称 */}
        <p className="mt-1 text-xs text-center text-gray-600 truncate px-1">
          {item.name}
        </p>
      </motion.div>
    );
  }

  // 叠放模式
  if (displayMode === 'folded') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -3, scale: 1.03 }}
        onClick={onClick}
        className="relative cursor-pointer group"
      >
        {/* 叠放效果 - 层叠阴影 */}
        <div className="absolute -bottom-1 left-1 right-1 h-2 bg-gray-200 rounded-b-lg" />
        <div className="absolute -bottom-2 left-2 right-2 h-2 bg-gray-300 rounded-b-lg" />
        
        {/* 衣物主体 */}
        <div className="relative w-20 h-16 rounded-lg overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow bg-white">
          {item.images[0] ? (
            <img 
              src={item.images[0]} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: item.color + '30' }}
            >
              {categoryInfo.icon}
            </div>
          )}
          
          {/* 收藏标记 */}
          {item.isFavorite && (
            <div className="absolute top-0.5 right-0.5 text-red-500 text-xs">❤️</div>
          )}
        </div>
        
        {/* 名称 */}
        <p className="mt-2 text-xs text-center text-gray-600 truncate">
          {item.name}
        </p>
      </motion.div>
    );
  }

  // 网格模式（默认）
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="clothing-card bg-white rounded-2xl overflow-hidden shadow-card cursor-pointer"
    >
      {/* 图片区域 */}
      <div className="relative aspect-[3/4] bg-gray-100">
        {item.images[0] ? (
          <img 
            src={item.images[0]} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: item.color + '20' }}
          >
            {categoryInfo.icon}
          </div>
        )}
        
        {/* 顶部标签 */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {/* 分类标签 */}
          <span className="tag tag-primary">
            {categoryInfo.icon} {categoryInfo.label}
          </span>
          
          {/* 收藏按钮 */}
          {item.isFavorite && (
            <span className="text-lg drop-shadow-md">❤️</span>
          )}
        </div>
        
        {/* 底部状态 */}
        <div className="absolute bottom-2 left-2 right-2 flex gap-1 flex-wrap">
          {item.needsWash && (
            <span className="bg-blue-500/90 text-white text-xs px-2 py-0.5 rounded-full">
              待洗
            </span>
          )}
          {item.season.slice(0, 2).map(s => (
            <span 
              key={s} 
              className="bg-white/90 text-xs px-2 py-0.5 rounded-full"
              style={{ color: SEASON_CONFIG[s].color }}
            >
              {SEASON_CONFIG[s].icon}
            </span>
          ))}
        </div>
      </div>
      
      {/* 信息区域 */}
      <div className="p-3">
        <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
        
        <div className="flex items-center justify-between mt-2">
          {/* 颜色指示 */}
          <div className="flex items-center gap-1.5">
            <div 
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: item.color }}
            />
            {item.brand && (
              <span className="text-xs text-gray-500 truncate max-w-[80px]">
                {item.brand}
              </span>
            )}
          </div>
          
          {/* 常穿程度 */}
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(level => (
              <span 
                key={level}
                className={`text-xs ${level <= item.wearFrequency ? 'text-primary' : 'text-gray-200'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
