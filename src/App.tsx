import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClothingItem, ClothingFormData } from './types';
import { useWardrobe } from './hooks/useWardrobe';
import { useClothing } from './hooks/useClothing';
import { useFilter } from './hooks/useFilter';
import { useToast } from './components/ui/Toast';
import { importFromJSON } from './lib/storage';

// 组件
import WardrobeDoor from './components/wardrobe/WardrobeDoor';
import WardrobeInterior from './components/wardrobe/WardrobeInterior';
import ClothingCard from './components/wardrobe/ClothingCard';
import ClothingForm from './components/clothing/ClothingForm';
import ClothingDetail from './components/clothing/ClothingDetail';
import FilterPanel from './components/filter/FilterPanel';
import StatsPanel from './components/stats/StatsPanel';
import Button from './components/ui/Button';
import Modal from './components/ui/Modal';
import EmptyState from './components/ui/EmptyState';

type ViewMode = 'wardrobe' | 'grid' | 'stats';

export default function App() {
  // 状态管理
  const wardrobe = useWardrobe();
  const clothing = useClothing();
  const filter = useFilter(clothing.items);
  const toast = useToast();

  // 本地状态
  const [viewMode, setViewMode] = useState<ViewMode>('wardrobe');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理添加衣物
  const handleAddItem = useCallback(async (data: ClothingFormData) => {
    try {
      await clothing.addItem(data);
      setShowAddForm(false);
      toast.success('衣物添加成功！');
    } catch {
      toast.error('添加失败，请重试');
    }
  }, [clothing, toast]);

  // 处理编辑衣物
  const handleEditItem = useCallback(async (id: string, data: ClothingFormData) => {
    try {
      await clothing.updateItem(id, data);
      setSelectedItem(null);
      toast.success('修改已保存');
    } catch {
      toast.error('保存失败，请重试');
    }
  }, [clothing, toast]);

  // 处理删除衣物
  const handleDeleteItem = useCallback(async (id: string) => {
    try {
      await clothing.deleteItem(id);
      setSelectedItem(null);
      toast.success('衣物已删除');
    } catch {
      toast.error('删除失败，请重试');
    }
  }, [clothing, toast]);

  // 处理导入
  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await importFromJSON(file, 'replace');
    if (result.success) {
      toast.success(result.message);
      clothing.refresh();
      setShowImportModal(false);
    } else {
      toast.error(result.message);
    }

    // 清空 input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [toast, clothing]);

  // 处理点击衣物
  const handleItemClick = useCallback((item: ClothingItem) => {
    setSelectedItem(item);
  }, []);

  // 切换视图
  const handleOpenWardrobe = useCallback(() => {
    wardrobe.openWardrobe();
    setViewMode('wardrobe');
  }, [wardrobe]);

  // 加载状态
  if (clothing.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-primary/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* 可爱卡通衣柜图标 */}
            <div className="w-8 h-8 relative">
              <svg viewBox="0 0 64 64" className="w-full h-full">
                {/* 衣柜主体 */}
                <rect x="8" y="10" width="48" height="50" rx="4" fill="#C9A66B" stroke="#8B6914" strokeWidth="2"/>
                {/* 衣柜顶部装饰 */}
                <rect x="6" y="8" width="52" height="6" rx="2" fill="#8B6914"/>
                {/* 左门 */}
                <rect x="10" y="14" width="20" height="42" rx="2" fill="#E8D5B0" stroke="#C9A66B" strokeWidth="1"/>
                {/* 右门 */}
                <rect x="34" y="14" width="20" height="42" rx="2" fill="#E8D5B0" stroke="#C9A66B" strokeWidth="1"/>
                {/* 左门把手 */}
                <circle cx="28" cy="35" r="2.5" fill="#FFB6C1" stroke="#E8B4B8" strokeWidth="1"/>
                {/* 右门把手 */}
                <circle cx="36" cy="35" r="2.5" fill="#FFB6C1" stroke="#E8B4B8" strokeWidth="1"/>
                {/* 爱心装饰 */}
                <path d="M32 20 C32 17 35 15 37 17 C39 15 42 17 42 20 C42 24 37 28 37 28 C37 28 32 24 32 20Z" fill="#FFB6C1"/>
                {/* 衣柜脚 */}
                <rect x="12" y="58" width="6" height="4" rx="1" fill="#8B6914"/>
                <rect x="46" y="58" width="6" height="4" rx="1" fill="#8B6914"/>
              </svg>
            </div>
            <h1 className="font-serif text-xl text-wood-dark"><span className="text-red-400">❤</span>李亚琴<span className="text-red-400">❤</span>的衣柜</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* 视图切换 */}
            <div className="flex bg-white rounded-xl p-1 shadow-sm">
              <button
                onClick={() => {
                  if (!wardrobe.isOpen) wardrobe.openWardrobe();
                  setViewMode('wardrobe');
                }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  viewMode === 'wardrobe' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                🚪 衣柜
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📋 列表
              </button>
              <button
                onClick={() => setViewMode('stats')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  viewMode === 'stats' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📊 统计
              </button>
            </div>
            
            {/* 添加按钮 */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddForm(true)}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              添加
            </Button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* 衣柜视图 */}
          {viewMode === 'wardrobe' && (
            <motion.div
              key="wardrobe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {!wardrobe.isOpen ? (
                // 衣柜门关闭状态
                <div className="py-8">
                  <WardrobeDoor
                    isOpen={wardrobe.isOpen}
                    onToggle={handleOpenWardrobe}
                  />
                </div>
              ) : (
                // 衣柜内部
                <WardrobeInterior
                  groupedItems={filter.groupedByArea}
                  onItemClick={handleItemClick}
                  onClose={wardrobe.closeWardrobe}
                />
              )}
            </motion.div>
          )}

          {/* 列表视图 */}
          {viewMode === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* 筛选面板 */}
              <FilterPanel
                filters={filter.filters}
                onCategoryChange={filter.setCategory}
                onSeasonChange={filter.setSeason}
                onOccasionChange={filter.setOccasion}
                onColorChange={filter.setColor}
                onKeywordChange={filter.setKeyword}
                onFavoriteChange={filter.setFavorite}
                onNeedsWashChange={filter.setNeedsWash}
                onClear={filter.clearFilters}
                hasActiveFilters={filter.hasActiveFilters}
                totalCount={clothing.items.length}
                filteredCount={filter.filteredItems.length}
              />

              {/* 衣物网格 */}
              {filter.filteredItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filter.filteredItems.map((item, index) => (
                    <ClothingCard
                      key={item.id}
                      item={item}
                      onClick={() => handleItemClick(item)}
                      displayMode="grid"
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={filter.hasActiveFilters ? '🔍' : '👗'}
                  title={filter.hasActiveFilters ? '没有找到匹配的衣物' : '衣柜还是空的'}
                  description={
                    filter.hasActiveFilters 
                      ? '试试调整筛选条件' 
                      : '点击右上角的"添加"按钮，开始记录你的衣物吧'
                  }
                  actionLabel={filter.hasActiveFilters ? '清空筛选' : '添加第一件衣物'}
                  onAction={filter.hasActiveFilters ? filter.clearFilters : () => setShowAddForm(true)}
                />
              )}
            </motion.div>
          )}

          {/* 统计视图 */}
          {viewMode === 'stats' && (
            <StatsPanel
              items={clothing.items}
              onClose={() => setViewMode('grid')}
              onImport={() => setShowImportModal(true)}
            />
          )}
        </AnimatePresence>
      </main>

      {/* 添加衣物弹窗 */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="添加新衣物"
        size="lg"
      >
        <ClothingForm
          onSubmit={handleAddItem}
          onCancel={() => setShowAddForm(false)}
        />
      </Modal>

      {/* 衣物详情弹窗 */}
      {selectedItem && (
        <ClothingDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onToggleFavorite={clothing.toggleFavorite}
          onToggleNeedsWash={clothing.toggleNeedsWash}
        />
      )}

      {/* 导入弹窗 */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="导入数据"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="text-5xl mb-4">📥</div>
          <p className="text-gray-700 mb-4">
            选择之前导出的 JSON 备份文件
          </p>
          <p className="text-sm text-red-500 mb-6">
            ⚠️ 导入将覆盖当前所有数据
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowImportModal(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              选择文件
            </Button>
          </div>
        </div>
      </Modal>

      {/* 底部提示（首次使用） */}
      {clothing.items.length > 0 && clothing.items.length <= 16 && viewMode === 'wardrobe' && !wardrobe.isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg text-sm text-gray-600"
        >
          💡 点击衣柜门，打开你的专属衣柜
        </motion.div>
      )}
    </div>
  );
}
