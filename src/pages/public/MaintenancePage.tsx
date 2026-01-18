import { Link } from 'react-router-dom';
import { Wrench, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

export const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 text-primary-600 rounded-full mb-6">
          <Wrench className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">
          We'll Be Right Back
        </h1>
        
        <p className="text-neutral-600 mb-6">
          We're currently performing scheduled maintenance to improve our services. 
          We appreciate your patience and will be back online shortly.
        </p>
        
        <div className="flex items-center justify-center gap-2 text-neutral-500 mb-8">
          <Clock className="w-5 h-5" />
          <span>Estimated downtime: 30 minutes</span>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-neutral-500">
            Need urgent assistance? Contact us at{' '}
            <a href="mailto:support@washy.com.ng" className="text-primary-600 hover:underline">
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
