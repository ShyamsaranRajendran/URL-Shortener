import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ExternalLink, 
  LayoutDashboard, 
  Link as LinkIcon, 
  BarChart, 
  Settings, 
  Users, 
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Create Link', icon: <LinkIcon size={20} />, path: '/shorten' },
    { name: 'Analytics', icon: <BarChart size={20} />, path: '/analytics/1' },
    { name: 'Team', icon: <Users size={20} />, path: '/team' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    { name: 'Help', icon: <HelpCircle size={20} />, path: '/help' }
  ];

  return (
    <aside 
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-4'} border-b border-gray-200`}>
        {collapsed ? (
          <ExternalLink className="h-6 w-6 text-primary" />
        ) : (
          <Link to="/" className="flex items-center space-x-2 text-primary font-semibold text-xl">
            <ExternalLink className="h-6 w-6" />
            <span>Shorty</span>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center ${
                  collapsed ? 'justify-center' : 'px-4'
                } py-2 rounded-md ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100'
                } transition-colors`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3 text-sm font-medium">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;