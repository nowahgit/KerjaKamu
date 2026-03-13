import { useState } from 'react'
import { ToastMessage, ToastType } from '@/components/ui/Toast'

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: ToastType, message: string) => {
    setToasts(prev => {
      const isDuplicate = prev.some(t => t.message === message && t.type === type);
      if (isDuplicate) return prev;
      const id = Date.now();
      return [...prev, { id, type, message }];
    });
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return {
    toasts,
    removeToast,
    success: (msg: string) => addToast('success', msg),
    error: (msg: string) => addToast('error', msg),
    info: (msg: string) => addToast('info', msg),
  }
}
