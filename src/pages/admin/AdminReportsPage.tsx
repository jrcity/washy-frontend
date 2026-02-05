import React, { useState, useEffect } from 'react';
import { analyticsService } from '@/services/analytics.service';
import type { DashboardStats } from '@/types/analytics.types';
import {
    Download,
    Calendar,
    TrendingUp,
    Users,
    ShoppingBag,
    Truck,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCcw,
    PieChart as PieIcon,
    BarChart3,
    CheckCircle2
} from 'lucide-react';
import { Button, Card, Spinner, Badge } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { formatCurrency, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export const AdminReportsPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const data = await analyticsService.getDashboardStats();
            setStats(data || null);
        } catch (error) {
            console.error('Failed to fetch analytics', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            // In a real app, this would trigger a download
        }, 1500);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Spinner size="lg" className="text-primary-600" />
                <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest animate-pulse">
                    Synthesizing Market Data...
                </p>
            </div>
        );
    }

    // Chart Preparations
    const revenueTrends = stats?.revenue?.trends || [];

    const statusData = stats?.orders?.byStatus.map(s => ({
        name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
        value: s.count
    })) || [];

    const peakHoursData = stats?.peakHours || [];

    const COLORS = ['#84cc16', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <PageWrapper
            title="Intelligence Board"
            description={`Live Feed: Data synced ${format(new Date(), 'HH:mm')}`}
            showBack={true}
            action={
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-neutral-200 bg-white">
                        <Calendar className="w-4 h-4 mr-2" />
                        {stats?.revenue?.period.toUpperCase() || 'MONTHLY'}
                    </Button>
                    <Button
                        onClick={handleExport}
                        isLoading={isExporting}
                        className="rounded-2xl h-12 px-6 shadow-xl shadow-primary-200 font-extrabold"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Insights
                    </Button>
                    <button
                        onClick={fetchAnalytics}
                        className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-primary-600 transition-all active:rotate-180"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>
                </div>
            }
        >
            <div className="space-y-8">

                {/* Core Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            label: 'Gross Revenue',
                            value: formatCurrency(stats?.revenue?.current?.totalRevenue || 0),
                            growth: stats?.revenue?.growth?.revenueGrowth || 0,
                            icon: TrendingUp,
                            color: 'text-success-600',
                            bg: 'bg-success-50'
                        },
                        {
                            label: 'Order Volume',
                            value: stats?.orders?.total || 0,
                            growth: stats?.revenue?.growth?.orderGrowth || 0,
                            icon: ShoppingBag,
                            color: 'text-primary-600',
                            bg: 'bg-primary-50'
                        },
                        {
                            label: 'Customer Base',
                            value: stats?.customers?.totalCustomers || 0,
                            growth: 0, // Simplified for now
                            icon: Users,
                            color: 'text-info-600',
                            bg: 'bg-info-50'
                        },
                        {
                            label: 'Completion',
                            value: `${stats?.orders?.completionRate || '0.0'}%`,
                            growth: 0,
                            icon: CheckCircle2,
                            color: 'text-warning-600',
                            bg: 'bg-warning-50'
                        }
                    ].map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={stat.label}
                        >
                            <Card className="p-6 rounded-[32px] border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-primary-500/5 transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                                            <stat.icon className={cn("w-5 h-5", stat.color)} />
                                        </div>
                                        <Badge size="sm" variant={stat.growth >= 0 ? 'success' : 'error'} className="rounded-lg font-black italic">
                                            {stat.growth >= 0 ? `+${stat.growth}%` : `${stat.growth}%`}
                                            {stat.growth >= 0 ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
                                        </Badge>
                                    </div>
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-black text-neutral-900 leading-tight tracking-tight">{stat.value}</h3>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Performance Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Momentum Chart */}
                    <Card className="lg:col-span-2 p-8 rounded-[40px] border-neutral-100 shadow-xl overflow-hidden relative h-[500px]">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <h3 className="text-xl font-black text-neutral-900 tracking-tight">Revenue Momentum</h3>
                                <p className="text-sm font-medium text-neutral-400">Transaction volume and growth trends</p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="info" className="rounded-full px-4 py-1 font-bold">REAL-TIME</Badge>
                            </div>
                        </div>

                        <div className="h-[340px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueTrends.length > 0 ? revenueTrends : Array.from({ length: 10 }).map((_, i) => ({ date: `2024-01-${i + 1}`, amount: 0 }))}>
                                    <defs>
                                        <linearGradient id="momentumGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#84cc16" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(str) => format(new Date(str), 'MMM d')}
                                        stroke="#d1d5db"
                                        fontSize={10}
                                        fontWeight={700}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#d1d5db"
                                        fontSize={10}
                                        fontWeight={700}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => `₦${val / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                        formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#84cc16"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#momentumGradient)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Gradient Background Decoration */}
                        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-primary-500/5 blur-[100px] rounded-full -mr-20 -mb-20" />
                    </Card>

                    {/* Status Distribution */}
                    <Card className="p-8 rounded-[40px] border-neutral-100 shadow-xl overflow-hidden h-[500px]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-neutral-900 tracking-tight">Status Mix</h3>
                                <p className="text-sm font-medium text-neutral-400">Order lifecycle distribution</p>
                            </div>
                            <PieIcon className="w-5 h-5 text-neutral-300" />
                        </div>

                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData.length > 0 ? statusData : [{ name: 'Empty', value: 1 }]}
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        cornerRadius={8}
                                        dataKey="value"
                                        animationDuration={1500}
                                    >
                                        {statusData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                        {statusData.length === 0 && <Cell fill="#f3f4f6" />}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {statusData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{entry.name}</span>
                                    <span className="text-[10px] font-black text-neutral-900 ml-auto">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* In-depth Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Peak Hours Insights */}
                    <Card className="p-8 rounded-[40px] border-neutral-100 shadow-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-neutral-900 tracking-tight">Peak Demand</h3>
                                <p className="text-sm font-medium text-neutral-400">Synchronized hourly heat-map</p>
                            </div>
                            <BarChart3 className="w-5 h-5 text-neutral-300" />
                        </div>

                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={peakHoursData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="hourLabel"
                                        stroke="#d1d5db"
                                        fontSize={10}
                                        fontWeight={700}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="#d1d5db"
                                        fontSize={10}
                                        fontWeight={700}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                                    <Bar dataKey="orderCount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Customer Retention Metrics */}
                    <Card className="p-8 rounded-[40px] border-neutral-100 shadow-xl bg-neutral-900 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 blur-[80px] rounded-full -mr-20 -mt-20" />

                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight">Loyalty Matrix</h3>
                                    <p className="text-sm font-medium text-neutral-500">Retention and repeat-session analytics</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
                                    <Users className="w-5 h-5 text-primary-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-12 flex-1">
                                <div>
                                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">Retention Force</p>
                                    <div className="space-y-4">
                                        <div className="text-5xl font-black italic tracking-tighter text-primary-400">
                                            {stats?.customers?.retentionRate || 0}%
                                        </div>
                                        <div className="w-full h-1 bg-white/10 rounded-full">
                                            <div className="h-full bg-primary-500 rounded-full" style={{ width: `${stats?.customers?.retentionRate || 0}%` }} />
                                        </div>
                                        <p className="text-xs font-medium text-neutral-400 leading-relaxed">
                                            Calculated based on {stats?.customers?.retainedCustomers} retained users vs previous period.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">Repeat Engagement</p>
                                    <div className="space-y-4">
                                        <div className="text-5xl font-black italic tracking-tighter text-info-400">
                                            {stats?.customers?.repeatCustomerRate || '0.00'}%
                                        </div>
                                        <div className="w-full h-1 bg-white/10 rounded-full">
                                            <div className="h-full bg-info-500 rounded-full" style={{ width: `${parseFloat(stats?.customers?.repeatCustomerRate || '0.00')}%` }} />
                                        </div>
                                        <p className="text-xs font-medium text-neutral-400 leading-relaxed">
                                            {stats?.customers?.repeatCustomerCount} power-users with 2+ orders this cycle.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-neutral-500" />
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Prediction Model</span>
                                </div>
                                <Badge variant="success" className="bg-primary-500/20 text-primary-400 border-none font-black italic">BULLISH</Badge>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </PageWrapper>
    );
};

export default AdminReportsPage;
