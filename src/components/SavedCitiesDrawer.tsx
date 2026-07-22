import React from 'react';
import { X, Star, MapPin, Trash2, Globe, ArrowRight } from 'lucide-react';
import { SavedLocation } from '../types';

interface SavedCitiesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedLocations: SavedLocation[];
  onSelectLocation: (loc: SavedLocation) => void;
  onToggleFavorite: (id: string) => void;
  onRemoveLocation: (id: string) => void;
}

export const SavedCitiesDrawer: React.FC<SavedCitiesDrawerProps> = ({
  isOpen,
  onClose,
  savedLocations,
  onSelectLocation,
  onToggleFavorite,
  onRemoveLocation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="text-lg font-bold text-white">Saved & Favorite Cities</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-all"
            id="close-saved-drawer-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cities List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedLocations.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <Globe className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-medium">No saved cities yet.</p>
              <p className="text-xs text-slate-500">
                Search for cities worldwide and bookmark them for instant 1-click weather access.
              </p>
            </div>
          ) : (
            savedLocations.map((loc) => (
              <div
                key={loc.id}
                className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-sky-500/40 transition-all flex items-center justify-between group"
              >
                <div
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer"
                  id={`drawer-city-item-${loc.id}`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <span className="font-bold text-slate-100 text-sm group-hover:text-sky-300 transition-colors">
                      {loc.name}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 pl-6">
                    {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onToggleFavorite(loc.id)}
                    className="p-2 text-slate-400 hover:text-amber-400 transition-colors"
                    title={loc.isFavorite ? 'Unstar city' : 'Star city'}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        loc.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-500'
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => onRemoveLocation(loc.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove location"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                    className="p-2 text-sky-400 hover:text-sky-300"
                    title="View Weather"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-500 font-mono">
          Saved locations stored in local browser cache
        </div>
      </div>
    </div>
  );
};
