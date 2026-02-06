import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analytics.service';
import type { DashboardStats } from '../../types/analytics.types';
import {
    TrendingUp, Users, ShoppingBag, Truck, CheckCircle2,
    Calendar, Clock, Wallet, ArrowUpRight, ArrowDownRight, Package, Zap, BarChart3, RefreshCw
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { PageWrapper } from '@/components/layout';
import { Card, Badge, Spinner, Button } from '@/components/ui';
import { formatCurrency, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="relative">
                <Spinner size="lg" className="text-primary" />
                <div className="absolute inset-0 bg-primary/10 blur-2xl animate-pulse rounded-full" />
            </div>
            <p className="text-sm font-black text-muted-foreground/60 uppercase tracking-[0.2em] animate-pulse">Synchronizing Data Matrix...</p>
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
            color: 'primary',
            bg: 'bg-primary/10'
        },
        {
            label: 'Order Volume',
            value: stats?.orders?.total || 0,
            growth: stats?.revenue?.growth?.orderGrowth || 0,
            icon: Package,
            color: 'success',
            bg: 'bg-success/10'
        },
        {
            label: 'Hub Retention',
            value: `${stats?.customers?.retentionRate || 0}%`,
            icon: Users,
            color: 'warning',
            bg: 'bg-warning/10'
        },
        {
            label: 'Completion',
            value: `${stats?.orders?.completionRate || 0}%`,
            icon: CheckCircle2,
            color: 'info',
            bg: 'bg-info/10'
        }
    ];

    return (
        <PageWrapper
            title="Hub Analytics"
            description={`Operational intelligence for the current sector cycle`}
            showBack={true}
            action={
                <Button
                    variant="outline"
                    className="rounded-2xl h-12 px-6 font-black border-border bg-card shadow-sm text-[10px] uppercase tracking-widest"
                    onClick={fetchAnalytics}
                >
                    <RefreshCw className="w-4 h-4 mr-2 text-primary" />
                    Refresh Matrix
                </Button>
            }
        >
            <div className="space-y-10">
                {/* Tactical Summary Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {summaryCards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                                <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -mr-12 -mt-12 transition-transform group-hover:scale-150", card.bg)} />
                                <div className="relative z-10 space-y-6">
                                    <div className={cn(
                                        "p-4 rounded-2xl w-fit shadow-inner",
                                        card.color === 'primary' ? "bg-primary/10 text-primary" :
                                            card.color === 'success' ? "bg-success/10 text-success" :
                                                card.color === 'warning' ? "bg-warning/10 text-warning" :
                                                    "bg-info/10 text-info"
                                    )}>
                                        <card.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 italic">{card.label}</p>
                                        <div className="flex items-baseline justify-between">
                                            <h3 className="text-3xl font-black text-foreground tracking-tighter italic leading-none">{card.value}</h3>
                                            {card.growth !== undefined && (
                                                <div className={cn(
                                                    "flex items-center text-[10px] font-black px-2 py-1 rounded-full",
                                                    card.growth >= 0 ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
                                                )}>
                                                    {card.growth >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
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

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Revenue Spectrometry */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="p-8 rounded-[48px] border-border bg-card shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-primary/10 transition-colors" />
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-sm">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-foreground tracking-tight italic uppercase">Revenue Matrix</h3>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-1">Growth & Trend Analysis Feed</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-primary/10 text-primary border-none font-black italic rounded-full px-4 py-1 text-[9px] tracking-widest uppercase shadow-sm">Real-time Feed</Badge>
                                </div>

                                <div className="flex-1 h-[350px]">
                                    {revenueTrends.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={revenueTrends}>
                                                <defs>
                                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                                <XAxis
                                                    dataKey="date"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }}
                                                    tickFormatter={(str) => new Date(str).toLocaleDateString('default', { day: 'numeric', month: 'short' }).toUpperCase()}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }}
                                                    tickFormatter={(val) => `₦${val / 1000}K`}
                                                />
                                                <Tooltip
                                                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '5 5' }}
                                                    contentStyle={{ borderRadius: '24px', border: '1px solid hsl(var(--border))', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', backgroundColor: 'hsl(var(--card))', padding: '16px' }}
                                                    labelStyle={{ fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', color: 'hsl(var(--muted-foreground))' }}
                                                    labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                                    formatter={(val: number) => [formatCurrency(val), 'Tactical Revenue']}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="amount"
                                                    stroke="#0ea5e9"
                                                    strokeWidth={6}
                                                    fillOpacity={1}
                                                    fill="url(#colorAmount)"
                                                    animationDuration={2000}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-6">
                                            <div className="w-20 h-20 bg-muted rounded-[32px] flex items-center justify-center shadow-inner">
                                                <TrendingUp className="w-10 h-10" />
                                            </div>
                                            <p className="font-black uppercase tracking-[0.3em] text-[10px]">Awaiting Transaction Artifacts</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Operational Pipeline */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card className="p-8 rounded-[48px] border-border bg-card shadow-2xl flex flex-col h-full relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-48 h-48 bg-muted/50 blur-[80px] rounded-full -ml-24 -mt-24" />
                            <div className="mb-10 relative z-10">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 bg-muted rounded-2xl text-primary shadow-sm">
                                        <ShoppingBag className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-black text-foreground tracking-tight italic uppercase leading-none">Pipeline</h3>
                                </div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Operational Load Spectrum</p>
                            </div>

                            <div className="flex-1 flex items-center justify-center h-[250px] relative z-10">
                                {orderDistribution.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={orderDistribution}
                                                innerRadius={75}
                                                outerRadius={105}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                                cornerRadius={12}
                                            >
                                                {orderDistribution.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '20px', border: 'none', backgroundColor: 'hsl(var(--card))', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                                                itemStyle={{ fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 bg-muted rounded-[24px] flex items-center justify-center mx-auto shadow-inner">
                                            <ShoppingBag className="w-8 h-8 text-muted-foreground/20" />
                                        </div>
                                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Flux Corridor Empty</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-10 space-y-4 relative z-10">
                                {orderDistribution.map((item, i) => (
                                    <div key={item.name} className="flex items-center justify-between group/item p-3 rounded-2xl hover:bg-muted transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            <span className="text-[10px] font-black text-muted-foreground group-hover/item:text-foreground transition-colors uppercase tracking-widest">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="text-base font-black italic text-foreground leading-none">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Peak Demand Spectrum */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="p-8 md:p-12 rounded-[56px] border-border bg-card shadow-2xl relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mb-48" />
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-muted rounded-3xl text-primary shadow-inner group-hover:rotate-6 transition-transform">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-foreground tracking-tight italic uppercase leading-none mb-2">Peak Demand Spectrum</h3>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Temporal Force Multiplier Analysis</p>
                                </div>
                            </div>
                            <Badge className="w-fit bg-warning/10 text-warning border-none font-black italic px-6 py-2 rounded-full text-[10px] tracking-[0.2em] shadow-sm uppercase">Optimized Spatial View</Badge>
                        </div>

                        <div className="h-[300px] md:h-[350px] relative z-10">
                            {peakHours.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={peakHours}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                        <XAxis
                                            dataKey="hourLabel"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'hsl(var(--muted) / 0.3)', radius: 16 }}
                                            contentStyle={{ borderRadius: '24px', border: '1px solid hsl(var(--border))', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', backgroundColor: 'hsl(var(--card))', padding: '16px' }}
                                            itemStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
                                        />
                                        <Bar
                                            dataKey="orderCount"
                                            fill="#0ea5e9"
                                            radius={[16, 16, 16, 16]}
                                            barSize={48}
                                            animationDuration={1500}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-6">
                                    <div className="w-20 h-20 bg-muted rounded-[32px] flex items-center justify-center shadow-inner animate-pulse">
                                        <BarChart3 className="w-10 h-10" />
                                    </div>
                                    <p className="font-black uppercase tracking-[0.4em] text-[10px]">Awaiting Temporal Flux Feed</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </PageWrapper>
    );
};

export default BranchAnalyticsPage;
