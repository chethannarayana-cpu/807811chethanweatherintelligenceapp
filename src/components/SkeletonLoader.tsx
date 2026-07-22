import React from 'react';
import { CloudOff, RefreshCw, Search } from 'lucide-react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Current Hero Skeleton */}
      <div className="h-80 rounded-3xl bg-slate-800/60 border border-slate-700/50 p-8 flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-700 rounded-lg" />
            <div className="h-4 w-32 bg-slate-700/60 rounded" />
          </div>
          <div className="h-10 w-24 bg-slate-700/80 rounded-xl" />
        </div>

        <div className="flex items-center gap-6 my-6">
          <div className="h-20 w-32 bg-slate-700 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-6 w-40 bg-slate-700/80 rounded" />
            <div className="h-4 w-28 bg-slate-700/60 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-700/40">
          <div className="h-12 bg-slate-700/50 rounded-xl" />
          <div className="h-12 bg-slate-700/50 rounded-xl" />
          <div className="h-12 bg-slate-700/50 rounded-xl" />
          <div className="h-12 bg-slate-700/50 rounded-xl" />
        </div>
      </div>

      {/* Intelligence & Hourly Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72 rounded-3xl bg-slate-800/60 border border-slate-700/50 p-6" />
        <div className="h-72 rounded-3xl bg-slate-800/60 border border-slate-700/50 p-6" />
      </div>
    </div>
  );
};

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  onSearchFallback: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  onSearchFallback,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center max-w-lg mx-auto my-12 shadow-2xl space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
        <CloudOff className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-white">Weather Data Unavailable</h3>
      <p className="text-sm text-slate-300 leading-relaxed">{message}</p>

      <div className="pt-2 flex items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-sky-500/20"
          id="retry-weather-btn"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <button
          onClick={onSearchFallback}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all border border-slate-700"
          id="search-london-fallback-btn"
        >
          <Search className="w-4 h-4 text-sky-400" />
          <span>Search Major City</span>
        </button>
      </div>
    </div>
  );
};
