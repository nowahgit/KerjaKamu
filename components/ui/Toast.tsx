"use client";

import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

const toastStyles: Record<ToastType, string> = {
  success: 'border-l-4 border-success bg-card',
  error: 'border-l-4 border-error bg-card',
  info: 'border-l-4 border-primary bg-card',
};

import { CheckCircle, XCircle, Info } from 'lucide-react';

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 text-green-500" />,
  error: <XCircle className="w-4 h-4 text-red-500" />,
  info: <Info className="w-4 h-4 text-blue-500" />,
};

export function Toast({ type = 'info', message, onClose }: { type?: ToastType, message: string, onClose: () => void }) {
  useEffect(() => {
    if (type !== 'error') {
      const timer = setTimeout(onClose, type === 'info' ? 4000 : 3000)
      return () => clearTimeout(timer)
    }
  }, [type, onClose])

  return (
    <div className={`
      flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg
      font-sans text-sm text-text-primary
      min-w-[280px] max-w-sm
      ${toastStyles[type] || toastStyles.info}
    `}>
      <span>{toastIcons[type] || toastIcons.info}</span>
      <p className="flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-text-muted hover:text-text-primary ml-2"
      >
        ✕
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, removeToast }: { toasts: ToastMessage[], removeToast: (id: number) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}
