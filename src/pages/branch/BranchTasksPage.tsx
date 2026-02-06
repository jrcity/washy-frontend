import React, { useState, useEffect } from 'react';
import { tasksService } from '@/services/tasks.service';
import { TaskStatus, TaskPriority } from '@/types/task.types';
import type { Task } from '@/types/task.types';
import {
    ClipboardList, Plus, CheckCircle2, MapPin, Navigation,
    Clock, Search, Filter, ArrowRight, UserPlus,
    Zap, AlertCircle, RefreshCw, MoreHorizontal
} from 'lucide-react';
import { Button, Badge, Spinner, Card } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { TaskDetailsModal } from '@/components/tasks/TaskDetailsModal';
import { useComponentLogger } from '@/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export const BranchTasksPage: React.FC = () => {
    useComponentLogger('BranchTasksPage');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<string>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async (isManual = false) => {
        if (isManual) setRefreshing(true);
        else setLoading(true);

        try {
            const response = await tasksService.getTasks();
            if (response.success) {
                setTasks(response.data.tasks);
            }
        } catch (error) {
            console.error('Failed to fetch tasks', error);
            toast.error('Failed to sync dispatch data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filteredTasks = tasks.filter(t => {
        if (filter === 'all') return true;
        return t.status === filter;
    });

    const activeMissions = tasks.filter(t => t.status === 'in_progress').length;
    const pendingDispatch = tasks.filter(t => t.status === 'pending').length;

    return (
        <PageWrapper
            title="Dispatch Control"
            description="Strategic management of operational missions"
            action={
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={() => fetchTasks(true)}
                        className="rounded-2xl h-12 w-12 p-0 border-border bg-card shrink-0 shadow-sm"
                        isLoading={refreshing}
                    >
                        {!refreshing && <RefreshCw className="w-5 h-5 text-foreground" />}
                    </Button>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="rounded-2xl h-12 px-8 font-black shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all text-xs uppercase tracking-widest"
                    >
                        <Zap className="w-4 h-4 mr-3 fill-current" />
                        Assign Task
                    </Button>
                </div>
            }
        >
            <div className="space-y-10">
                {/* Command Dashboard */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -mr-12 -mt-12 bg-primary/10 transition-colors" />
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform bg-primary/10">
                                <Zap className="w-7 h-7 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Active Ops</p>
                                <div className="flex items-end justify-between">
                                    <h4 className="text-3xl font-black text-foreground tracking-tighter italic leading-none">{activeMissions}</h4>
                                    <Badge className="bg-muted text-muted-foreground/60 border-none font-black text-[8px] tracking-tighter uppercase rounded-full px-2 py-0.5">Live</Badge>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl relative overflow-hidden group hover:border-warning/30 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -mr-12 -mt-12 bg-warning/5 transition-colors" />
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform bg-warning/5">
                                <AlertCircle className="w-7 h-7 text-warning" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Awaiting Rider</p>
                                <div className="flex items-end justify-between">
                                    <h4 className="text-3xl font-black text-foreground tracking-tighter italic leading-none">{pendingDispatch}</h4>
                                    <Badge className="bg-muted text-muted-foreground/60 border-none font-black text-[8px] tracking-tighter uppercase rounded-full px-2 py-0.5">Queue</Badge>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <div className="col-span-2 flex items-center gap-2 bg-muted p-2 rounded-[32px] border border-border shadow-inner overflow-x-auto no-scrollbar">
                        {['all', 'pending', 'assigned', 'in_progress', 'completed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "flex-1 whitespace-nowrap px-6 py-3 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all",
                                    filter === f ? "bg-card text-primary shadow-md" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tactical Feed */}
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-32 gap-6"
                            >
                                <div className="relative">
                                    <Spinner size="lg" className="text-primary" />
                                    <div className="absolute inset-0 bg-primary/10 blur-2xl animate-pulse rounded-full" />
                                </div>
                                <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] animate-pulse">Scanning Dispatch Matrix...</p>
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
                                    <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter">Operational Zero</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-2">No active missions matching your protocol</p>
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
                                                    {/* Mission Artifact */}
                                                    <div className={cn(
                                                        "w-16 h-16 md:w-20 md:h-20 rounded-[28px] flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:-rotate-3 shrink-0",
                                                        task.type === 'pickup'
                                                            ? "bg-primary/20 text-primary shadow-primary/10"
                                                            : "bg-success/20 text-success shadow-success/10"
                                                    )}>
                                                        <Navigation className="w-8 h-8 md:w-10 md:h-10" />
                                                    </div>

                                                    {/* Mission Dossier */}
                                                    <div className="space-y-3 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-4">
                                                            <h3 className="text-xl md:text-2xl font-black italic tracking-tighter leading-none group-hover:text-primary transition-colors">#{task.order?.orderNumber}</h3>
                                                            <Badge className={cn("rounded-full px-4 py-1.5 font-black uppercase text-[10px] tracking-widest border-none italic",
                                                                task.type === 'pickup' ? "bg-info/10 text-info" : "bg-success/10 text-success"
                                                            )}>
                                                                {task.type}
                                                            </Badge>
                                                            <Badge className={cn("rounded-full px-4 py-1.5 font-black uppercase text-[10px] tracking-widest border-none",
                                                                task.priority === 'critical' ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground/60"
                                                            )}>
                                                                {task.priority || 'standard'}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-3.5 h-3.5 text-muted-foreground/40" />
                                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight truncate">{task.address.area} • {task.address.city}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 sm:border-l sm:border-border sm:pl-6">
                                                                <Clock className="w-3.5 h-3.5 text-primary/60" />
                                                                <span className="text-[10px] font-black text-primary italic uppercase">ETD {format(new Date(task.scheduledFor), 'HH:mm')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Deployment Status */}
                                                <div className="flex items-center justify-between xl:justify-end gap-10 xl:border-l xl:border-border xl:pl-10">
                                                    <div className="flex flex-col items-start xl:items-end min-w-[140px]">
                                                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mb-2 italic">Assigned Operative</p>
                                                        {task.assignedTo ? (
                                                            <div className="flex items-center gap-4">
                                                                <div className="text-right hidden sm:block">
                                                                    <p className="text-xs font-black italic leading-none text-foreground uppercase truncate max-w-[120px]">{(task.assignedTo as any).name || 'Unknown'}</p>
                                                                    <p className="text-[8px] font-black text-success uppercase mt-1 tracking-widest">On Patrol</p>
                                                                </div>
                                                                <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center font-black text-primary text-xs shadow-inner group-hover:scale-105 transition-transform">
                                                                    {(task.assignedTo as any).name?.charAt(0) || 'R'}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="px-5 py-2 rounded-xl border-2 border-dashed border-warning/30 bg-warning/5 text-warning font-black text-[10px] uppercase tracking-widest">
                                                                Unassigned
                                                            </div>
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

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    fetchTasks();
                }}
            />

            <TaskDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedTask(null);
                }}
                task={selectedTask}
            />
        </PageWrapper>
    );
};

export default BranchTasksPage;
