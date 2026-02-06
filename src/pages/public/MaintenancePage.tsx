import { Link } from 'react-router-dom';
import { Wrench, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

export const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 font-outfit">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 text-primary rounded-full mb-6">
          <Wrench className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          We'll Be Right Back
        </h1>

        <p className="text-muted-foreground mb-6">
          We're currently performing scheduled maintenance to improve our services.
          We appreciate your patience and will be back online shortly.
        </p>

        <div className="flex items-center justify-center gap-2 text-muted-foreground/80 mb-8">
          <Clock className="w-5 h-5" />
          <span>Estimated downtime: 30 minutes</span>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground/60">
            Need urgent assistance? Contact us at{' '}
            <a href="mailto:support@washy.com.ng" className="text-primary hover:underline">
              support@washy.com.ng
            </a>
          </p>

          <Link to="/">
            <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
