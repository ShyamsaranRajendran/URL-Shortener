import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Globe, RefreshCw, Calendar, Clock, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO, addDays, differenceInDays } from 'date-fns';
import { useURL, URLData } from '../contexts/URLContext';
import CopyButton from '../components/CopyButton';

const COLORS = ['#3a86ff', '#805ad5', '#38a169', '#f59e0b', '#e53e3e'];

const mockDailyData = [
  { date: '2025-05-01', clicks: 12 },
  { date: '2025-05-02', clicks: 19 },
  { date: '2025-05-03', clicks: 8 },
  { date: '2025-05-04', clicks: 15 },
  { date: '2025-05-05', clicks: 23 },
  { date: '2025-05-06', clicks: 17 },
  { date: '2025-05-07', clicks: 32 },
];

const mockReferrers = [
  { name: 'Direct', value: 48 },
  { name: 'Twitter', value: 25 },
  { name: 'LinkedIn', value: 15 },
  { name: 'Facebook', value: 8 },
  { name: 'Other', value: 4 },
];

const mockLocations = [
  { name: 'United States', value: 42 },
  { name: 'United Kingdom', value: 18 },
  { name: 'Canada', value: 12 },
  { name: 'Germany', value: 9 },
  { name: 'Other', value: 19 },
];

const mockDevices = [
  { name: 'Desktop', value: 58 },
  { name: 'Mobile', value: 35 },
  { name: 'Tablet', value: 7 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-md rounded-md border border-gray-100">
        <p className="font-medium">{format(parseISO(label), 'MMM d, yyyy')}</p>
        <p className="text-primary font-semibold">
          {payload[0].value} clicks
        </p>
      </div>
    );
  }

  return null;
};

const PieChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-md rounded-md border border-gray-100">
        <p className="font-medium">{payload[0].name}</p>
        <p className="font-semibold" style={{ color: payload[0].payload.fill }}>
          {payload[0].value} clicks ({Math.round(payload[0].percent * 100)}%)
        </p>
      </div>
    );
  }

  return null;
};

const AnalyticsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getUrlById } = useURL();
  const [urlData, setUrlData] = useState<URLData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    if (id) {
      const data = getUrlById(id);
      setUrlData(data || null);
      setIsLoading(false);
    }
  }, [id, getUrlById]);

  const getFilteredData = () => {
    let days;
    switch (timeRange) {
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      default: days = 7;
    }
    
    const today = new Date();
    const filteredData = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = addDays(today, -i);
      const formattedDate = format(date, 'yyyy-MM-dd');
      const existingDay = mockDailyData.find(d => d.date === formattedDate);
      
      filteredData.push({
        date: formattedDate,
        clicks: existingDay ? existingDay.clicks : Math.floor(Math.random() * 10)
      });
    }
    
    return filteredData;
  };
  
  const chartData = getFilteredData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!urlData) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Link not found</h2>
        <p className="text-gray-600 mb-6">The link you're looking for doesn't exist or has been deleted.</p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const daysActive = differenceInDays(new Date(), parseISO(urlData.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-primary mb-2">
            <ArrowLeft size={16} className="mr-1" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Link Analytics</h1>
        </div>
      </div>

      {/* Link Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <Globe size={16} className="mr-1" />
              <span className="font-medium">{urlData.shortUrl}</span>
              <CopyButton textToCopy={urlData.shortUrl} />
            </div>
            
            <a 
              href={urlData.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm flex items-center"
            >
              {urlData.originalUrl.length > 50 
                ? urlData.originalUrl.substring(0, 50) + '...' 
                : urlData.originalUrl}
              <ExternalLink size={14} className="ml-1" />
            </a>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar size={16} className="mr-1" />
              <span>Created: {urlData.createdAt}</span>
            </div>
            
            {urlData.expiresAt && (
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-1" />
                <span>Expires: {urlData.expiresAt}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-800">{urlData.clicks}</p>
            </div>
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Users size={20} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Daily</p>
              <p className="text-2xl font-bold text-gray-800">
                {daysActive > 0 ? Math.round(urlData.clicks / daysActive) : urlData.clicks}
              </p>
            </div>
            <div className="p-3 rounded-full bg-secondary/10 text-secondary">
              <RefreshCw size={20} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Days Active</p>
              <p className="text-2xl font-bold text-gray-800">{daysActive}</p>
            </div>
            <div className="p-3 rounded-full bg-accent/10 text-accent">
              <Calendar size={20} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Last Clicked</p>
              <p className="text-2xl font-bold text-gray-800">
                {format(new Date(), 'MMM d')}
              </p>
            </div>
            <div className="p-3 rounded-full bg-success/10 text-success">
              <Clock size={20} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Clicks Over Time</h2>
          
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === '7d' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === '30d' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === '90d' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              90D
            </button>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(parseISO(date), 'MMM d')} 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#3a86ff" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Source and Location Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="card"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Top Referrers</h2>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockReferrers}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockReferrers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="card"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Geographic Distribution</h2>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockLocations}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  scale="band" 
                  stroke="#6b7280" 
                  fontSize={12} 
                  width={80}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#3a86ff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Devices Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className="card"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Device Breakdown</h2>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockDevices}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {mockDevices.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;