import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'bg-primary/10 text-primary'
}) => {
  return (
    <motion.div 
      className="card card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          
          {trend !== undefined && (
            <div className="mt-2 flex items-center">
              <span 
                className={`text-xs font-medium ${
                  trend >= 0 ? 'text-success' : 'text-error'
                }`}
              >
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
              <span className="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-md ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;