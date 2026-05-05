"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, Search, X } from "lucide-react";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Location {
  type: 'city' | 'district';
  id: string;
  province_id: number;
  city_id: number;
  district_id: number | null;
  province_name: string;
  city_name: string;
  district_name: string | null;
  display_name: string;
}

interface LocationAutocompleteProps {
  onSelect: (location: Location | null) => void;
  placeholder?: string;
  className?: string;
}

export function LocationAutocomplete({ onSelect, placeholder, className }: LocationAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDisplay, setSelectedDisplay] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await apiClient.get(`/locations/search?q=${encodeURIComponent(query)}`);
        setResults(response.data.data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchLocations, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (location: Location) => {
    setSelectedDisplay(location.display_name);
    setQuery("");
    setIsOpen(false);
    onSelect(location);
  };

  const handleClear = () => {
    setSelectedDisplay("");
    setQuery("");
    onSelect(null);
  };

  return (
    <div className={cn("relative flex items-center gap-3 w-full h-full", className)} ref={containerRef}>
      <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
      <div className="relative flex-1">
        {selectedDisplay ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-foreground text-base truncate font-medium">{selectedDisplay}</span>
            <button 
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <input
            className="border-none shadow-none focus:ring-0 p-0 bg-transparent text-foreground placeholder:text-muted-foreground text-base h-auto w-full outline-none"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
        )}
      </div>

      {isOpen && (query.length >= 2 || isLoading) && (
        <div className="absolute top-[calc(100%+12px)] left-[-40px] md:left-[-60px] right-[-40px] md:right-[-60px] bg-white border border-border rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto overflow-x-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Searching locations...</span>
            </div>
          ) : results.length > 0 ? (
            results.map((loc) => (
              <button
                key={`${loc.province_id}-${loc.city_id}-${loc.district_id ?? 'd'}`}
                onClick={() => handleSelect(loc)}
                className="w-full text-left px-6 py-3 hover:bg-muted/50 transition-colors flex flex-col gap-0.5 border-b border-border/5 last:border-0"
              >
                <span className="text-sm font-bold text-primary">
                  {loc.type === 'district' ? loc.district_name : loc.city_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {loc.province_name} {loc.type === 'district' ? `- ${loc.city_name}` : ''}
                </span>
              </button>
            ))
          ) : (
            <div className="px-6 py-6 text-center text-muted-foreground">
              <p className="text-sm">No locations found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
