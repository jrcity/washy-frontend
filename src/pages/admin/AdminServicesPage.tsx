import { useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Button, Input, Badge, LoadingScreen, EmptyState } from '@/components/ui';
import { useServices } from '@/hooks';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export const AdminServicesPage = () => {
  const { data: services, isLoading } = useServices();
  const [search, setSearch] = useState('');

  const filteredServices = services?.filter(service => 
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    service.category.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleDelete = (id: string) => {
      // TODO: Implement delete mutation
      toast.error("Delete functionality coming soon");
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <PageWrapper 
      title="Services" 
      description="Manage laundry services and pricing"
      action={
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Add Service
        </Button>
      }
    >
        <div className="mb-6">
            <Input 
                placeholder="Search services..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
            />
        </div>

      <div className="grid gap-4">
        {filteredServices.length === 0 ? (
           <Card variant="bordered" className="py-12">
            <EmptyState
                title="No services found"
                description="Create a new service to get started"
            />
          </Card>
        ) : (
            filteredServices.map((service) => (
            <Card key={service._id} variant="bordered" className="group">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 font-bold text-xl uppercase">
                        {service.name.charAt(0)}
                   </div>
                    <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900">{service.name}</h3>
                        {!service.isActive && <Badge variant="error" size="sm">Inactive</Badge>}
                    </div>
                    <p className="text-sm text-neutral-500 line-clamp-1">{service.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge size="sm" variant="secondary" className="capitalize">
                            {service.category.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-neutral-400">
                             • {service.pricing.length} Pricing Tiers
                        </span>
                    </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => toast('Edit coming soon')}>
                        <Edit className="w-4 h-4 text-neutral-500" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(service._id)}>
                        <Trash2 className="w-4 h-4 text-error-500" />
                    </Button>
                </div>
                </div>
            </Card>
            ))
        )}
      </div>
    </PageWrapper>
  );
};
