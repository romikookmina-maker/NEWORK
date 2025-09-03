import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const NotificationContext = createContext();

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    }
  }, [user]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
    }
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
    
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
    }
  };

  const removeNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
    setNotifications(updatedNotifications);
    
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
    }
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    unreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}