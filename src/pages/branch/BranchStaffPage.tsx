import { useState } from 'react';
import { Users, Mail, Phone, Plus, UserCheck, ShieldCheck, Zap } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Button, Badge, LoadingScreen, EmptyState } from '@/components/ui';
import { useBranch, useUsers } from '@/hooks';
import { useAuthContext } from '@/context/AuthContext';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { CreateStaffModal } from '@/components/branch';
import { useQueryClient } from '@tanstack/react-query';

export const BranchStaffPage = () => {
    const { user } = useAuthContext();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, isLoading } = useUsers({
        role: user?.role === 'admin' ? 'staff' : undefined, // Admins might only want staff here, or we can leave it undefined to see all in branch
        branchId: user?.managedBranch || user?.assignedBranch,
        limit: 100
    });

    const staffMembers = data?.users || [];

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <PageWrapper
            title="Personnel Command"
            description="Manage and audit operative authorizations"
            showBack={true}
            action={
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-2xl h-12 px-8 font-black shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all text-xs uppercase tracking-widest"
                >
                    <Plus className="w-4 h-4 mr-3" />
                    Invite Operative
                </Button>
            }
        >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {staffMembers.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="col-span-full"
                        >
                            <Card className="py-24 rounded-[48px] border-dashed border-2 border-border bg-muted/20 text-center shadow-inner">
                                <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
                                <h3 className="text-xl font-black text-foreground uppercase italic tracking-tighter">Zero Units Detected</h3>
                                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mt-2">No personnel matches found in the current sector</p>
                            </Card>
                        </motion.div>
                    ) : (
                        staffMembers.map((member, i) => (
                            <motion.div
                                key={member._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="p-8 rounded-[40px] border-border bg-card hover:border-primary/50 hover:shadow-2xl transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-center gap-6 mb-8 relative z-10">
                                        <div className="w-16 h-16 bg-muted border border-border rounded-[24px] flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                                            <span className="text-xl font-black text-primary italic uppercase">{member.name.charAt(0)}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-black text-foreground italic uppercase text-sm tracking-tight truncate group-hover:text-primary transition-colors">{member.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                                                    {member.role === 'staff' ? 'Operative' : member.role === 'rider' ? 'Field Unit' : member.role}
                                                </Badge>
                                                <Badge className="bg-success/5 text-success border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <ShieldCheck className="w-2 h-2" /> Verified
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 relative z-10">
                                        <div className="p-4 bg-muted/30 rounded-2xl border border-border group-hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3 text-muted-foreground/60 mb-1">
                                                <Mail className="w-3.5 h-3.5" />
                                                <span className="text-[8px] font-black uppercase tracking-widest italic">Encrypted Channel</span>
                                            </div>
                                            <p className="text-xs font-bold text-foreground truncate pl-6.5">{member.email}</p>
                                        </div>
                                        <div className="p-4 bg-muted/30 rounded-2xl border border-border group-hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3 text-muted-foreground/60 mb-1">
                                                <Phone className="w-3.5 h-3.5" />
                                                <span className="text-[8px] font-black uppercase tracking-widest italic">Comm Frequency</span>
                                            </div>
                                            <p className="text-xs font-bold text-foreground pl-6.5">{member.phone || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-border flex items-center justify-between relative z-10">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">Enlisted Since</span>
                                            <span className="text-[10px] font-bold text-muted-foreground/60 italic uppercase">{formatDate(member.createdAt, 'MMM d, yyyy')}</span>
                                        </div>
                                        <Button variant="ghost" className="w-10 h-10 rounded-xl p-0 hover:bg-primary/5 text-primary group-hover:scale-110 transition-transform">
                                            <UserCheck className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <CreateStaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </PageWrapper>
    );
};
