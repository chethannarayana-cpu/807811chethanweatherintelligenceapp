import React, { useState } from 'react';
import {
  Sparkles,
  Shirt,
  Activity,
  Bike,
  Moon,
  Flower2,
  AlertTriangle,
  Car,
  Clock,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { WeatherIntelligence } from '../types';

interface WeatherIntelligenceSectionProps {
  intelligence: WeatherIntelligence;
  aiBriefing: string | null;
  onFetchAiBriefing: () => void;
  isAiLoading: boolean;
  cityName: string;
}

export const WeatherIntelligenceSection: React.FC<WeatherIntelligenceSectionProps> = ({
  intelligence,
  aiBriefing,
  onFetchAiBriefing,
  isAiLoading,
  cityName,
}) => {
  const [activeTab, setActiveTab] = useState<'briefing' | 'activities' | 'clothing' | 'advisories'>('briefing');

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'Bike':
        return <Bike className="w-5 h-5 text-sky-400" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'Flower2':
        return <Flower2 className="w-5 h-5 text-rose-400" />;
      default:
        return <Activity className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-sky-500/20 to-indigo-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Weather Intelligence & Insights</span>
            </h2>
            <p className="text-xs text-slate-400">
              Smart daily recommendations, activity scores & clothing guide for {cityName}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60 text-xs">
          <button
            onClick={() => setActiveTab('briefing')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === 'briefing'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-briefing-btn"
          >
            Daily Briefing
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === 'activities'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-activities-btn"
          >
            Activity Scores
          </button>
          <button
            onClick={() => setActiveTab('clothing')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === 'clothing'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-clothing-btn"
          >
            Gear Guide
          </button>
          <button
            onClick={() => setActiveTab('advisories')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === 'advisories'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="tab-advisories-btn"
          >
            Advisories
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="pt-5">
        {/* TAB 1: DAILY BRIEFING */}
        {activeTab === 'briefing' && (
          <div className="space-y-4">
            {/* AI Generated Briefing Block */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-indigo-950/40 to-slate-900/60 border border-sky-500/20 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-sky-400" />
                    AI Meteorologist Report
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Gemini 2.5 Flash</span>
                </div>

                <button
                  onClick={onFetchAiBriefing}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                  id="generate-ai-briefing-btn"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      <span>{aiBriefing ? 'Regenerate Briefing' : 'Get AI Analysis'}</span>
                    </>
                  )}
                </button>
              </div>

              {aiBriefing ? (
                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line border-l-2 border-sky-400 pl-3.5 my-2 italic font-serif">
                  {aiBriefing}
                </div>
              ) : (
                <p className="text-sm text-slate-300 leading-relaxed">
                  {intelligence.summary}
                </p>
              )}

              {/* Best Time Outdoor Badge */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Optimal Outdoor Window:</strong> {intelligence.bestTimeOutdoor}
                </span>
              </div>
            </div>

            {/* Commute Advice Bar */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
              <Car className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-0.5">
                  Commute & Travel Index
                </div>
                <div className="text-xs text-slate-300">{intelligence.commuteAdvice}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVITY SCORES */}
        {activeTab === 'activities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intelligence.activityScores.map((act) => (
              <div
                key={act.name}
                className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between hover:bg-slate-800/80 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-700">
                        {getActivityIcon(act.icon)}
                      </div>
                      <span className="font-semibold text-slate-200 text-sm">{act.name}</span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          act.score > 75
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : act.score > 50
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {act.score}% • {act.rating}
                      </span>
                    </div>
                  </div>

                  {/* Score Progress Bar */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden my-2 border border-slate-700/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        act.score > 75
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : act.score > 50
                          ? 'bg-gradient-to-r from-sky-500 to-blue-400'
                          : 'bg-gradient-to-r from-amber-500 to-rose-500'
                      }`}
                      style={{ width: `${act.score}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2">{act.tip}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: CLOTHING & GEAR */}
        {activeTab === 'clothing' && (
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-200">
              <Shirt className="w-5 h-5 text-sky-400" />
              <span>Recommended Outfit & Gear Checklist</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {intelligence.clothingTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HEALTH & ADVISORIES */}
        {activeTab === 'advisories' && (
          <div className="space-y-3">
            {intelligence.healthWarnings.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-800/30 border border-slate-800 rounded-2xl text-sm">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <span>No active weather alerts or extreme atmospheric warnings for this location today.</span>
              </div>
            ) : (
              intelligence.healthWarnings.map((warn, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                    warn.severity === 'alert'
                      ? 'bg-rose-950/40 border-rose-600/40 text-rose-200'
                      : warn.severity === 'warning'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                      : 'bg-sky-950/40 border-sky-500/40 text-sky-200'
                  }`}
                >
                  {warn.severity === 'alert' ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  ) : warn.severity === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  )}

                  <div>
                    <div className="font-bold text-sm mb-0.5">{warn.title}</div>
                    <div className="text-xs opacity-90">{warn.description}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
