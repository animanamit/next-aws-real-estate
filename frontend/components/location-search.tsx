"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapPin, Search, Target, Clock, X, Loader2 } from 'lucide-react';
import { useGeocodeAddressMutation, useFindPropertiesNearPointMutation, useSearchPropertiesByLocationQuery } from '@/state/api';

interface LocationSearchProps {
  onLocationSelect: (location: {
    coordinates: { lat: number; lng: number };
    address: string;
    city: string;
    state: string;
    country: string;
  }) => void;
  onPropertiesFound: (properties: any[], searchMeta: any) => void;
  placeholder?: string;
  className?: string;
}

interface SearchSuggestion {
  id: string;
  display: string;
  location: {
    coordinates: { lat: number; lng: number };
    address: string;
    city: string;
    state: string;
    country: string;
  };
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  onPropertiesFound,
  placeholder = "Search by city, address, or zip code...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [searchRadius, setSearchRadius] = useState(10); // km
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [geocodeAddress] = useGeocodeAddressMutation();
  const [findPropertiesNearPoint] = useFindPropertiesNearPointMutation();
  
  // Disable auto-search for now to avoid errors
  // const { data: locationSearchResults } = useSearchPropertiesByLocationQuery(
  //   { q: query, radius: searchRadius, limit: 20 },
  //   { skip: query.length < 2 }
  // );

  // Mock suggestions for common US locations - replace with real geocoding service
  const mockSuggestions = [
    { display: "New York, NY", city: "New York", state: "NY", country: "USA" },
    { display: "Brooklyn, NY", city: "Brooklyn", state: "NY", country: "USA" },
    { display: "Manhattan, NY", city: "Manhattan", state: "NY", country: "USA" },
    { display: "Chicago, IL", city: "Chicago", state: "IL", country: "USA" },
    { display: "Los Angeles, CA", city: "Los Angeles", state: "CA", country: "USA" },
    { display: "San Francisco, CA", city: "San Francisco", state: "CA", country: "USA" },
    { display: "Miami, FL", city: "Miami", state: "FL", country: "USA" },
    { display: "Austin, TX", city: "Austin", state: "TX", country: "USA" },
    { display: "Seattle, WA", city: "Seattle", state: "WA", country: "USA" },
    { display: "Denver, CO", city: "Denver", state: "CO", country: "USA" },
    { display: "Atlanta, GA", city: "Atlanta", state: "GA", country: "USA" },
    { display: "Boston, MA", city: "Boston", state: "MA", country: "USA" },
  ];

  // Generate suggestions based on query
  useEffect(() => {
    if (query.length >= 2) {
      const filtered = mockSuggestions
        .filter(suggestion => 
          suggestion.display.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map((suggestion, index) => ({
          id: `suggestion-${index}`,
          display: suggestion.display,
          location: {
            coordinates: { lat: 0, lng: 0 }, // Will be geocoded
            address: "",
            city: suggestion.city,
            state: suggestion.state,
            country: suggestion.country
          }
        }));
      
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(async (suggestion?: SearchSuggestion) => {
    if (!suggestion && (!query || query.length < 2)) {
      alert('Please enter a location to search');
      return;
    }

    setIsSearching(true);
    
    // Parse the query to extract city, state (assume USA)
    let city = query;
    let state = "";
    let country = "USA";
    
    if (!suggestion) {
      // Try to parse common US formats like "City, State" or "City, ST"
      const parts = query.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        city = parts[0];
        state = parts[1]; // Assume second part is state
        country = "USA";
      }
      // If single word, just use as city name
    }

    const searchSuggestion = suggestion || {
      display: query,
      location: {
        coordinates: { lat: 0, lng: 0 },
        address: "",
        city: city,
        state: state,
        country: country
      }
    };

    try {
      // Geocode the selected location
      const geocodeResult = await geocodeAddress({
        address: searchSuggestion.location.address || "",
        city: searchSuggestion.location.city,
        state: searchSuggestion.location.state || "",
        country: searchSuggestion.location.country
      }).unwrap();
      
      if (geocodeResult.success) {
        const location = {
          coordinates: geocodeResult.data.coordinates,
          address: "",
          city: searchSuggestion.location.city,
          state: searchSuggestion.location.state,
          country: searchSuggestion.location.country
        };
        
        onLocationSelect(location);
        
        // Find properties near this location
        const propertiesResult = await findPropertiesNearPoint({
          centerPoint: geocodeResult.data.coordinates,
          radiusKm: searchRadius,
          limit: 50
        }).unwrap();
        
        if (propertiesResult.success) {
          onPropertiesFound(propertiesResult.data, propertiesResult.meta);
        } else {
          alert('No properties found in this area. Try a different location or increase the search radius.');
        }
      } else {
        alert('Failed to geocode the location. Please try a different search term.');
      }
    } catch (error) {
      console.error('Error searching for properties:', error);
      let errorMessage = 'Failed to search for properties. Please try again.';
      
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = error.data as any;
        if (errorData?.error) {
          errorMessage = `Search failed: ${errorData.error}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSearching(false);
    }
  }, [geocodeAddress, findPropertiesNearPoint, onLocationSelect, onPropertiesFound, searchRadius, query]);

  const handleSuggestionClick = useCallback(async (suggestion: SearchSuggestion) => {
    setQuery(suggestion.display);
    setSelectedLocation(suggestion.display);
    setIsOpen(false);
    await handleSearch(suggestion);
  }, [handleSearch]);

  const handleCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setSelectedLocation('Current Location');
          setQuery('Current Location');
          setIsOpen(false);
          
          const location = {
            coordinates,
            address: "Current Location",
            city: "",
            state: "",
            country: ""
          };
          
          onLocationSelect(location);
          
          try {
            const propertiesResult = await findPropertiesNearPoint({
              centerPoint: coordinates,
              radiusKm: searchRadius,
              limit: 50
            }).unwrap();
            
            if (propertiesResult.success) {
              onPropertiesFound(propertiesResult.data, propertiesResult.meta);
            }
          } catch (error) {
            console.error('Error finding nearby properties:', error);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Unable to get your current location');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser');
    }
  }, [findPropertiesNearPoint, onLocationSelect, onPropertiesFound, searchRadius]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setSelectedLocation('');
    setIsOpen(false);
    setSuggestions([]);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsOpen(false);
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isSearching}
          className="w-full pl-10 pr-32 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent text-sm disabled:opacity-50"
        />
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
          {isSearching && (
            <Loader2 className="h-4 w-4 text-muted-red animate-spin" />
          )}
          {!isSearching && query && (
            <>
              <button
                onClick={() => handleSearch()}
                className="p-1 text-muted-red hover:text-red-600 transition-colors"
                title="Search"
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                onClick={clearSearch}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
          {!isSearching && (
            <button
              onClick={handleCurrentLocation}
              className="p-1 text-gray-400 hover:text-muted-red transition-colors"
              title="Use current location"
            >
              <Target className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Radius Selector */}
      <div className="mt-2 flex items-center space-x-3 text-sm text-gray-600">
        <span>Search radius:</span>
        <select
          value={searchRadius}
          onChange={(e) => setSearchRadius(parseInt(e.target.value))}
          className="px-2 py-1 border border-gray-200 rounded text-sm"
        >
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
          <option value={25}>25 km</option>
          <option value={50}>50 km</option>
        </select>
        {selectedLocation && (
          <div className="flex items-center space-x-1 text-muted-red">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-40">{selectedLocation}</span>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 text-sm"
            >
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900">{suggestion.display}</span>
            </button>
          ))}
          
          {/* Current Location Option */}
          <button
            onClick={handleCurrentLocation}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 text-sm border-t border-gray-100"
          >
            <Target className="h-4 w-4 text-muted-red flex-shrink-0" />
            <span className="text-gray-900">Use current location</span>
          </button>
        </div>
      )}

      {/* Search status */}
      {isSearching && (
        <div className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Searching for properties...</span>
        </div>
      )}
    </div>
  );
};