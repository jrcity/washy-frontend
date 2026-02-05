import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MapPin, ChevronLeft, Edit, Users, Package, TrendingUp, Clock, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Button, Card, Badge, Spinner } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { branchesService } from '@/services/branches.service';
import { formatCurrency, cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Branch } from '@/types/branch.types';

export const AdminBranchDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [branch, setBranch] = useState<Branch | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBranch = async () => {
            try {
                const data = await branchesService.getById(id!);
                setBranch(data);
            } catch (error) {
                console.error('Failed to load branch', error);
                navigate('/admin/branches');
            } finally {
                setLoading(false);
            }
        };
        fetchBranch();
    }, [id, navigate]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Spinner size="lg" className="text-primary-600" />
            <p className="text-sm font-black text-neutral-400 uppercase tracking-widest animate-pulse">Syncing Operational Data...</p>
        </div>
    );

    if (!branch) return null;

    const stats = [
        { label: 'Total Volume', value: branch.metrics.totalOrders, icon: Package, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Gross Revenue', value: formatCurrency(branch.metrics.totalRevenue), icon: TrendingUp, color: 'text-success-600', bg: 'bg-success-50' },
        { label: 'Customer Trust', value: `${branch.metrics.averageRating}/5`, icon: ShieldCheck, color: 'text-warning-600', bg: 'bg-warning-50' },
        { label: 'Staff Count', value: branch.staff.length, icon: Users, color: 'text-info-600', bg: 'bg-info-50' },
    ];

    return (
        <PageWrapper
            title={branch.name}
            description={`Code: ${branch.code} • ${branch.address.city}, ${branch.address.state}`}
            showBack={true}
        >
            <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4">
                    <div className="flex gap-3">
                        <Link to={`/admin/branches/edit/${branch._id}`} className="flex-1 sm:flex-none">
                            <Button className="w-full rounded-2xl h-12 px-6 font-black shadow-xl shadow-primary-500/10">
                                <Edit className="w-4 h-4 mr-2" />
                                Reconfigure
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-4 md:p-6 rounded-[24px] md:rounded-[32px] border-neutral-100 shadow-sm relative overflow-hidden group h-full">
                                <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 bg-neutral-50 rounded-full -mr-6 -mt-6 md:-mr-8 md:-mt-8 transition-transform group-hover:scale-150" />
                                <div className="relative z-10 space-y-4">
                                    <div className={cn("p-2.5 rounded-xl w-fit", stat.bg)}>
                                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{stat.value}</h3>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Location & Contact */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-neutral-100 shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-primary-100/20 blur-[60px] md:blur-[80px] rounded-full -mr-24 -mt-24 md:-mr-32 md:-mt-32" />
                            <div className="relative z-10 space-y-6 md:space-y-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">Deployment Zone</h3>
                                        <p className="text-xs md:text-sm font-medium text-neutral-400">Headquarters & Service Area</p>
                                    </div>
                                    <Badge variant={branch.isActive ? 'success' : 'error'} className="w-fit rounded-full px-4 py-1.5 font-black italic">
                                        {branch.isActive ? 'OPERATIONAL' : 'DECOMMISSIONED'}
                                    </Badge>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
                                    <div className="space-y-6">
                                        <div className="flex gap-3 md:gap-4">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-neutral-50 flex items-center justify-center shrink-0">
                                                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-neutral-400" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] md:text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Base Address</p>
                                                <p className="text-base md:text-lg font-bold text-neutral-900 leading-tight">
                                                    {branch.address.street},<br />
                                                    {branch.address.area && `${branch.address.area}, `}{branch.address.city}, {branch.address.state}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center shrink-0">
                                                <ShieldCheck className="w-6 h-6 text-neutral-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Coverage Strength</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {branch.coverageZones.map(zone => (
                                                        <Badge key={zone.name} variant="info" className="rounded-lg border-neutral-200 text-neutral-600 font-bold">
                                                            {zone.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex gap-3 md:gap-4">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-neutral-50 flex items-center justify-center shrink-0">
                                                <Phone className="w-5 h-5 md:w-6 md:h-6 text-neutral-400" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] md:text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Direct Hotline</p>
                                                <p className="text-base md:text-lg font-bold text-neutral-900">{branch.contactPhone}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 md:gap-4">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-neutral-50 flex items-center justify-center shrink-0">
                                                <Mail className="w-5 h-5 md:w-6 md:h-6 text-neutral-400" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] md:text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Command Email</p>
                                                <p className="text-base md:text-lg font-bold text-neutral-900 break-all">{branch.contactEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Capacity Stats */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="p-8 rounded-[40px] border-neutral-100 shadow-xl bg-neutral-900 text-white">
                                <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-6">Daily Capacity Load</h4>
                                <div className="space-y-6">
                                    <div className="flex items-end justify-between">
                                        <div className="text-5xl font-black italic tracking-tighter text-primary-400">
                                            {branch.capacity.currentDailyOrders}
                                            <span className="text-xl text-neutral-600 not-italic ml-2">/ {branch.capacity.dailyOrderLimit}</span>
                                        </div>
                                        <Badge variant="success" className="bg-primary-500/20 text-primary-400 border-none font-black text-[10px]">ON TRACK</Badge>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-500"
                                            style={{ width: `${(branch.capacity.currentDailyOrders / branch.capacity.dailyOrderLimit) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs font-medium text-neutral-400">Current active missions processed by this hub today.</p>
                                </div>
                            </Card>

                            <Card className="p-8 rounded-[40px] border-neutral-100 shadow-xl">
                                <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-6">Service Window</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-neutral-300" />
                                        <span className="text-sm font-black text-neutral-900">WEEKDAYS</span>
                                        <span className="text-sm font-bold text-primary-600 ml-auto">{branch.operatingHours.monday.open} - {branch.operatingHours.monday.close}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-neutral-300" />
                                        <span className="text-sm font-black text-neutral-900">WEEKENDS</span>
                                        <span className="text-sm font-bold text-primary-600 ml-auto">{branch.operatingHours.saturday.open} - {branch.operatingHours.saturday.close}</span>
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Zone Status</span>
                                        <Badge variant="success" className="rounded-lg">OPEN NOW</Badge>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Operational Leadership */}
                    <div className="space-y-6">
                        <Card className="p-8 rounded-[36px] bg-neutral-50 border-neutral-100 shadow-sm">
                            <h3 className="text-xl font-black text-neutral-900 tracking-tight mb-8">Base Commander</h3>
                            {typeof branch.manager === 'object' ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-3xl bg-white border-2 border-primary-100 flex items-center justify-center text-2xl font-black text-primary-600 shadow-sm">
                                            {branch.manager.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-neutral-900 text-lg leading-tight">{branch.manager.name}</p>
                                            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mt-1">Operational Head</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 pt-6 border-t border-neutral-200">
                                        <div className="flex items-center gap-3 text-sm font-medium text-neutral-500">
                                            <Mail className="w-4 h-4" />
                                            {branch.manager.email}
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full rounded-2xl h-12 font-black border-neutral-200 bg-white">
                                        Relieve Commander
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-8 space-y-4">
                                    <div className="w-16 h-16 rounded-3xl bg-neutral-100 flex items-center justify-center mx-auto">
                                        <Users className="w-8 h-8 text-neutral-300" />
                                    </div>
                                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">No Manager Assigned</p>
                                    <Link to={`/admin/branches/edit/${branch._id}`}>
                                        <Button className="w-full rounded-2xl h-12 font-black shadow-xl shadow-primary-500/10">
                                            Appoint Commander
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </Card>

                        <Card className="p-8 rounded-[36px] border-neutral-100 shadow-sm">
                            <h3 className="text-xl font-black text-neutral-900 tracking-tight mb-6">Staff Roster</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                                    <span className="text-sm font-black text-neutral-900">Active Staff</span>
                                    <span className="text-lg font-black text-primary-600">{branch.staff.length}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                                    <span className="text-sm font-black text-neutral-900">Rider Unit</span>
                                    <span className="text-lg font-black text-info-600">{branch.riders.length}</span>
                                </div>
                                <p className="text-xs font-medium text-neutral-400 italic text-center">
                                    Staff assignments are managed through the User Matrix.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default AdminBranchDetailsPage;
