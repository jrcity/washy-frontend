import React from 'react';
import { X, MapPin, Navigation, Clock, User, ShoppingBag, Flag, Calendar, Phone, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, Card } from '@/components/ui';
import type { Task } from '@/types/task.types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TaskDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ isOpen, onClose, task }) => {
    if (!isOpen || !task) return null;

    const getPriorityVariant = (priority: string) => {
        switch (priority) {
            case 'critical': return 'error';
            case 'high': return 'warning';
            case 'medium': return 'info';
            default: return 'secondary';
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'completed': return 'success';
            case 'in_progress': return 'primary';
            case 'assigned': return 'info';
            default: return 'secondary';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-card rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col border border-border"
            >
                {/* Header */}
                <div className="p-8 border-b border-border flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-5">
                        <div className={cn(
                            "w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg",
                            task.type === 'pickup' ? "bg-info text-info-foreground shadow-info/20" : "bg-success text-success-foreground shadow-success/20"
                        )}>
                            <Navigation className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-black text-foreground tracking-tight leading-none">
                                    {task.order?.orderNumber || 'MISSION INTEL'}
                                </h2>
                                <Badge variant={getStatusVariant(task.status)} className="rounded-full px-3 py-1 font-black italic uppercase text-[9px] tracking-widest border-none">
                                    {task.status.replace('_', ' ')}
                                </Badge>
                            </div>
                            <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Deployment Specifications</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:rotate-90 shadow-sm"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 overflow-y-auto no-scrollbar flex-1">
                    {/* Mission Core */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 rounded-[28px] border-border bg-muted/30 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-primary">
                                <Flag className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Mission Urgency</span>
                            </div>
                            <Badge variant={getPriorityVariant(task.priority)} className="w-fit rounded-lg px-4 py-1.5 font-black uppercase text-[10px] tracking-wider border-none italic shadow-sm">
                                {task.priority.toUpperCase()}
                            </Badge>
                        </Card>
                        <Card className="p-4 rounded-[28px] border-border bg-muted/30 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-primary">
                                <Calendar className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Scheduled Window</span>
                            </div>
                            <p className="text-sm font-black text-foreground">{format(new Date(task.scheduledFor), 'PPP')}</p>
                            <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[10px] uppercase">
                                <Clock className="w-3.5 h-3.5" />
                                {format(new Date(task.scheduledFor), 'HH:mm')}
                            </div>
                        </Card>
                    </div>

                    {/* Operational Coordinates */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground/60 mb-1">
                            <MapPin className="w-5 h-5" />
                            <span className="text-sm font-black uppercase tracking-widest">Target Coordinates (Address)</span>
                        </div>
                        <div className="bg-card rounded-[32px] border border-border p-6 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <Button variant="ghost" size="sm" className="rounded-xl font-black text-[10px] uppercase text-primary hover:bg-primary/5">
                                    Open Track Map
                                </Button>
                            </div>
                            <p className="text-lg font-black text-foreground leading-tight mb-2 tracking-tight">
                                {task.address.street}, {task.address.area}
                            </p>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                {task.address.city}, {task.address.state}
                            </p>
                        </div>
                    </div>

                    {/* Personnel Deployment */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground/60 mb-1">
                            <User className="w-5 h-5" />
                            <span className="text-sm font-black uppercase tracking-widest">Tactical Personnel</span>
                        </div>
                        <div className="bg-card rounded-[32px] border border-border p-6 flex items-center justify-between group">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-[24px] bg-muted flex items-center justify-center font-black text-muted-foreground/40 text-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    {task.assignedTo && typeof task.assignedTo !== 'string' ? (task.assignedTo as any).name?.charAt(0) : '?'}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black text-foreground leading-none tracking-tight">
                                        {task.assignedTo && typeof task.assignedTo !== 'string' ? (task.assignedTo as any).name : 'UNASSIGNED'}
                                    </h4>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                                        {task.assignedTo ? 'Personnel On Track' : 'Awaiting Deployment'}
                                    </p>
                                </div>
                            </div>
                            {task.assignedTo && (
                                <button className="w-12 h-12 rounded-2xl bg-success-50 text-success-600 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                    <Phone className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order Reference */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground/60 mb-1">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="text-sm font-black uppercase tracking-widest">Order Intel</span>
                        </div>
                        <div className="bg-foreground text-background rounded-[32px] p-6 flex items-center justify-between">
                            <div>
                                <h4 className="text-xl font-black italic tracking-tighter mb-1 uppercase">
                                    {task.order?.orderNumber || 'OFF-GRID'}
                                </h4>
                                <p className="text-[10px] font-black text-background/60 uppercase tracking-[0.2em]">Verified Transaction Data</p>
                            </div>
                            <Button className="rounded-2xl h-12 px-6 bg-background/10 hover:bg-background/20 text-background font-black italic shadow-lg shadow-black/20">
                                View Case
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-8 border-t border-border flex gap-4 bg-muted/10">
                    <Button
                        variant="ghost"
                        className="flex-1 h-16 rounded-[24px] font-black uppercase tracking-widest text-muted-foreground hover:text-error hover:bg-error/5"
                    >
                        Abort Mission
                    </Button>
                    <Button
                        onClick={onClose}
                        className="flex-[2] h-16 rounded-[24px] shadow-xl shadow-primary/20 font-black text-lg tracking-tight hover:scale-[1.02] transition-transform"
                    >
                        Acknowledge Intel
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
