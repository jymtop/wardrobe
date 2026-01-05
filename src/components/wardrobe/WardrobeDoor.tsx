import { motion } from 'framer-motion';

interface WardrobeDoorProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function WardrobeDoor({ 
  isOpen, 
  onToggle
}: WardrobeDoorProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto" style={{ perspective: '1200px' }}>

      {/* 衣柜框架 */}
      <div 
        className="relative bg-gradient-to-b from-wood to-wood-dark rounded-t-3xl shadow-wardrobe overflow-hidden"
        style={{ 
          height: '70vh',
          maxHeight: '600px',
          minHeight: '400px',
        }}
      >
        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-wood-dark rounded-t-3xl" />
        
        {/* 衣柜内部（门打开后可见） */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3, delay: isOpen ? 0.3 : 0 }}
          className="absolute inset-4 top-6 bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg"
          style={{ 
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.1)',
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        >
          {/* 内部装饰 - 衣架杆 */}
          <div className="absolute top-8 left-4 right-4 h-2 bg-wood-dark rounded-full shadow-md" />
          
          {/* 层板 */}
          <div className="absolute top-1/3 left-4 right-4 h-2 bg-wood rounded-sm shadow-sm" />
          <div className="absolute top-2/3 left-4 right-4 h-2 bg-wood rounded-sm shadow-sm" />
          
          {/* 点击提示 */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-wood-dark/50 text-sm font-medium">
                衣柜已打开 ✨
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* 左门 */}
        <motion.div
          animate={{ 
            rotateY: isOpen ? -105 : 0,
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{ 
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
          }}
          className="absolute left-0 top-0 bottom-0 w-1/2 cursor-pointer"
          onClick={onToggle}
        >
          {/* 门板 */}
          <div className="absolute inset-0 wood-texture rounded-tl-2xl border-r border-wood-dark/20">
            {/* 门框装饰 */}
            <div className="absolute inset-4 border-2 border-wood-dark/20 rounded-lg">
              {/* 内部花纹 */}
              <div className="absolute inset-2 border border-wood-dark/10 rounded" />
            </div>
            
            {/* 把手 */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full shadow-lg" />
          </div>
          
          {/* 门的侧面（3D效果） */}
          <div 
            className="absolute top-0 bottom-0 -right-2 w-2 bg-wood-dark"
            style={{ 
              transform: 'rotateY(90deg)',
              transformOrigin: 'left center',
            }}
          />
        </motion.div>

        {/* 右门 */}
        <motion.div
          animate={{ 
            rotateY: isOpen ? 105 : 0,
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{ 
            transformOrigin: 'right center',
            transformStyle: 'preserve-3d',
          }}
          className="absolute right-0 top-0 bottom-0 w-1/2 cursor-pointer"
          onClick={onToggle}
        >
          {/* 门板 */}
          <div className="absolute inset-0 wood-texture rounded-tr-2xl border-l border-wood-dark/20">
            {/* 门框装饰 */}
            <div className="absolute inset-4 border-2 border-wood-dark/20 rounded-lg">
              {/* 内部花纹 */}
              <div className="absolute inset-2 border border-wood-dark/10 rounded" />
            </div>
            
            {/* 把手 */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-16 bg-gradient-to-l from-amber-600 to-amber-700 rounded-full shadow-lg" />
          </div>
          
          {/* 门的侧面（3D效果） */}
          <div 
            className="absolute top-0 bottom-0 -left-2 w-2 bg-wood-dark"
            style={{ 
              transform: 'rotateY(-90deg)',
              transformOrigin: 'right center',
            }}
          />
        </motion.div>

        {/* 中缝装饰 */}
        {!isOpen && (
          <div className="absolute left-1/2 top-4 bottom-0 w-px bg-wood-dark/30 -translate-x-1/2" />
        )}
      </div>

      {/* 底座 */}
      <div className="h-6 bg-gradient-to-b from-wood-dark to-amber-900 rounded-b-lg shadow-lg" />

      {/* 提示文字 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6 text-secondary text-sm"
      >
        {isOpen ? '点击柜门关闭衣柜' : '点击柜门打开衣柜 👆'}
      </motion.p>
    </div>
  );
}
