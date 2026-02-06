import React, { useState, useEffect } from 'react';
import { tasksService } from '@/services/tasks.service';
import { TaskStatus, TaskPriority } from '@/types/task.types';
import type { Task } from '@/types/task.types';
import { ClipboardList, Plus, Clock, AlertCircle, Filter, Search, User as UserIcon, MapPin, ArrowRight, Navigation, CheckCircle2 } from 'lucide-react';
import { Button, Badge, Spinner, Input, Card } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { format } from 'date-fns';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { TaskDetailsModal } from '@/components/tasks/TaskDetailsModal';
import { useComponentLogger } from '@/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const AdminTasksPage: React.FC = () => {
    useComponentLogger('AdminTasksPage');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await tasksService.getTasks();
            if (response.success) {
                setTasks(response.data.tasks);
            }
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityVariant = (priority: TaskPriority) => {
        switch (priority) {
            case 'critical': return 'error';
            case 'high': return 'warning';
            case 'medium': return 'info';
            default: return undefined;
        }
    };

    const filteredTasks = tasks.filter(t => {
        const matchesSearch =
            t.order?.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
            t.address.street.toLowerCase().includes(search.toLowerCase()) ||
            (typeof t.assignedTo !== 'string' && t.assignedTo?.name?.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const stats = {
        pending: tasks.filter(t => t.status === 'pending').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        critical: tasks.filter(t => t.priority === 'critical').length,
        completed: tasks.filter(t => t.status === 'completed').length
    };

    return (
        <PageWrapper
            title="Operational Matrix"
            description="Strategic overwatch of all field missions"
            action={
                <Button onClick={() => setIsCreateModalOpen(true)} className="rounded-2xl h-12 px-8 font-black shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all text-xs uppercase tracking-widest">
                    <Plus className="w-4 h-4 mr-3" />
                    Initiate Mission
                </Button>
            }
        >
            <div className="space-y-10">
                {/* Command Dashboard */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Pending Dispatch', count: stats.pending, color: 'text-warning', bg: 'bg-warning/5', icon: Clock, trend: 'QUEUE' },
                        { label: 'Live Missions', count: stats.in_progress, color: 'text-primary', bg: 'bg-primary/5', icon: Navigation, trend: 'ACTIVE' },
                        { label: 'Critical Alert', count: stats.critical, color: 'text-destructive', bg: 'bg-destructive/5', icon: AlertCircle, trend: 'HIGHEST' },
                        { label: 'Mission Success', count: stats.completed, color: 'text-success', bg: 'bg-success/5', icon: CheckCircle2, trend: 'VERIFIED' }
                    ].map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={stat.label}
                        >
                            <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                                <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -mr-12 -mt-12 transition-colors", stat.bg)} />
                                <div className="relative z-10 flex flex-col gap-6">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform", stat.bg)}>
                                        <stat.icon className={cn("w-7 h-7", stat.color)} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                                        <div className="flex items-end justify-between">
                                            <h4 className="text-3xl font-black text-foreground tracking-tighter italic leading-none">{stat.count}</h4>
                                            <Badge className="bg-muted text-muted-foreground/60 border-none font-black text-[8px] tracking-tighter uppercase rounded-full px-2 py-0.5">{stat.trend}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Tactical Overlays */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Search mission or rider..."
                            leftIcon={<Search className="w-5 h-5 text-muted-foreground" />}
                            className="bg-card border-border rounded-2xl shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex p-2 bg-muted rounded-[28px] border border-border shadow-inner overflow-x-auto no-scrollbar scroll-smooth">
                        {['all', 'pending', 'assigned', 'in_progress', 'completed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f as any)}
                                className={cn(
                                    "px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap",
                                    statusFilter === f
                                        ? "bg-card text-primary shadow-md"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mission Feed */}
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-32 gap-6"
                            >
                                <Spinner size="lg" className="text-primary" />
                                <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] animate-pulse">Syncing Tactical Grid...</p>
                            </motion.div>
                        ) : filteredTasks.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Card className="py-24 rounded-[48px] border-border border-dashed border-2 text-center shadow-inner bg-muted/20">
                                    <div className="w-24 h-24 bg-card rounded-[40px] shadow-sm flex items-center justify-center mx-auto mb-8 border border-border">
                                        <ClipboardList className="w-12 h-12 text-muted-foreground/20" />
                                    </div>
                                    <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter">Grid Clear</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-2">No missions detected in the sector</p>
                                </Card>
                            </motion.div>
                        ) : (
                            <div className="grid gap-6">
                                {filteredTasks.map((task, i) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={task._id}
                                    >
                                        <Card className="p-8 rounded-[40px] border-border bg-card hover:border-primary/50 hover:shadow-2xl transition-all group overflow-hidden relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -mr-16 -mt-16" />
                                            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">

                                                <div className="flex items-center gap-8">
                                                    {/* Mission Type Icon */}
                                                    <div className={cn(
                                                        "w-16 h-16 md:w-20 md:h-20 rounded-[28px] flex items-center justify-center shadow-lg transition-all group-hover:scale-110 shrink-0",
                                                        task.type === 'pickup'
                                                            ? "bg-info/20 text-info shadow-info/10"
                                                            : "bg-success/20 text-success shadow-success/10"
                                                    )}>
                                                        <Navigation className="w-8 h-8 md:w-10 md:h-10" />
                                                    </div>

                                                    {/* Mission Intel */}
                                                    <div className="space-y-3 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-4">
                                                            <h3 className="text-xl md:text-2xl font-black italic tracking-tighter leading-none group-hover:text-primary transition-colors">#{task.order?.orderNumber}</h3>
                                                            <Badge className={cn("rounded-full px-4 py-1.5 font-black uppercase text-[10px] tracking-widest border-none italic",
                                                                task.type === 'pickup' ? "bg-info/10 text-info" : "bg-success/10 text-success"
                                                            )}>
                                                                {task.type}
                                                            </Badge>
                                                            <Badge variant={getPriorityVariant(task.priority)} className="rounded-full px-4 py-1.5 font-black uppercase text-[10px] tracking-widest border-none shadow-sm">
                                                                {task.priority || 'standard'}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-muted-foreground/30" />
                                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight truncate max-w-[200px]">{task.address.street}, {task.address.city}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 sm:border-l sm:border-border sm:pl-6">
                                                                <Clock className="w-4 h-4 text-primary/40" />
                                                                <span className="text-[10px] font-black text-primary italic uppercase tracking-wider">EST. {format(new Date(task.scheduledFor), 'HH:mm')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Operative & Phase */}
                                                <div className="flex items-center justify-between xl:justify-end gap-10 xl:border-l xl:border-border xl:pl-10">
                                                    <div className="flex flex-col items-start xl:items-end min-w-[140px]">
                                                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mb-2 italic">Assigned Unit</p>
                                                        {task.assignedTo && typeof task.assignedTo !== 'string' ? (
                                                            <div className="flex items-center gap-4">
                                                                <div className="text-right hidden sm:block">
                                                                    <p className="text-xs font-black italic leading-none text-foreground uppercase truncate max-w-[120px]">{(task.assignedTo as any).name}</p>
                                                                    <p className="text-[8px] font-black text-primary uppercase mt-1 tracking-[0.2em]">Live Tracking</p>
                                                                </div>
                                                                <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center font-black text-primary text-xs shadow-inner">
                                                                    {(task.assignedTo as any).name?.charAt(0)}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <Badge variant="secondary" className="rounded-xl border-dashed border-2 border-warning/30 bg-warning/5 text-warning font-black text-[10px] px-4 py-1.5">UNASSIGNED</Badge>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col items-center px-8 border-x border-border min-w-[140px]">
                                                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mb-2 italic">Phase</p>
                                                        <Badge
                                                            className={cn("rounded-full px-6 py-2 font-black italic shadow-sm text-[10px] uppercase tracking-widest border-none",
                                                                task.status === 'completed' ? "bg-success/10 text-success" :
                                                                    task.status === 'in_progress' ? "bg-primary/20 text-primary" :
                                                                        task.status === 'pending' ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground/60"
                                                            )}
                                                        >
                                                            {task.status.replace('_', ' ')}
                                                        </Badge>
                                                    </div>

                                                    <Button
                                                        className="w-14 h-14 rounded-2xl p-0 font-black shadow-xl shadow-primary/20 hover:scale-110 transition-transform shrink-0"
                                                        onClick={() => {
                                                            setSelectedTask(task);
                                                            setIsDetailsModalOpen(true);
                                                        }}
                                                    >
                                                        <ArrowRight className="w-6 h-6" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PageWrapper>
    );
};

export default AdminTasksPage;
