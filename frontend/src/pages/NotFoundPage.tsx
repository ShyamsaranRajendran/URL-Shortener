import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <FileQuestion size={40} />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</p>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;