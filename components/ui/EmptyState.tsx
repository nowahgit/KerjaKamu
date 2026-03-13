import { Inbox } from 'lucide-react';
import React from 'react';

export function EmptyState({ icon, title, description }: { icon?: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-gray-400">{icon || <Inbox className="w-12 h-12" />}</div>
      <h3 className="font-bold text-text-primary font-sans text-lg mb-2">
        {title}
      </h3>
      <p className="text-text-muted font-sans text-sm max-w-xs">
        {description}
      </p>
    </div>
  )
}
