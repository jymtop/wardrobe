import { motion } from 'framer-motion';

interface WardrobeDoorProps {
  isOpen: boolean;
  onToggle: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
}

export default function WardrobeDoor({ 
  isOpen, 
  onToggle, 
  soundEnabled, 
  onToggleSound,
  musicEnabled,
  onToggleMusic
}: WardrobeDoorProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto" style={{ perspective: '1200px' }}>
      {/* 控制按钮组 */}
      <div className="absolute -top-12 right-0 flex gap-2 z-10">
        {/* 背景音乐开关 */}
        <button
          onClick={onToggleMusic}
          className={`p-2 rounded-full transition-colors ${
            musicEnabled 
              ? 'bg-primary/20 text-primary' 
              : 'text-secondary hover:text-primary'
          }`}
          title={musicEnabled ? '关闭音乐' : '开启音乐'}
        >
          {musicEnabled ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
            </svg>
          )}
        </button>
        
        {/* 开门音效开关 */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-full transition-colors ${
            soundEnabled 
              ? 'bg-primary/20 text-primary' 
              : 'text-secondary hover:text-primary'
          }`}
          title={soundEnabled ? '关闭音效' : '开启音效'}
        >
          {soundEnabled ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>
      </div>

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
