import { motion } from 'framer-motion';
import type { ClothingItem } from '../../types';
import HangingArea from './HangingArea';
import ShelfArea from './ShelfArea';
import DrawerArea from './DrawerArea';
import UnderwearArea from './UnderwearArea';
import ShoesArea from './ShoesArea';

interface WardrobeInteriorProps {
  groupedItems: {
    hanging: ClothingItem[];
    shelf: ClothingItem[];
    drawer: ClothingItem[];
    underwear: ClothingItem[];
    shoes: ClothingItem[];
  };
  onItemClick: (item: ClothingItem) => void;
  onClose: () => void;
}

export default function WardrobeInterior({ 
  groupedItems, 
  onItemClick,
  onClose 
}: WardrobeInteriorProps) {
  const totalItems = 
    groupedItems.hanging.length + 
    groupedItems.shelf.length + 
    groupedItems.drawer.length + 
    groupedItems.underwear.length +
    groupedItems.shoes.length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl text-wood-dark">我的衣柜</h2>
          <p className="text-sm text-gray-500 mt-1">
            共 {totalItems} 件衣物
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="px-4 py-2 bg-wood text-white rounded-xl shadow-md hover:bg-wood-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          关闭衣柜
        </motion.button>
      </div>

      {/* 衣柜内部区域 */}
      <div className="space-y-4">
        {/* 挂衣区 - 上衣、裙子、外套 */}
        <HangingArea 
          items={groupedItems.hanging} 
          onItemClick={onItemClick} 
        />
        
        {/* 中间区域 - 叠放区和抽屉区并排 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 叠放区 - 包包 */}
          <ShelfArea 
            items={groupedItems.shelf} 
            onItemClick={onItemClick} 
          />
          
          {/* 抽屉区 - 裤子、配饰 */}
          <DrawerArea 
            items={groupedItems.drawer} 
            onItemClick={onItemClick} 
          />
        </div>

        {/* 内衣区 */}
        <UnderwearArea
          items={groupedItems.underwear}
          onItemClick={onItemClick}
        />
        
        {/* 鞋区 */}
        <ShoesArea 
          items={groupedItems.shoes} 
          onItemClick={onItemClick} 
        />
      </div>
    </motion.div>
  );
}
