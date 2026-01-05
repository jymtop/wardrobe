import { useRef, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { compressImage } from '../../lib/storage';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ 
  images, 
  onChange, 
  maxImages = 5 
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    try {
      const newImages = await Promise.all(
        filesToProcess.map(file => compressImage(file))
      );
      onChange([...images, ...newImages]);
    } catch (error) {
      console.error('图片处理失败:', error);
    }

    // 清空 input，允许重复选择同一文件
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < images.length) {
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      onChange(newImages);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        衣物图片 <span className="text-gray-400">({images.length}/{maxImages})</span>
      </label>

      {/* 图片预览 */}
      <div className="flex gap-3 flex-wrap">
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={image.slice(0, 50) + index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-100">
                <img 
                  src={image} 
                  alt={`图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* 操作按钮 */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'left')}
                    className="p-1 bg-white rounded-full text-gray-600 hover:text-gray-900"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'right')}
                    className="p-1 bg-white rounded-full text-gray-600 hover:text-gray-900"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* 首图标记 */}
              {index === 0 && (
                <div className="absolute -top-1 -left-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                  封面
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 添加按钮 */}
        {images.length < maxImages && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => inputRef.current?.click()}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary flex flex-col items-center justify-center text-gray-400 hover:text-primary transition-colors"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs mt-1">添加图片</span>
          </motion.button>
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-400">
        支持 JPG、PNG、GIF 格式，图片会自动压缩
      </p>
    </div>
  );
}
