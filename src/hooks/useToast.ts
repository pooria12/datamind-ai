import { useState, useEffect } from 'react';
import type { Toast } from '../components/ui/Toast';

const toastId = { current: 0 };
const generateId = () => `toast-${++toastId.current}-${Date.now()}`;

const listeners = new Set<() => void>();
let toasts: Toast[] = [];

function notify() {
  listeners.forEach((listener) => listener());
}

function addToast(toast: Omit<Toast, 'id'> & { id?: string }) {
  const newToast: Toast = { ...toast, id: toast.id || generateId() };
  toasts = [...toasts, newToast];
  notify();
  
  if (toast.duration !== 0) {
    setTimeout(() => {
      removeToast(newToast.id);
    }, toast.duration ?? 5000);
  }
  
  return newToast.id;
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

function useToasts() {
  const [, setTick] = useState(0);
  
  useEffect(() => {
    const listener = (): void => { setTick((t) => t + 1); };
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  
  return toasts;
}

export function useToast() {
  useToasts();
  
  return {
    toast: (options: Omit<Toast, 'id'>) => addToast(options),
    dismiss: removeToast,
    success: (title: string, description?: string) => addToast({ title, description, variant: 'success' }),
    error: (title: string, description?: string) => addToast({ title, description, variant: 'destructive' }),
    warning: (title: string, description?: string) => addToast({ title, description, variant: 'warning' }),
    info: (title: string, description?: string) => addToast({ title, description, variant: 'info' }),
  };
}