import { Link, useNavigate } from 'react-router-dom';
import { Plus, MapPin, Phone, Edit, ArrowRight } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Button, Badge, LoadingScreen, EmptyState } from '@/components/ui';
import { useBranches } from '@/hooks';
import type { Branch } from '@/types';
import { motion } from 'framer-motion';

export const AdminBranchesPage = () => {
  const navigate = useNavigate();
  const { data: branches, isLoading } = useBranches();

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <PageWrapper
      title="Operational Fleet"
      description="Manage your service hubs and deployment centers"
      action={
        <Link to="/admin/branches/create" className="block sm:inline-block w-full sm:w-auto">
          <Button className="w-full sm:w-auto rounded-2xl h-12 shadow-xl shadow-primary-500/20 font-black">
            <Plus className="w-4 h-4 mr-2" />
            Establish Hub
          </Button>
        </Link>
      }
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!branches || branches.length === 0 ? (
          <div className="col-span-full">
            <Card className="py-20 rounded-[40px] border-neutral-100 border-dashed border-2">
              <EmptyState
                title="No Operational Hubs"
                description="You haven't established any branches yet. Start your expansion today."
              />
              <div className="mt-8 flex justify-center">
                <Link to="/admin/branches/create">
                  <Button variant="outline" className="rounded-xl font-black">
                    Establish First Hub
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        ) : (
          branches.map((branch, i) => (
            <motion.div
              key={branch._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="flex flex-col h-full rounded-[28px] md:rounded-[32px] border-neutral-100 hover:border-primary-100 hover:shadow-2xl hover:shadow-primary-500/5 transition-all group overflow-hidden"
              >
                <div className="p-5 md:p-6 relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-neutral-50 text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 rounded-2xl flex items-center justify-center transition-colors">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <Badge variant={branch.isActive ? 'success' : 'error'} className="rounded-lg px-3 py-1 font-black italic">
                      {branch.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </div>

                  <div className="space-y-1 mb-6">
                    <h3 className="text-xl font-black text-neutral-900 tracking-tight leading-tight group-hover:text-primary-600 transition-colors">
                      {branch.name}
                    </h3>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{branch.code}</p>
                  </div>

                  <div className="space-y-3 text-sm font-medium text-neutral-500">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 mt-0.5 text-neutral-300" />
                      <span>{branch.address.city}, {branch.address.state}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-neutral-300" />
                      <span>{branch.contactPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto p-4 bg-neutral-50 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-xl font-bold text-neutral-400 hover:text-primary-600 hover:bg-primary-50"
                    onClick={() => navigate(`/admin/branches/edit/${branch._id}`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button
                    className="w-12 h-12 rounded-xl p-0 font-black shadow-lg shadow-primary-500/10"
                    onClick={() => navigate(`/admin/branches/${branch._id}`)}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </PageWrapper>
  );
};

export default AdminBranchesPage;
