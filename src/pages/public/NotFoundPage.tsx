import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="max-w-md text-center">
        <div className="text-8xl font-bold text-primary-600 mb-4">404</div>
        
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-neutral-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button leftIcon={<Home className="w-4 h-4" />}>
              Go to Home
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
