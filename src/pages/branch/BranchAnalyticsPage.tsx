import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analytics.service';
import type { DashboardStats } from '../../types/analytics.types';
import {
    TrendingUp, Users, ShoppingBag, Truck, CheckCircle2,
    Calendar, Clock, Wallet, ArrowUpRight, ArrowDownRight, Package
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { PageWrapper } from '@/components/layout';
import { Card, Badge, Spinner } from '@/components/ui';
import { formatCurrency, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

export const BranchAnalyticsPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const data = await analyticsService.getDashboardStats();
            setStats(data || null);
        } catch (error) {
            console.error('Failed to fetch analytics', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Spinner size="lg" className="text-primary-600" />
            <p className="text-sm font-black text-neutral-400 uppercase tracking-widest animate-pulse">Syncing Branch Data Matrix...</p>
        </div>
    );

    const revenueTrends = stats?.revenue?.trends || [];
    const orderDistribution = stats?.orders?.byStatus?.map(s => ({
        name: s._id.replace('_', ' ').toUpperCase(),
        value: s.count
    })) || [];
    const peakHours = stats?.peakHours || [];

    const summaryCards = [
        {
            label: 'Cycle Revenue',
            value: formatCurrency(stats?.revenue?.current?.totalRevenue || 0),
            growth: stats?.revenue?.growth?.revenueGrowth || 0,
            icon: Wallet,
            color: 'primary'
        },
        {
            label: 'Order Volume',
            value: stats?.orders?.total || 0,
            growth: stats?.revenue?.growth?.orderGrowth || 0,
            icon: Package,
            color: 'success'
        },
        {
            label: 'Hub Retention',
            value: `${stats?.customers?.retentionRate || 0}%`,
            icon: Users,
            color: 'warning'
        },
        {
            label: 'Completion',
            value: `${stats?.orders?.completionRate || 0}%`,
            icon: CheckCircle2,
            color: 'info'
        }
    ];

    return (
        <PageWrapper
            title="Hub Analytics"
            description={`Operational insights for ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`}
            showBack={true}
        >
            <div className="space-y-8">
                {/* Summary Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {summaryCards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-4 md:p-6 rounded-[24px] md:rounded-[32px] border-neutral-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500 h-full">
                                <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-neutral-50 rounded-full -mr-8 -mt-8 md:-mr-12 md:-mt-12 group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 space-y-4">
                                    <div className={cn(
                                        "p-3 rounded-2xl w-fit",
                                        card.color === 'primary' ? "bg-primary-50 text-primary-600" :
                                            card.color === 'success' ? "bg-success-50 text-success-600" :
                                                card.color === 'warning' ? "bg-warning-50 text-warning-600" :
                                                    "bg-info-50 text-info-600"
                                    )}>
                                        <card.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{card.label}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{card.value}</h3>
                                            {card.growth !== undefined && (
                                                <div className={cn(
                                                    "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-lg",
                                                    card.growth >= 0 ? "text-success-600 bg-success-50" : "text-error-600 bg-error-50"
                                                )}>
                                                    {card.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                    {Math.abs(card.growth)}%
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Revenue Matrix */}
                    <Card className="lg:col-span-2 p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-neutral-100 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-primary-100/20 blur-[60px] md:blur-[100px] rounded-full -mr-24 -mt-24 md:-mr-32 md:-mt-32" />
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight leading-none mb-1">Revenue Matrix</h3>
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Growth & Trend Analysis</p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge className="bg-primary-50 text-primary-600 border-none font-black italic rounded-lg">LIVE FEED</Badge>
                                </div>
                            </div>

                            <div className="flex-1 h-[250px] md:h-[350px]">
                                {revenueTrends.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueTrends}>
                                            <defs>
                                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                                tickFormatter={(str) => new Date(str).toLocaleDateString('default', { day: 'numeric', month: 'short' })}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                                tickFormatter={(val) => `₦${val / 1000}k`}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                                formatter={(val: number) => [formatCurrency(val), 'Revenue']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#0ea5e9"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#colorAmount)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-neutral-300 gap-4">
                                        <TrendingUp className="w-12 h-12" />
                                        <p className="font-bold uppercase tracking-widest text-[10px]">Awaiting Transaction Data</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Operational Load */}
                    <Card className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-neutral-100 shadow-xl bg-neutral-900 text-white flex flex-col">
                        <div className="mb-8">
                            <h3 className="text-xl md:text-2xl font-black tracking-tight leading-none mb-1">Order Pipeline</h3>
                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Operational Load Balance</p>
                        </div>

                        <div className="flex-1 flex items-center justify-center h-[200px]">
                            {orderDistribution.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={orderDistribution}
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                            cornerRadius={8}
                                        >
                                            {orderDistribution.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', color: '#000' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center space-y-2">
                                    <ShoppingBag className="w-8 h-8 mx-auto text-neutral-700" />
                                    <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest leading-relaxed">No active pipeline missions</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 space-y-3">
                            {orderDistribution.map((item, i) => (
                                <div key={item.name} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="text-xs font-bold text-neutral-400 transition-colors group-hover:text-white uppercase tracking-tighter">
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-black italic">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Peak Demand Matrix */}
                <Card className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-neutral-100 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="p-2 md:p-3 bg-neutral-50 rounded-xl md:rounded-2xl">
                                <Clock className="w-5 h-5 md:w-6 md:h-6 text-neutral-400" />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight leading-none mb-1">Peak Demand Spectrum</h3>
                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Hourly Force Multiplier</p>
                            </div>
                        </div>
                        <Badge className="w-fit bg-warning-50 text-warning-600 border-none font-black italic px-4 py-1.5 rounded-full">OPTIMIZED VIEW</Badge>
                    </div>

                    <div className="h-[250px] md:h-[300px]">
                        {peakHours.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={peakHours}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="hourLabel"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc', radius: 12 }}
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar
                                        dataKey="orderCount"
                                        fill="#0ea5e9"
                                        radius={[12, 12, 12, 12]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-neutral-300 uppercase font-black text-[10px] tracking-[0.3em]">
                                Awaiting temporal data feed
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </PageWrapper>
    );
};

export default BranchAnalyticsPage;
