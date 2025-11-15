import React, { createContext, useContext, useMemo, useState } from 'react';
import type { NotificationItem } from '../components/NotificationMenu';

type AddNotificationInput = {
  title: string;
  subtitle?: string;
  path?: string;
};

type NotificationContextData = {
  items: NotificationItem[];
  unreadCount: number;
  addNotification: (data: AddNotificationInput) => void;
  markAsRead: (id: string | number) => void;
  markAllAsRead: () => void;
};

const NotificationContext = createContext<NotificationContextData | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<NotificationItem[]>([]);

  const addNotification = (data: AddNotificationInput) => {
    const id = Date.now();

    setItems((prev) => [
      {
        id,
        title: data.title,
        subtitle: data.subtitle,
        path: data.path,
        read: false,
      },
      ...prev,
    ]);
  };

  const markAsRead = (id: string | number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const markAllAsRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const unreadCount = useMemo(() => items.filter((item) => !item.read).length, [items]);

  const value: NotificationContextData = {
    items,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotification precisa estar dentro de NotificationProvider');
  }
  return ctx;
}
