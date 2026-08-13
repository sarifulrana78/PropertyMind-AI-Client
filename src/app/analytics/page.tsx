'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, TrendingUp, Building2, MapPin, Loader2, Brain, RefreshCw } from 'lucide-react';
import { useMarketStats, usePriceTrends, useMarketAnalysis } from '@/hooks/useProperties';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316', '#14b8a6'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{value: number; name: string; color: string}>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-sm">
        <p className="text-white font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.name.includes('Price') || p.name.includes('price') ? `$${p.value?.toLocaleString()}` : p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedCity, setSelectedCity] = useState('Austin');

  const { data: marketStats, isLoading: statsLoading } = useMarketStats();
  const { data: trends, isLoading: trendsLoading } = usePriceTrends();
  const marketAnalysis = useMarketAnalysis();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleAnalyzeCity = async () => {
    const toastId = toast.loading(`🤖 Analyzing ${selectedCity} market...`);
    try {
      await marketAnalysis.mutateAsync(selectedCity);
      toast.success('AI market analysis complete!', { id: toastId });
    } catch {
      toast.error('Failed to generate analysis', { id: toastId });
    }
  };

  if (authLoading) return (
    <div className="min-h-screen gradient-hero flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
    </div>
  );

  const analysisData = marketAnalysis.data;
  const trendColor = analysisData?.analysis?.trend === 'bullish' ? 'text-secondary-400' :
    analysisData?.analysis?.trend === 'bearish' ? 'text-red-400' : 'text-accent-400';

  return (
    <div className="min-h-screen gradient-hero py-8">
      <div className="section-container">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-primary-400" />
            <span className="text-dark-400 text-sm">Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Market Analytics</h1>
          <p className="text-dark-400 text-sm mt-1">Real-time insights powered by AI analysis</p>
        </motion.div>

        {/* Summary cards */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          {statsLoading ? Array(4).fill(0).map((_, i) => (
            <div key={i} className="glass-card p-6">
              <div className="skeleton h-8 w-24 mb-2 rounded" />
              <div className="skeleton h-5 w-16 rounded" />
            </div>
          )) : [
            { label: 'Markets Tracked', value: marketStats?.length || 0, icon: MapPin, color: 'text-primary-400' },
            { label: 'Total Listings', value: trends?.totalProperties || 0, icon: Building2, color: 'text-secondary-400' },
            { label: 'Avg Market Price', value: marketStats ? `$${Math.round(marketStats.reduce((a: number, s: {avgPrice: number}) => a + s.avgPrice, 0) / (marketStats.length || 1) / 1000)}K` : '—', icon: TrendingUp, color: 'text-accent-400' },
            { label: 'Property Types', value: trends?.typeStats?.length || 0, icon: BarChart3, color: 'text-pink-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card p-6">
              <Icon className={`w-6 h-6 ${color} mb-3`} />
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-dark-400 text-sm">{label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* City price chart */}
          <motion.div className="lg:col-span-2 glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-400" /> Average Price by City
            </h2>
            {statsLoading ? (
              <div className="h-64 skeleton rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={marketStats || []} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="city" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgPrice" name="Avg Price" fill="#6366f1" radius={[6, 6, 0, 0]}>
                    {(marketStats || []).map((_: unknown, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Property type distribution */}
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-secondary-400" /> Property Types
            </h2>
            {trendsLoading ? (
              <div className="h-64 skeleton rounded-xl" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={trends?.typeStats || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="count"
                      nameKey="type"
                    >
                      {(trends?.typeStats || []).map((_: unknown, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {(trends?.typeStats || []).map((t: {type: string; count: number; avgPrice: number}, i: number) => (
                    <div key={t.type} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-dark-300 capitalize">{t.type}</span>
                      </div>
                      <span className="text-white font-medium">{t.count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Monthly trends chart */}
          <motion.div className="lg:col-span-2 glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent-400" /> Monthly Price Trends
            </h2>
            {trendsLoading ? (
              <div className="h-64 skeleton rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trends?.monthlyTrends || []} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="avgPrice" name="Avg Price" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* AI Market Analysis panel */}
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary-400" /> AI City Analysis
            </h2>

            <div className="flex gap-2 mb-4">
              <select
                id="city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input-field flex-1 text-sm"
              >
                {['Austin', 'Miami', 'New York', 'Los Angeles', 'Chicago', 'Seattle', 'Denver', 'Boston'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                id="analyze-city-btn"
                onClick={handleAnalyzeCity}
                disabled={marketAnalysis.isPending}
                className="btn-primary text-sm px-4 py-2"
              >
                {marketAnalysis.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </button>
            </div>

            {analysisData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-dark-400 text-sm">Market Trend</span>
                  <span className={`font-bold capitalize ${trendColor}`}>
                    {analysisData.analysis.trend} 📈
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-400 text-sm">Investment</span>
                  <span className="text-white font-semibold capitalize">{analysisData.analysis.investmentOpportunity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dark-400 text-sm">Listings</span>
                  <span className="text-white">{analysisData.stats.totalListings}</span>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <p className="text-dark-300 text-xs leading-relaxed">{analysisData.analysis.summary}</p>
                </div>
                {analysisData.analysis.insights?.slice(0, 2).map((insight: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 flex-shrink-0" />
                    <span className="text-dark-400">{insight}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Brain className="w-10 h-10 text-dark-600 mx-auto mb-3" />
                <p className="text-dark-400 text-sm">Select a city and click analyze to get AI market insights</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
