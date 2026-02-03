import React, { useState, useEffect } from 'react';
import { tasksService } from '@/services/tasks.service';
import { TaskStatus, TaskPriority } from '@/types/task.types';
import type { Task } from '@/types/task.types';
import { ClipboardList, Plus, Clock, AlertCircle, Filter, Search, User as UserIcon, MapPin, ArrowRight, Navigation, CheckCircle2 } from 'lucide-react';
import { Button, Badge, Spinner, Input, Card } from '@/components/ui';
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
        <div className="space-y-8 pb-12">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 md:gap-4">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-1">Task Control</h1>
                    <p className="text-neutral-500 font-medium text-sm">Assign, track and manage frontline operations</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none rounded-2xl h-12 px-6 font-bold border-neutral-200">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="flex-1 sm:flex-none rounded-2xl h-12 px-6 shadow-lg shadow-primary-200 font-extrabold group">
                        <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" />
                        New Task
                    </Button>
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

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Pending', count: stats.pending, color: 'text-warning-600', bg: 'bg-warning-50', icon: Clock },
                    { label: 'Active', count: stats.in_progress, color: 'text-info-600', bg: 'bg-info-50', icon: Navigation },
                    { label: 'Critical', count: stats.critical, color: 'text-error-600', bg: 'bg-error-50', icon: AlertCircle },
                    { label: 'Finished', count: stats.completed, color: 'text-success-600', bg: 'bg-success-50', icon: CheckCircle2 }
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="bg-white p-6 rounded-[32px] border border-neutral-100 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className={cn("p-2 rounded-xl", stat.bg)}>
                                <stat.icon className={cn("w-5 h-5", stat.color)} />
                            </div>
                            <span className="text-3xl font-black text-neutral-900">{stat.count}</span>
                        </div>
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <Input
                        placeholder="Search mission or rider..."
                        className="pl-12 h-14 bg-white border-neutral-100 rounded-2xl focus:ring-primary-500/10 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex p-1 bg-white border border-neutral-100 rounded-2xl md:w-fit overflow-x-auto no-scrollbar">
                    {['all', 'pending', 'assigned', 'in_progress', 'completed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f as any)}
                            className={cn(
                                "px-5 py-2.5 rounded-xl text-xs font-black tracking-tight uppercase transition-all whitespace-nowrap",
                                statusFilter === f
                                    ? "bg-neutral-900 text-white shadow-md shadow-neutral-200"
                                    : "text-neutral-400 hover:text-neutral-600"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tasks Table / Cards */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-xl overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <Spinner size="lg" className="text-primary-600" />
                        <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Optimizing Board...</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-24 h-24 bg-neutral-50 rounded-[40px] flex items-center justify-center mx-auto mb-6">
                            <ClipboardList className="w-10 h-10 text-neutral-200" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-1">No tasks in sight</h3>
                        <p className="text-neutral-500 font-medium">Try adjusting your filters or create a new assignment.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50/50">
                                    <th className="px-6 md:px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Type & Order</th>
                                    <th className="hidden lg:table-cell px-6 md:px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Location</th>
                                    <th className="hidden sm:table-cell px-6 md:px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Rider</th>
                                    <th className="hidden md:table-cell px-6 md:px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Priority</th>
                                    <th className="px-6 md:px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 md:px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {filteredTasks.map((task, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        key={task._id}
                                        className="group hover:bg-neutral-50/50 transition-colors"
                                    >
                                        <td className="px-6 md:px-8 py-6">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm shrink-0",
                                                    task.type === 'pickup' ? "bg-info-50 text-info-600" : "bg-success-50 text-success-600"
                                                )}>
                                                    <Navigation className="w-5 h-5 md:w-6 md:h-6" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-sm font-black text-neutral-900 truncate">
                                                        {task.order?.orderNumber}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{task.type}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden lg:table-cell px-6 md:px-8 py-6">
                                            <div className="flex items-start gap-2 max-w-[200px]">
                                                <MapPin className="w-4 h-4 text-neutral-300 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <div className="text-sm font-bold text-neutral-700 truncate">{task.address.street}</div>
                                                    <div className="text-xs text-neutral-400">{task.address.area}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-6 md:px-8 py-6">
                                            {task.assignedTo && typeof task.assignedTo !== 'string' ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-neutral-100 flex items-center justify-center font-bold text-neutral-500 text-[10px] md:text-xs shadow-inner shrink-0">
                                                        {(task.assignedTo as any).name?.charAt(0)}
                                                    </div>
                                                    <div className="text-sm font-bold text-neutral-700 truncate">{(task.assignedTo as any).name}</div>
                                                </div>
                                            ) : (
                                                <Badge size="sm" className="bg-neutral-100 text-neutral-400 text-[8px] md:text-[9px]">UNASSIGNED</Badge>
                                            )}
                                        </td>
                                        <td className="hidden md:table-cell px-6 md:px-8 py-6">
                                            <Badge variant={getPriorityVariant(task.priority)} size="sm" className="rounded-lg font-black px-3 text-[9px]">
                                                {task.priority.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-6 md:px-8 py-6">
                                            <div className="flex flex-col gap-1 min-w-[80px]">
                                                <div className="text-[9px] font-black text-neutral-900 uppercase tracking-tighter">
                                                    {task.status.replace('_', ' ')}
                                                </div>
                                                <div className="w-full h-1 md:h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                                    <div className={cn(
                                                        "h-full rounded-full transition-all duration-500",
                                                        task.status === 'completed' ? "bg-success-500 w-full" :
                                                            task.status === 'in_progress' ? "bg-primary-500 w-2/3" :
                                                                task.status === 'assigned' ? "bg-info-500 w-1/3" : "bg-neutral-300 w-2"
                                                    )} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 md:px-8 py-6">
                                            <button
                                                onClick={() => {
                                                    setSelectedTask(task);
                                                    setIsDetailsModalOpen(true);
                                                }}
                                                className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-primary-600 hover:border-primary-100 hover:shadow-lg transition-all"
                                            >
                                                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTasksPage;
