import { useState } from 'react';
import { Plus, MapPin, Phone, Edit, Trash2 } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Button, Badge, LoadingScreen, EmptyState } from '@/components/ui';
import { useBranches } from '@/hooks';
import toast from 'react-hot-toast';

export const AdminBranchesPage = () => {
  const { data, isLoading } = useBranches();
  const branches = data || [];

  if (isLoading) return <LoadingScreen />;

  return (
    <PageWrapper 
      title="Branches" 
      description="Manage store locations and operations"
      action={
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Add Branch
        </Button>
      }
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.length === 0 ? (
            <div className="col-span-full">
                <Card variant="bordered" className="py-12">
                    <EmptyState
                        title="No branches found"
                        description="Add your first branch location"
                    />
                </Card>
            </div>
        ) : (
            branches.map((branch) => (
            <Card key={branch._id} variant="bordered" className="flex flex-col h-full group">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <Badge variant={branch.isActive ? 'success' : 'error'}>
                        {branch.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-neutral-900 mb-1">{branch.name}</h3>
                    <p className="text-sm text-neutral-500 mb-4">{branch.code}</p>
                    
                    <div className="space-y-2 text-sm text-neutral-600">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 text-neutral-400" />
                            <span>{branch.address.street}, {branch.address.city}, {branch.address.state}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-neutral-400" />
                            <span>{branch.contactPhone}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-end gap-2">
                     <Button variant="ghost" size="sm" onClick={() => toast('Edit coming soon')}>
                        Edit
                    </Button>
                </div>
            </Card>
            ))
        )}
      </div>
    </PageWrapper>
  );
};
