import { BarChart3 } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, EmptyState } from '@/components/ui';

export const BranchStatsPage = () => {
  return (
    <PageWrapper title="Analytics" description="Performance metrics and reports" showBack={true}>
      <Card className="py-20 bg-card border-border">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Advanced Analytics Coming Soon</h2>
          <p className="text-muted-foreground">
            We are building detailed reports for revenue, order turnover time, and staff performance.
          </p>
        </div>
      </Card>
    </PageWrapper>
  );
};
