// src/components/SyncStatus.tsx
import { useSupabaseSync } from '../lib/useSupabaseSync';

interface SyncStatusProps {
  className?: string;
}

export function SyncStatus({ className = '' }: SyncStatusProps) {
  const { isOnline, isSyncing, lastSyncTime } = useSupabaseSync();

  const formatSyncTime = (time: string) => {
    if (!time) return 'Никогда';
    const date = new Date(time);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {/* Статус подключения */}
      <div className="flex items-center gap-1">
        <div 
          className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`} 
        />
        <span className="text-gray-600 dark:text-gray-400">
          {isOnline ? 'Онлайн' : 'Оффлайн'}
        </span>
      </div>

      {/* Статус синхронизации */}
      {isSyncing && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-blue-600 dark:text-blue-400">
            Синхронизация...
          </span>
        </div>
      )}

      {/* Время последней синхронизации */}
      {!isSyncing && lastSyncTime && (
        <span className="text-xs text-gray-500 dark:text-gray-500">
          Синхр: {formatSyncTime(lastSyncTime)}
        </span>
      )}

      {/* Кнопка принудительной синхронизации */}
      {isOnline && !isSyncing && (
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          title="Принудительная синхронизация"
        >
          🔄
        </button>
      )}
    </div>
  );
}
