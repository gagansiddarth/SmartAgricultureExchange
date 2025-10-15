import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Settings,
  BarChart3,
  Map,
  Bell,
  Download,
  Send,
  RotateCcw
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: number;
}

const AdminNavigation: React.FC = () => {
  const location = useLocation();
  
  console.log('AdminNavigation rendering, current path:', location.pathname);
  
  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      path: '/admin-dashboard'
    },
    {
      id: 'review',
      label: 'Review Queue',
      icon: FileText,
      path: '/admin-dashboard/review',
      badge: 5 // This would come from actual data
    },
    {
      id: 'rejected',
      label: 'Rejected Posts',
      icon: RotateCcw,
      path: '/admin-dashboard/rejected',
      badge: 3 // This would come from actual data
    },
    {
      id: 'deals',
      label: 'Deals Management',
      icon: MessageSquare,
      path: '/admin-dashboard/deals'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      path: '/admin-dashboard/analytics'
    },
    {
      id: 'supply-map',
      label: 'Supply Maps',
      icon: Map,
      path: '/admin-dashboard/supply-map'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      path: '/admin-dashboard/users'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      path: '/admin-dashboard/notifications'
    },
    {
      id: 'operations',
      label: 'Operations',
      icon: Settings,
      path: '/admin-dashboard/operations'
    }
  ];

  return (
    <div className="bg-white shadow-sm border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? 'border-purple-500 text-purple-700 bg-purple-50'
                    : 'border-transparent text-gray-600 hover:text-purple-700 hover:border-purple-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;
