import React, { useState, useEffect } from 'react';
import { tasksService } from '@/services/tasks.service';
import { TaskStatus, TaskPriority } from '@/types/task.types';
import type { Task } from '@/types/task.types';
import { MapPin, Clock, Calendar, CheckCircle2, ChevronRight, AlertCircle, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import { Button, Badge, Spinner, Card } from '@/components/ui';
import { useComponentLogger } from '@/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export const RiderTasksPage: React.FC = () => {
  useComponentLogger('RiderTasksPage');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await tasksService.getMyTasks();
      if (response.success && Array.isArray(response.data)) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch my tasks', error);
      toast.error('Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (taskId: string, action: 'start' | 'complete') => {
    try {
      if (action === 'start') {
        await tasksService.startTask(taskId);
        toast.success('Task started! Safe trip.');
      } else {
        await tasksService.completeTask(taskId);
        toast.success('Task completed! Good job.');
      }
      fetchTasks();
    } catch (error) {
      console.error(`Failed to ${action} task`, error);
      toast.error(`Failed to ${action} task`);
    }
  };

  const filteredTasks = tasks.filter(t => filter === 'all' || t.status === filter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner size="lg" className="text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Fetching your route...</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Mobile Header Segment */}
      <div className="bg-background px-4 pt-6 pb-4 border-b border-border sticky top-0 z-20 backdrop-blur-md bg-background/90">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Daily Route</h1>
            <p className="text-sm font-medium text-muted-foreground/60 capitalize">
              {format(new Date(), 'EEEE, MMMM do')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-border">
            <Calendar className="w-6 h-6 text-muted-foreground/60" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-1 bg-muted rounded-2xl overflow-x-auto no-scrollbar">
          {['all', 'assigned', 'in_progress', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300",
                filter === f
                  ? "bg-card text-primary shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="px-4 py-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 px-8"
            >
              <div className="w-20 h-20 bg-muted rounded-[40px] flex items-center justify-center mx-auto mb-6">
                <Navigation className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">Clear Road!</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                No tasks found in this category. Enjoy the breather or check back later.
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(
                  "p-0 overflow-hidden border-none shadow-xl rounded-[32px] transition-all duration-300 bg-card",
                  task.status === 'in_progress' ? "ring-2 ring-primary shadow-primary/20" : "ring-1 ring-border"
                )}>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <Badge variant={task.type === 'pickup' ? 'info' : 'success'} size="sm" className="rounded-lg px-2.5">
                          {task.type.toUpperCase()}
                        </Badge>
                        {task.priority === 'critical' && (
                          <Badge variant="error" size="sm" className="rounded-lg px-2.5 animate-pulse">
                            CRITICAL
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest leading-none mb-1">Order #</span>
                        <span className="text-xs font-bold text-muted-foreground">{task.order?.orderNumber}</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider mb-0.5 leading-none">Address</p>
                          <h3 className="font-bold text-foreground leading-snug line-clamp-2">
                            {task.address.street}, {task.address.area}
                          </h3>
                          <p className="text-[11px] font-medium text-muted-foreground/80 mt-0.5">
                            {task.address.city}, {task.address.state}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider mb-0.5 leading-none">Schedule</p>
                          <p className="text-sm font-bold text-foreground/80">
                            {format(new Date(task.scheduledFor), 'HH:mm')}
                            <span className="text-muted-foreground font-medium ml-2">— Today</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-1 border-t border-border mt-4">
                      {task.status === 'assigned' && (
                        <Button
                          className="w-full h-12 rounded-2xl shadow-lg shadow-primary/10 font-bold"
                          onClick={() => handleAction(task._id, 'start')}
                          rightIcon={<ChevronRight className="w-4 h-4" />}
                        >
                          Start Journey
                        </Button>
                      )}
                      {task.status === 'in_progress' && (
                        <Button
                          className="w-full h-12 rounded-2xl bg-success hover:bg-success/90 shadow-lg shadow-success/10 font-bold"
                          onClick={() => handleAction(task._id, 'complete')}
                          leftIcon={<CheckCircle2 className="w-4 h-4" />}
                        >
                          Mark Done
                        </Button>
                      )}
                      {task.status === 'completed' && (
                        <div className="w-full h-12 rounded-2xl bg-muted flex items-center justify-center gap-2 text-success font-bold">
                          <CheckCircle2 className="w-5 h-5" />
                          Completed
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom strip for extra info */}
                  <div className="bg-muted/50 p-4 flex justify-between items-center text-[10px] font-bold text-muted-foreground/60">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Tap to view order details
                    </div>
                    <div className="flex items-center gap-1">
                      {task.priority !== 'normal' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                      )}
                      {task.priority.toUpperCase()}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RiderTasksPage;
