import React from 'react';
import { Star, MapPin, X, Plus } from 'lucide-react';
import { SavedLocation } from '../types';

interface SavedCitiesBarProps {
  savedLocations: SavedLocation[];
  currentLocationName: string;
  onSelectSaved: (loc: SavedLocation) => void;
  onToggleFavorite: (id: string) => void;
  onRemoveSaved: (id: string) => void;
  onSaveCurrentLocation: () => void;
  isCurrentSaved: boolean;
}

export const SavedCitiesBar: React.FC<SavedCitiesBarProps> = ({
  savedLocations,
  currentLocationName,
  onSelectSaved,
  onToggleFavorite,
  onRemoveSaved,
  onSaveCurrentLocation,
  isCurrentSaved,
}) => {
  return (
    <div className="bg-slate-900/50 border-b border-slate-800/80 py-2.5 px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
            Saved Places
          </span>

          {!isCurrentSaved && (
            <button
              onClick={onSaveCurrentLocation}
              className="px-2.5 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-medium flex items-center gap-1 transition-all"
              id="save-current-city-btn"
            >
              <Plus className="w-3 h-3" />
              <span>Bookmark {currentLocationName}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-0.5 max-w-full">
          {savedLocations.length === 0 ? (
            <span className="text-slate-500 text-xs italic">
              No saved cities yet. Bookmark your favorite places for quick access!
            </span>
          ) : (
            savedLocations.map((loc) => {
              const isSelected =
                currentLocationName.toLowerCase() === loc.name.toLowerCase();

              return (
                <div
                  key={loc.id}
                  className={`group shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-medium ring-1 ring-sky-400/40'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                  }`}
                >
                  <button
                    onClick={() => onSelectSaved(loc)}
                    className="flex items-center gap-1.5 text-left"
                    id={`saved-city-${loc.id}`}
                  >
                    <MapPin className={`w-3 h-3 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span className="truncate max-w-[120px]">{loc.name}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(loc.id);
                    }}
                    className="p-0.5 hover:text-amber-400 transition-colors"
                    title={loc.isFavorite ? 'Unstar city' : 'Star city'}
                  >
                    <Star
                      className={`w-3 h-3 ${
                        loc.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-500'
                      }`}
                    />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSaved(loc.id);
                    }}
                    className="p-0.5 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from saved"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
