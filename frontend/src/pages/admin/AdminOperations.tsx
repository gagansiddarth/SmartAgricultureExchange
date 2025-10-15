import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Bell, 
  Download, 
  Upload, 
  Settings, 
  Users, 
  FileText, 
  Database,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  Mail,
  MessageSquare,
  Calendar,
  Clock
} from 'lucide-react';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: string;
}

interface BulkAction {
  id: string;
  type: 'approve' | 'reject' | 'delete' | 'export' | 'notify';
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const AdminOperations: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Mock data for demonstration
  const mockNotifications: Notification[] = [
    {
      id: '1',
      user_id: 'farmer-1',
      type: 'crop_post_reviewed',
      title: 'Crop Post Approved',
      message: 'Your rice post has been approved and is now live',
      data: { crop_post_id: 'post-1', status: 'approved' },
      is_read: false,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      user_id: 'farmer-2',
      type: 'crop_post_reviewed',
      title: 'Crop Post Rejected',
      message: 'Your wheat post was rejected due to insufficient documentation',
      data: { crop_post_id: 'post-2', status: 'rejected' },
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '3',
      user_id: 'buyer-1',
      type: 'new_post_available',
      title: 'New Crop Available',
      message: 'Fresh basmati rice is now available in your area',
      data: { crop_post_id: 'post-3' },
      is_read: true,
      created_at: new Date(Date.now() - 7200000).toISOString()
    }
  ];

  const bulkActions: BulkAction[] = [
    {
      id: 'approve',
      type: 'approve',
      label: 'Approve Selected',
      description: 'Approve all selected crop posts',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'reject',
      type: 'reject',
      label: 'Reject Selected',
      description: 'Reject all selected crop posts',
      icon: <XCircle className="w-5 h-5" />,
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      id: 'export',
      type: 'export',
      label: 'Export Data',
      description: 'Export selected items to CSV',
      icon: <Download className="w-5 h-5" />,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'notify',
      type: 'notify',
      label: 'Send Notifications',
      description: 'Send notifications to selected users',
      icon: <Bell className="w-5 h-5" />,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'delete',
      type: 'delete',
      label: 'Delete Selected',
      description: 'Delete selected items (irreversible)',
      icon: <Trash2 className="w-5 h-5" />,
      color: 'bg-red-600 hover:bg-red-700'
    }
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, use mock data since notifications table might not exist
      console.log('📬 Fetching notifications...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNotifications(mockNotifications);
      console.log('✅ Notifications loaded:', mockNotifications.length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(`Failed to fetch notifications: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action: BulkAction) => {
    if (selectedItems.length === 0) {
      alert('Please select items first');
      return;
    }

    try {
      setBulkActionLoading(true);

      switch (action.type) {
        case 'approve':
          await handleBulkApprove();
          break;
        case 'reject':
          await handleBulkReject();
          break;
        case 'export':
          await handleBulkExport();
          break;
        case 'notify':
          await handleBulkNotify();
          break;
        case 'delete':
          await handleBulkDelete();
          break;
        default:
          console.log('Unknown bulk action:', action.type);
      }

      setSelectedItems([]);
      setShowBulkActions(false);
    } catch (err) {
      console.error('Error performing bulk action:', err);
      alert(`Error: ${err.message || 'Unknown error'}`);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkApprove = async () => {
    console.log('✅ Approving items:', selectedItems);
    // Implement bulk approve logic
    alert(`Approved ${selectedItems.length} items`);
  };

  const handleBulkReject = async () => {
    console.log('❌ Rejecting items:', selectedItems);
    // Implement bulk reject logic
    alert(`Rejected ${selectedItems.length} items`);
  };

  const handleBulkExport = async () => {
    console.log('📊 Exporting items:', selectedItems);
    
    const csvData = [
      ['ID', 'Type', 'Title', 'Message', 'Created At'],
      ...selectedItems.map(id => {
        const notification = notifications.find(n => n.id === id);
        return [
          notification?.id || '',
          notification?.type || '',
          notification?.title || '',
          notification?.message || '',
          notification?.created_at || ''
        ];
      })
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notifications-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkNotify = async () => {
    console.log('🔔 Sending notifications to items:', selectedItems);
    // Implement bulk notification logic
    alert(`Sent notifications for ${selectedItems.length} items`);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} items? This action cannot be undone.`)) {
      return;
    }
    
    console.log('🗑️ Deleting items:', selectedItems);
    // Implement bulk delete logic
    alert(`Deleted ${selectedItems.length} items`);
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(notifications.map(n => n.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-gray-600">Loading operations data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operations Center</h2>
          <p className="text-slate-600">Manage notifications, bulk actions, and system operations</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchNotifications}
            className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Selection Controls */}
      {notifications.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedItems.length === notifications.length}
                  onChange={selectedItems.length === notifications.length ? clearSelection : selectAllItems}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {selectedItems.length} of {notifications.length} selected
                </span>
              </div>
              {selectedItems.length > 0 && (
                <button
                  onClick={clearSelection}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear selection
                </button>
              )}
            </div>
            {selectedItems.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  Bulk Actions ({selectedItems.length})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Actions Panel */}
      {showBulkActions && selectedItems.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Bulk Actions for {selectedItems.length} selected items
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {bulkActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleBulkAction(action)}
                disabled={bulkActionLoading}
                className={`${action.color} text-white p-4 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50`}
              >
                {action.icon}
                <div className="text-left">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">System Notifications</h3>
          <p className="text-sm text-gray-600 mt-1">Manage platform notifications and user communications</p>
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No notifications found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  selectedItems.includes(notification.id) ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(notification.id)}
                    onChange={() => toggleItemSelection(notification.id)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 mt-1"
                  />
                  
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.type === 'crop_post_reviewed' ? 'bg-blue-100' :
                    notification.type === 'new_post_available' ? 'bg-green-100' :
                    'bg-gray-100'
                  }`}>
                    {notification.type === 'crop_post_reviewed' ? (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    ) : notification.type === 'new_post_available' ? (
                      <Bell className="w-5 h-5 text-green-600" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium ${
                        notification.is_read ? 'text-gray-600' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          notification.type === 'crop_post_reviewed' ? 'bg-blue-100 text-blue-700' :
                          notification.type === 'new_post_available' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {notification.type.replace('_', ' ')}
                        </span>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(notification.created_at).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>User: {notification.user_id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Database Operations */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Database Operations</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Download className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">Export All Data</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-medium">Optimize Database</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4 text-orange-600" />
              <span className="text-orange-700 font-medium">Database Settings</span>
            </button>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <Mail className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 font-medium">Send Bulk Emails</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">User Analytics</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-red-700 font-medium">Flagged Users</span>
            </button>
          </div>
        </div>

        {/* System Monitoring */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">System Monitoring</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-medium">System Health</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">Generate Reports</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-orange-700 font-medium">Scheduled Tasks</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOperations;
