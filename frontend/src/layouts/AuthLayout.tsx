import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="p-4">
        <Link to="/" className="text-primary font-semibold text-xl flex items-center gap-2">
          <ExternalLink size={24} /> Shorty
        </Link>
      </div>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;