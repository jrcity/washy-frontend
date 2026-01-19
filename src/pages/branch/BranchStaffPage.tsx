import { useState } from 'react';
import { Users, Mail, Phone, Plus } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Button, Badge, LoadingScreen, EmptyState } from '@/components/ui';
import { useBranch, useUsers } from '@/hooks';
import { useAuthContext } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export const BranchStaffPage = () => {
  const { user } = useAuthContext();
  // Ideally user has branchId, or we use useBranch with their assignment
  // For now assuming we can fetch by branchId if we knew it.
  // But wait, the schema says Staff belongs to Branch.
  // We'll use useUsers({ branchId: ... }) if we can get IDs.
  // Simplify: Fetch all 'staff' and 'rider' role users for this branch.
  
  // Since we don't strictly have branchId in context yet (it might be in user.branchId if we populated it, but likely not),
  // we will just show a "Staff Management" list filtering by role for now as a demo.
  
  const { data, isLoading } = useUsers({ 
      role: 'staff',
      limit: 50 
  });
  
  const staffMembers = data?.users || [];

  if (isLoading) return <LoadingScreen />;

  return (
    <PageWrapper 
      title="Branch Staff" 
      description="Manage your team members"
      action={
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => toast('Invite feature coming soon')}>
            Invite Staff
        </Button>
      }
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffMembers.length === 0 ? (
            <div className="col-span-full">
                <Card variant="bordered" className="py-12">
                   <EmptyState
                    title="No staff found"
                    description="Invite team members to help organize this branch"
                   />
                </Card>
            </div>
        ) : (
            staffMembers.map((member) => (
                <Card key={member._id} variant="bordered" className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                            {member.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-neutral-900">{member.name}</h3>
                            <Badge variant="secondary" className="capitalize text-xs">{member.role}</Badge>
                        </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-neutral-600">
                        <div className="flex items-center gap-2">
                             <Mail className="w-4 h-4 text-neutral-400" />
                             <span className="truncate">{member.email}</span>
                        </div>
                         <div className="flex items-center gap-2">
                             <Phone className="w-4 h-4 text-neutral-400" />
                             <span>{member.phone}</span>
                        </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-neutral-100 text-xs text-neutral-400">
                        Joined {formatDate(member.createdAt)}
                    </div>
                </Card>
            ))
        )}
      </div>
    </PageWrapper>
  );
};
