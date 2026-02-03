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
        <div className="max-w-7xl mx-auto space-y-10">
            {/* Command Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight leading-none mb-2">Dispatch Control</h1>
                    <div className="flex items-center gap-3 md:gap-4">
                        <p className="text-neutral-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Strategic Logistics Matrix</p>
                        <Badge variant="primary" className="rounded-full px-3 md:px-4 py-1.5 font-black italic bg-primary-100/50 text-primary-700 border-none shadow-sm text-[9px]">
                            HUB-001 SECTOR
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={() => fetchTasks(true)}
                        className="rounded-2xl h-12 w-12 p-0 border-neutral-100 bg-white shrink-0"
                        isLoading={refreshing}
                    >
                        {!refreshing && <RefreshCw className="w-5 h-5 text-neutral-400" />}
                    </Button>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex-1 sm:flex-none rounded-2xl h-12 px-6 md:px-8 font-black shadow-xl shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 transition-all hover:scale-[1.02] text-sm md:text-base"
                    >
                        <Zap className="w-4 h-4 md:w-5 md:h-5 mr-3 fill-white" />
                        Execute Mission
                    </Button>
                </div>
            </div>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 rounded-[20px] md:rounded-[24px] bg-neutral-900 text-white border-none shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8px] md:text-[9px] font-black text-neutral-500 uppercase tracking-widest truncate">Active Ops</p>
                            <p className="text-lg md:text-xl font-black italic">{activeMissions}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 rounded-[20px] md:rounded-[24px] border-neutral-100 bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-warning-50 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-warning-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8px] md:text-[9px] font-black text-neutral-400 uppercase tracking-widest truncate">Awaiting Rider</p>
                            <p className="text-lg md:text-xl font-black text-neutral-900">{pendingDispatch}</p>
                        </div>
                    </div>
                </Card>
                <div className="col-span-2 flex items-center gap-1.5 md:gap-2 bg-neutral-50 p-1.5 md:p-2 rounded-[24px] md:rounded-[28px] border border-neutral-100 overflow-x-auto no-scrollbar">
                    {['all', 'pending', 'assigned', 'in_progress', 'completed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "flex-1 whitespace-nowrap px-3 md:px-4 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === f ? "bg-white text-primary-600 shadow-sm" : "text-neutral-400 hover:text-neutral-600"
                            )}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task Grid */}
            <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-32 gap-6"
                        >
                            <div className="relative">
                                <Spinner size="lg" className="text-primary-600" />
                                <div className="absolute inset-0 bg-primary-500/10 blur-2xl animate-pulse rounded-full" />
                            </div>
                            <p className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] animate-pulse">Scanning Logistics Grid...</p>
                        </motion.div>
                    ) : filteredTasks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Card className="py-24 rounded-[48px] border-neutral-100 border-dashed border-2 text-center shadow-inner bg-neutral-50/30">
                                <div className="w-24 h-24 bg-white rounded-[40px] shadow-sm flex items-center justify-center mx-auto mb-8 border border-neutral-50">
                                    <ClipboardList className="w-12 h-12 text-neutral-200" />
                                </div>
                                <h3 className="text-2xl font-black text-neutral-900 mb-2">Operational Zero</h3>
                                <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">Currently no active missions matching your filter</p>
                                <div className="mt-8 flex justify-center">
                                    <Button variant="outline" className="rounded-2xl font-black border-neutral-200" onClick={() => setIsCreateModalOpen(true)}>
                                        Initiate Protocol
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ) : (
                        filteredTasks.map((task, i) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={task._id}
                            >
                                <Card className="p-5 md:p-8 rounded-[32px] md:rounded-[40px] border-neutral-100 hover:border-primary-200 hover:shadow-[0_20px_50px_rgba(14,165,233,0.08)] transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/50 rounded-full blur-[60px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 text-neutral-900">

                                        <div className="flex sm:items-center gap-4 md:gap-7">
                                            {/* Tactical Icon */}
                                            <div className={cn(
                                                "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl md:rounded-[30px] flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:-rotate-3 shrink-0",
                                                task.type === 'pickup'
                                                    ? "bg-gradient-to-br from-info-400 to-info-600 text-white shadow-info-200"
                                                    : "bg-gradient-to-br from-success-400 to-success-600 text-white shadow-success-200"
                                            )}>
                                                <Navigation className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" />
                                            </div>

                                            {/* Mission Details */}
                                            <div className="space-y-2 md:space-y-4 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                                    <h3 className="text-lg md:text-2xl font-black italic tracking-tighter leading-none truncate">{task.order?.orderNumber}</h3>
                                                    <Badge variant={task.type === 'pickup' ? 'info' : 'success'} className="rounded-full px-3 md:px-4 py-1 font-black uppercase text-[8px] md:text-[9px] tracking-wider border-none italic">
                                                        {task.type}
                                                    </Badge>
                                                    <Badge variant={task.priority === 'critical' ? 'error' : 'secondary'} className="rounded-full px-3 md:px-4 py-1 font-black uppercase text-[8px] md:text-[9px] tracking-wider border-none">
                                                        {task.priority || 'standard'}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1 bg-neutral-50 rounded-lg"><MapPin className="w-3 h-3 text-neutral-400" /></div>
                                                        <span className="text-[10px] md:text-xs font-black text-neutral-500 uppercase tracking-tighter truncate">{task.address.area} • {task.address.city}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:border-l sm:border-neutral-100 sm:pl-4 md:pl-6">
                                                        <div className="p-1 bg-neutral-50 rounded-lg"><Clock className="w-3 h-3 text-neutral-400" /></div>
                                                        <span className="text-[10px] md:text-xs font-black text-primary-600 italic uppercase">EST. {format(new Date(task.scheduledFor), 'HH:mm')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Deployment Status */}
                                        <div className="flex items-center sm:justify-between lg:justify-end gap-4 md:gap-8 lg:border-l lg:border-neutral-50 lg:pl-10">
                                            <div className="flex flex-col items-start lg:items-end min-w-[100px] md:min-w-[140px]">
                                                <p className="text-[8px] md:text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1 md:mb-2">Tactical Assignee</p>
                                                {task.assignedTo ? (
                                                    <div className="flex items-center gap-2 md:gap-3">
                                                        <div className="text-right hidden sm:block">
                                                            <p className="text-xs md:text-sm font-black italic leading-none">{typeof task.assignedTo === 'object' ? (task.assignedTo as any).name : 'Rider'}</p>
                                                            <p className="text-[8px] md:text-[10px] font-bold text-success-500 uppercase mt-1">On Duty</p>
                                                        </div>
                                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center font-black text-primary-600 text-[10px] md:text-xs shadow-sm">
                                                            {typeof task.assignedTo === 'object' ? (task.assignedTo as any).name.charAt(0) : 'R'}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Button variant="ghost" size="sm" className="h-8 md:h-10 rounded-lg md:rounded-xl px-2 md:px-4 border border-dashed border-warning-200 text-warning-600 bg-warning-50 hover:bg-warning-100 font-extrabold text-[8px] md:text-[10px] uppercase">
                                                        <UserPlus className="w-3 md:w-3.5 h-3 md:h-3.5 mr-1 md:mr-2" />
                                                        Deploy
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-center px-4 md:px-8 border-x border-neutral-50 min-w-[100px] md:min-w-[120px]">
                                                <p className="text-[8px] md:text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1 md:mb-2">Mission Phase</p>
                                                <Badge
                                                    variant={
                                                        task.status === 'completed' ? 'success' :
                                                            task.status === 'in_progress' ? 'primary' :
                                                                task.status === 'pending' ? 'error' : 'info'
                                                    }
                                                    className="rounded-full px-3 md:px-5 py-1 md:py-2 font-black italic shadow-sm text-[8px] md:text-[10px]"
                                                >
                                                    {task.status.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                            </div>

                                            <Button
                                                className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl p-0 font-black shadow-lg shadow-primary-500/10 hover:scale-105 transition-transform shrink-0"
                                                onClick={() => {
                                                    setSelectedTask(task);
                                                    setIsDetailsModalOpen(true);
                                                }}
                                            >
                                                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
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
        </div>
    );
};

export default BranchTasksPage;
