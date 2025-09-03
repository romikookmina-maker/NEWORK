import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Bell, MessageCircle, LogOut, Settings, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function Header({ showBackButton = false, title = '' }) {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setShowNotifications(false);
    
    if (notification.type === 'message') {
      navigate('/messages');
    } else if (notification.type === 'appointment') {
      navigate(user.type === 'professional' ? '/dashboard' : '/profile');
    }
  };

  return (
    <header className="glass-effect sticky top-0 z-40 border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold gradient-text">Nework</span>
            </Link>
            
            {title && (
              <div className="hidden md:block">
                <span className="text-lg font-semibold text-gray-700">{title}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Messages */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/messages')}
                className="hover:bg-white/20"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="hover:bg-white/20"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="notification-panel"
                >
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <span className="font-semibold">Notificaciones</span>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Marcar todas como leídas
                      </Button>
                    )}
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No tienes notificaciones
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notification) => (
                        <div
                          key={notification.id}
                          className={`notification-item cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProfile(!showProfile)}
                className="hover:bg-white/20 p-1"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>

              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full right-0 mt-2 w-48 glass-effect rounded-xl shadow-2xl z-50"
                >
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {user?.type === 'professional' ? 'Profesional' : 'Cliente'}
                    </span>
                  </div>
                  
                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="nav-item w-full text-left"
                      onClick={() => setShowProfile(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                    
                    {user?.type === 'professional' && (
                      <Link
                        to="/dashboard"
                        className="nav-item w-full text-left"
                        onClick={() => setShowProfile(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Panel Profesional</span>
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="nav-item w-full text-left text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}