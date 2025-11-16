import React, { createContext, useContext, useState, ReactNode } from 'react';
import Loading from '../components/Loading';

type LoadingContextType = {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const showLoading = (msg?: string) => {
    setMessage(msg);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setMessage(undefined);
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
      {isLoading && <Loading fullscreen message={message} size="lg" />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}