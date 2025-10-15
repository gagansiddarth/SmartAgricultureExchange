import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  User, 
  MapPin, 
  Package,
  DollarSign,
  Calendar,
  ArrowLeft,
  Paperclip,
  Smile,
  MoreVertical,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  LogOut
} from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  attachments?: string[];
  created_at: string;
  is_read: boolean;
  sender_name?: string;
  sender_role?: string;
}

interface ChatPartner {
  id: string;
  name: string;
  role: string;
  phone?: string;
  location?: string;
  rating?: number;
}

const BuyerChat: React.FC = () => {
  const navigate = useNavigate();
  const { farmerId } = useParams<{ farmerId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (farmerId) {
      fetchChatData();
    }
  }, [farmerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('demo_user');
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatData = async () => {
    try {
      setLoading(true);

      // Mock chat partner data
      const partner: ChatPartner = {
        id: farmerId || '',
        name: `Farmer ${farmerId?.slice(0, 8) || 'Unknown'}`,
        role: 'farmer',
        phone: '+919876543210',
        location: 'Karnal, Haryana',
        rating: 4.8
      };

      setChatPartner(partner);

      // Mock messages for demonstration
      const mockMessages: Message[] = [
        {
          id: '1',
          sender_id: farmerId || '',
          receiver_id: 'buyer-1',
          text: 'Hello! I saw your interest in my Basmati rice. I have 50 quintals available for harvest in December.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_read: true,
          sender_name: partner.name,
          sender_role: 'farmer'
        },
        {
          id: '2',
          sender_id: 'buyer-1',
          receiver_id: farmerId || '',
          text: 'Hi! Yes, I\'m interested. What\'s your best price per quintal?',
          created_at: new Date(Date.now() - 3300000).toISOString(),
          is_read: true,
          sender_name: 'You',
          sender_role: 'buyer'
        },
        {
          id: '3',
          sender_id: farmerId || '',
          receiver_id: 'buyer-1',
          text: 'I can offer ₹3,500 per quintal for bulk purchase. The rice is premium quality with excellent aroma.',
          created_at: new Date(Date.now() - 3000000).toISOString(),
          is_read: true,
          sender_name: partner.name,
          sender_role: 'farmer'
        },
        {
          id: '4',
          sender_id: 'buyer-1',
          receiver_id: farmerId || '',
          text: 'That sounds good. Can you provide some sample photos of the crop?',
          created_at: new Date(Date.now() - 2700000).toISOString(),
          is_read: true,
          sender_name: 'You',
          sender_role: 'buyer'
        },
        {
          id: '5',
          sender_id: farmerId || '',
          receiver_id: 'buyer-1',
          text: 'Of course! I\'ll send you some photos tomorrow morning when I visit the field.',
          created_at: new Date(Date.now() - 2400000).toISOString(),
          is_read: true,
          sender_name: partner.name,
          sender_role: 'farmer'
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !farmerId) return;

    try {
      setSending(true);

      const message: Message = {
        id: Date.now().toString(),
        sender_id: 'buyer-1', // Current user ID
        receiver_id: farmerId,
        text: newMessage.trim(),
        created_at: new Date().toISOString(),
        is_read: false,
        sender_name: 'You',
        sender_role: 'buyer'
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Simulate sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here you would typically save to database
      console.log('Message sent:', message);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header - Black/White Theme */}
      <div className="bg-black px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/buyer-dashboard')}
              className="p-3 hover:bg-gray-800 rounded-2xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{chatPartner?.name}</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span>Farmer</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span>{chatPartner?.rating}</span>
                  </div>
                  <span>•</span>
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {chatPartner?.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-3 hover:bg-gray-800 rounded-2xl transition-colors">
              <Phone className="w-5 h-5 text-white" />
            </button>
            <button className="p-3 hover:bg-gray-800 rounded-2xl transition-colors">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.sender_id === 'buyer-1';
          const showDate = index === 0 || 
            formatDate(message.created_at) !== formatDate(messages[index - 1].created_at);

          return (
            <div key={message.id}>
              {/* Date Separator */}
              {showDate && (
                <div className="flex items-center justify-center my-4">
                  <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatDate(message.created_at)}
                  </div>
                </div>
              )}

              {/* Message */}
              <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isCurrentUser 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <div className={`flex items-center justify-end mt-1 space-x-1 ${
                    isCurrentUser ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    <span className="text-xs">{formatTime(message.created_at)}</span>
                    {isCurrentUser && (
                      <div className="flex items-center">
                        {message.is_read ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Black/White Theme */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <button className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-black resize-none"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors">
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white p-3 rounded-2xl transition-colors"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors">
              <Package className="w-4 h-4" />
              <span>View Crop Details</span>
            </button>
            <button className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700 transition-colors">
              <DollarSign className="w-4 h-4" />
              <span>Make Offer</span>
            </button>
            <button className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700 transition-colors">
              <Calendar className="w-4 h-4" />
              <span>Schedule Visit</span>
            </button>
          </div>
          <div className="text-xs text-gray-500">
            Messages are end-to-end encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerChat;
