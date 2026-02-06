import { useState } from 'react';
import { X, Search, Truck, Zap, UserPlus } from 'lucide-react';
import { useUsers, useAssignRider } from '@/hooks';
import { Button, Input, LoadingScreen, Avatar, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AssignRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  type?: 'pickup' | 'delivery'; // usually delivery for now
}

export const AssignRiderModal = ({ isOpen, onClose, orderId, type = 'delivery' }: AssignRiderModalProps) => {
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useUsers({
    role: 'rider',
    limit: 20
  });

  const { mutate: assignRider, isPending: isAssigning } = useAssignRider();

  if (!isOpen) return null;

  const users = data?.users || [];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const handleAssign = () => {
    if (!selectedRiderId) return;

    assignRider(
      { id: orderId, data: { riderId: selectedRiderId, type } },
      {
        onSuccess: () => {
          onClose();
          setSelectedRiderId(null);
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground tracking-tight italic uppercase">Deploy Asset</h3>
              <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest leading-none mt-1">Personnel Assignment Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 flex-1 overflow-y-auto no-scrollbar">
          <div className="relative group">
            <Input
              placeholder="Filter by name or frequency..."
              leftIcon={<Search className="w-5 h-5 text-primary" />}
              className="h-14 rounded-2xl bg-muted border-none focus:ring-primary/10 focus:bg-card pl-14 font-bold text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] italic">Tactical Units Available</p>
              <p className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-widest">{filteredUsers.length} Units</p>
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center"><LoadingScreen /></div>
                <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest animate-pulse">Syncing Personnel Data...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <Card className="py-12 border-dashed border-2 border-border bg-muted/20 text-center rounded-[32px]">
                <UserPlus className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">No units in range</p>
              </Card>
            ) : (
              <div className="grid gap-3">
                <AnimatePresence>
                  {filteredUsers.map((rider, i) => (
                    <motion.div
                      key={rider._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        "group flex items-center gap-4 p-4 rounded-[28px] border-2 cursor-pointer transition-all relative overflow-hidden",
                        selectedRiderId === rider._id
                          ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                          : 'border-border bg-card hover:border-primary/20 hover:bg-muted/30'
                      )}
                      onClick={() => setSelectedRiderId(rider._id)}
                    >
                      {selectedRiderId === rider._id && (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                      )}

                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all shadow-sm",
                        selectedRiderId === rider._id
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      )}>
                        {rider.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-foreground italic uppercase text-xs tracking-tight truncate">{rider.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground/60 truncate uppercase tracking-widest mt-0.5">{rider.email}</p>
                      </div>

                      {selectedRiderId === rider._id ? (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                          <Zap className="w-4 h-4 text-primary-foreground fill-current" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary/40 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-border group-hover:bg-primary/20 transition-colors" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-border flex gap-4 bg-muted/20 backdrop-blur-sm">
          <Button
            variant="outline"
            className="flex-1 rounded-2xl h-14 font-black border-border bg-card shadow-sm tracking-widest uppercase text-[10px]"
            onClick={onClose}
          >
            Abort
          </Button>
          <Button
            className="flex-[2] rounded-2xl h-14 font-black shadow-xl shadow-primary/20 text-sm tracking-widest uppercase"
            disabled={!selectedRiderId || isAssigning}
            isLoading={isAssigning}
            onClick={handleAssign}
          >
            Deploy Unit
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
