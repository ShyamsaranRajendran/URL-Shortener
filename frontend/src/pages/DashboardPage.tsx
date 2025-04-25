import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart2, TrendingUp, Link as LinkIcon, Clock } from 'lucide-react';
import { useURL } from '../contexts/URLContext';
import { useAuth } from '../contexts/AuthContext';
import StatsCard from '../components/StatsCard';
import URLTable from '../components/URLTable';

const DashboardPage = () => {
  const { urls } = useURL();
  const { user } = useAuth();

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  const totalLinks = urls.length;
  const averageClicksPerLink = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;
  
  // Get the current date and create a date 30 days ago for comparison
  const currentDate = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(currentDate.getDate() - 30);

  // Calculate the number of links created in the last 30 days
  const recentLinks = urls.filter(url => new Date(url.createdAt) >= thirtyDaysAgo).length;
  const recentLinksPercentage = totalLinks > 0 ? Math.round((recentLinks / totalLinks) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || 'User'}! Here's an overview of your links.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/shorten" className="btn btn-primary flex items-center">
            <LinkIcon size={18} className="mr-2" />
            Create New Link
          </Link>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Links" 
          value={totalLinks} 
          icon={<LinkIcon size={20} />} 
          trend={recentLinksPercentage}
          color="bg-primary/10 text-primary"
        />
        
        <StatsCard 
          title="Total Clicks" 
          value={totalClicks} 
          icon={<BarChart2 size={20} />} 
          trend={12}
          color="bg-secondary/10 text-secondary"
        />
        
        <StatsCard 
          title="Average CTR" 
          value={`${averageClicksPerLink} clicks/link`} 
          icon={<TrendingUp size={20} />} 
          trend={-5}
          color="bg-accent/10 text-accent"
        />
        
        <StatsCard 
          title="Active Links" 
          value={urls.filter(url => !url.expiresAt || new Date(url.expiresAt) > new Date()).length} 
          icon={<Clock size={20} />} 
          color="bg-success/10 text-success"
        />
      </div>

      {/* Recent Links */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Your Links</h2>
          <Link to="/shorten" className="text-primary hover:text-primary-dark text-sm font-medium">
            View All
          </Link>
        </div>
        
        <URLTable />
      </div>
    </div>
  );
};

export default DashboardPage;