import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Navigation, Compass } from 'lucide-react';
import { GeocodeResult } from '../types';
import { ApiClient } from '../lib/api';

interface MapSearchBarProps {
  onSelectLocation: (result: GeocodeResult) => void;
  className?: string;
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({
  onSelectLocation,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await ApiClient.searchLocations(query.trim());
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error('Location search failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: GeocodeResult) => {
    setQuery(item.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelectLocation(item);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const popularHubs = [
    { label: 'Jewar Airport', query: 'Jewar' },
    { label: 'Dholera SIR', query: 'Dholera' },
    { label: 'Noida', query: 'Noida' },
    { label: 'GIFT City', query: 'GIFT City' },
    { label: 'Bengaluru', query: 'Bengaluru' },
  ];

  return (
    <div ref={dropdownRef} className={`relative select-none ${className}`}>
      {/* Search Input Box Capsule */}
      <div className="flex items-center space-x-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 px-3 py-1.5 rounded-full shadow-md text-xs transition-all w-52 sm:w-64 md:w-72 max-w-[calc(100vw-360px)]">
        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search city, region, or coordinates..."
          className="flex-1 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium focus:outline-none text-xs"
        />
        {isLoading && <Loader2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />}
        {query && !isLoading && (
          <button
            onClick={handleClear}
            className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 md:w-96 max-w-[calc(100vw-40px)] bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-1">
          {/* Quick Shortcuts (when search box is empty or focused) */}
          {!query.trim() && (
            <div className="p-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span>Featured Smart City Hubs</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {popularHubs.map((hub, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(hub.query);
                      inputRef.current?.focus();
                    }}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    {hub.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {results.length > 0 && (
            <div className="space-y-0.5 max-h-64 overflow-y-auto">
              {results.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-start space-x-2.5 ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-100/70 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{item.name}</span>
                        <span className="text-[9.5px] font-mono text-slate-400 dark:text-slate-500 shrink-0 ml-1">
                          {item.lat.toFixed(2)}°, {item.lon.toFixed(2)}°
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5 leading-tight">
                        {item.display_name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty search results message */}
          {query.trim() && !isLoading && results.length === 0 && (
            <div className="p-4 text-center text-slate-500 dark:text-slate-400 space-y-1">
              <p className="font-semibold text-xs text-slate-700 dark:text-slate-200">No exact location matches found</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Try searching for a city name or coordinates (e.g., <strong>28.26, 77.74</strong>).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
