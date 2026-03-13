import { AlertTriangle } from 'lucide-react';

export function ErrorState({ message, onRetry }: { message?: string, onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 text-red-500"><AlertTriangle className="w-10 h-10" /></div>
      <p className="text-text-muted font-sans mb-4">
        {message || 'Gagal memuat data.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-primary font-semibold font-sans hover:brightness-90 text-sm"
        >
          Coba lagi →
        </button>
      )}
    </div>
  )
}
