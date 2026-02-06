import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Button, Input, Badge, LoadingScreen, EmptyState } from '@/components/ui';
import { ServiceModal } from '@/components/admin';
import { useServices } from '@/hooks';
import { formatCurrency } from '@/lib/utils';
import type { Service } from '@/types';

export const AdminServicesPage = () => {
  const { data: services, isLoading, refetch } = useServices();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filteredServices = services?.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    service.category.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleOpenCreate = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    refetch();
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <PageWrapper
      title="Services"
      description="Manage laundry services and pricing"
      action={
        <Button onClick={handleOpenCreate} className="rounded-2xl h-12 px-8 font-black shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all text-xs uppercase tracking-widest">
          <Plus className="w-4 h-4 mr-3" />
          Add Service
        </Button>
      }
    >
      <div className="mb-6">
        <Input
          placeholder="Search services..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md rounded-2xl border-border bg-card shadow-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredServices.length === 0 ? (
          <Card className="py-24 rounded-[48px] border-border border-dashed border-2 text-center shadow-inner bg-muted/20">
            <EmptyState
              title="No services found"
              description="Create a new service to get started"
            />
          </Card>
        ) : (
          filteredServices.map((service) => (
            <Card key={service._id} className="p-8 rounded-[40px] border-border bg-card hover:border-primary/50 hover:shadow-2xl transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -mr-16 -mt-16" />
              <div className="flex items-center justify-between relative z-10">
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
                    {/* Pricing Tiers */}
                    <div className="mt-4 border-t border-neutral-100 pt-4">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Pricing Structure</p>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                        {service.pricing.map((price, idx) => (
                          <div key={idx} className="bg-neutral-50 rounded px-2 py-1.5 flex items-center justify-between text-sm">
                            <span className="capitalize text-neutral-600">{price.garmentType.replace('_', ' ')}</span>
                            <span className="font-semibold text-neutral-900">{formatCurrency(price.basePrice)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Badge size="sm" variant="secondary" className="capitalize">
                        {service.category.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-neutral-400">
                        • Est. {service.estimatedDuration.standard}h (Std) / {service.estimatedDuration.express}h (Exp)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => handleOpenEdit(service)}
                    className="w-12 h-12 rounded-2xl p-0 hover:bg-primary/5 hover:text-primary transition-all"
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    className="w-12 h-12 rounded-2xl p-0 hover:bg-destructive/5 hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        service={selectedService}
        onSuccess={() => refetch()}
      />
    </PageWrapper>
  );
};
