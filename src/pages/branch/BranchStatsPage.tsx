import { BarChart3 } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, EmptyState } from '@/components/ui';

export const BranchStatsPage = () => {
  return (
    <PageWrapper title="Analytics" description="Performance metrics and reports">
      <Card variant="bordered" className="py-20">
         <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                <BarChart3 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Advanced Analytics Coming Soon</h2>
            <p className="text-neutral-500">
                We are building detailed reports for revenue, order turnover time, and staff performance.
            </p>
         </div>
      </Card>
    </PageWrapper>
  );
};
