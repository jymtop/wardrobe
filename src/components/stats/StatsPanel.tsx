import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import type { ClothingItem, StatsData } from '../../types';
import { 
  CATEGORY_CONFIG, 
  SEASON_CONFIG, 
  OCCASION_CONFIG,
  ALL_CATEGORIES,
  ALL_SEASONS,
  ALL_OCCASIONS
} from '../../lib/constants';
import Button from '../ui/Button';
import { exportToJSON, getLastBackupTime } from '../../lib/storage';

interface StatsPanelProps {
  items: ClothingItem[];
  onClose: () => void;
  onImport: () => void;
}

// 图表颜色
const CHART_COLORS = [
  '#E8B4B8', '#A28089', '#FFB7C5', '#87CEEB', 
  '#98FB98', '#DDA0DD', '#F0E68C', '#FFA07A'
];

export default function StatsPanel({ items, onClose, onImport }: StatsPanelProps) {
  // 计算统计数据
  const stats = useMemo<StatsData>(() => {
    // 按分类统计
    const categoryStats = ALL_CATEGORIES.map(cat => ({
      category: cat,
      label: CATEGORY_CONFIG[cat].label,
      count: items.filter(i => i.category === cat).length,
      icon: CATEGORY_CONFIG[cat].icon,
    })).filter(s => s.count > 0);

    // 按季节统计
    const seasonStats = ALL_SEASONS.map(s => ({
      season: s,
      label: SEASON_CONFIG[s].label,
      count: items.filter(i => i.season.includes(s)).length,
      fill: SEASON_CONFIG[s].color,
    })).filter(s => s.count > 0);

    // 按场所统计
    const occasionStats = ALL_OCCASIONS.map(o => ({
      occasion: o,
      label: OCCASION_CONFIG[o].label,
      count: items.filter(i => i.occasion.includes(o)).length,
      fill: OCCASION_CONFIG[o].color,
    })).filter(s => s.count > 0);

    // 颜色统计
    const colorMap = new Map<string, number>();
    items.forEach(item => {
      const count = colorMap.get(item.color) || 0;
      colorMap.set(item.color, count + 1);
    });
    const colorStats = Array.from(colorMap.entries())
      .map(([color, count]) => ({ color, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 近30天趋势
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentItems = items.filter(i => new Date(i.createdAt) >= thirtyDaysAgo);
    
    const trendMap = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      trendMap.set(dateStr, 0);
    }
    
    recentItems.forEach(item => {
      const dateStr = item.createdAt.split('T')[0];
      if (trendMap.has(dateStr)) {
        trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + 1);
      }
    });
    
    const recentTrend = Array.from(trendMap.entries())
      .map(([date, count]) => ({ date, count }))
      .reverse();

    // 总价值
    const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);

    return {
      totalCount: items.length,
      categoryStats,
      seasonStats,
      occasionStats,
      colorStats,
      recentTrend,
      totalValue,
      favoriteCount: items.filter(i => i.isFavorite).length,
      needsWashCount: items.filter(i => i.needsWash).length,
    };
  }, [items]);

  const lastBackup = getLastBackupTime();

  const handleExport = async () => {
    try {
      await exportToJSON();
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto p-4 pb-20">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-wood-dark">衣柜统计</h2>
          <Button variant="ghost" onClick={onClose}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* 概览卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon="👗" 
            label="总数量" 
            value={stats.totalCount} 
            unit="件" 
          />
          <StatCard 
            icon="💰" 
            label="总价值" 
            value={stats.totalValue.toLocaleString()} 
            unit="元" 
          />
          <StatCard 
            icon="❤️" 
            label="收藏" 
            value={stats.favoriteCount} 
            unit="件" 
          />
          <StatCard 
            icon="🧺" 
            label="待洗" 
            value={stats.needsWashCount} 
            unit="件" 
          />
        </div>

        {/* 图表区域 */}
        <div className="space-y-6">
          {/* 分类统计 - 柱状图 */}
          <ChartCard title="按分类统计">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.categoryStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EED6D3" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: '#A28089', fontSize: 12 }}
                  axisLine={{ stroke: '#EED6D3' }}
                />
                <YAxis 
                  tick={{ fill: '#A28089', fontSize: 12 }}
                  axisLine={{ stroke: '#EED6D3' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FDF6F0',
                    border: '1px solid #EED6D3',
                    borderRadius: '12px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#E8B4B8" 
                  radius={[8, 8, 0, 0]}
                  name="数量"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 季节和场所 - 并排饼图 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 季节分布 */}
            <ChartCard title="季节分布">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.seasonStats}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ name, percent }) => 
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    labelLine={{ stroke: '#A28089' }}
                  >
                    {stats.seasonStats.map((entry, index) => (
                      <Cell 
                        key={entry.season} 
                        fill={entry.fill || CHART_COLORS[index % CHART_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FDF6F0',
                      border: '1px solid #EED6D3',
                      borderRadius: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* 场所分布 */}
            <ChartCard title="场所分布">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.occasionStats}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ name, percent }) => 
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    labelLine={{ stroke: '#A28089' }}
                  >
                    {stats.occasionStats.map((entry, index) => (
                      <Cell 
                        key={entry.occasion} 
                        fill={entry.fill || CHART_COLORS[index % CHART_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FDF6F0',
                      border: '1px solid #EED6D3',
                      borderRadius: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* 颜色分布 */}
          <ChartCard title="颜色分布">
            <div className="flex flex-wrap gap-3 justify-center">
              {stats.colorStats.map(({ color, count }) => (
                <div key={color} className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-600">{count}件</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* 近30天趋势 */}
          <ChartCard title="近30天新增趋势">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.recentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EED6D3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#A28089', fontSize: 10 }}
                  axisLine={{ stroke: '#EED6D3' }}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis 
                  tick={{ fill: '#A28089', fontSize: 12 }}
                  axisLine={{ stroke: '#EED6D3' }}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FDF6F0',
                    border: '1px solid #EED6D3',
                    borderRadius: '12px'
                  }}
                  labelFormatter={(label) => `日期: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#E8B4B8" 
                  strokeWidth={2}
                  dot={{ fill: '#E8B4B8', strokeWidth: 2 }}
                  name="新增数量"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* 数据管理 */}
        <div className="mt-8 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-card">
          <h3 className="font-serif text-lg text-wood-dark mb-4">数据管理</h3>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleExport}>
              📤 导出备份
            </Button>
            <Button variant="outline" onClick={onImport}>
              📥 导入数据
            </Button>
          </div>
          
          {lastBackup && (
            <p className="text-xs text-gray-500 mt-3">
              上次备份：{new Date(lastBackup).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// 统计卡片
function StatCard({ 
  icon, 
  label, 
  value, 
  unit 
}: { 
  icon: string; 
  label: string; 
  value: number | string; 
  unit: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-card"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-serif text-wood-dark">{value}</div>
      <div className="text-xs text-gray-500">
        {label} <span className="text-primary">{unit}</span>
      </div>
    </motion.div>
  );
}

// 图表卡片
function ChartCard({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-card"
    >
      <h3 className="font-serif text-lg text-wood-dark mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}
