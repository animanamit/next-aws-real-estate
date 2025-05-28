"use client";

import React from 'react';
import { MapPin, Home, Navigation } from 'lucide-react';
import { useFindNearestPropertiesQuery } from '@/state/api';
import PropertyCard from './property-card';

interface NearbyPropertiesProps {
  propertyId: number;
  radius?: number;
  limit?: number;
  className?: string;
}

export const NearbyProperties: React.FC<NearbyPropertiesProps> = ({
  propertyId,
  radius = 5,
  limit = 6,
  className = ""
}) => {
  const { data: nearbyData, isLoading, error } = useFindNearestPropertiesQuery({
    propertyId,
    radius,
    limit
  });

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl p-6 ${className}`}>
        <div className="flex items-center space-x-2 mb-6">
          <Navigation className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Nearby Properties</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading nearby properties:', error);
    return (
      <div className={`bg-white rounded-xl p-6 ${className}`}>
        <div className="flex items-center space-x-2 mb-6">
          <Navigation className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Nearby Properties</h3>
        </div>
        <div className="text-center py-8">
          <Home className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Unable to load nearby properties</p>
        </div>
      </div>
    );
  }

  const nearbyProperties = nearbyData?.data || [];

  if (nearbyProperties.length === 0) {
    return (
      <div className={`bg-white rounded-xl p-6 ${className}`}>
        <div className="flex items-center space-x-2 mb-6">
          <Navigation className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Nearby Properties</h3>
        </div>
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No nearby properties found within {radius} km</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Navigation className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Nearby Properties</h3>
        </div>
        <div className="text-sm text-gray-500">
          {nearbyProperties.length} within {radius} km
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearbyProperties.map((property: any, index: number) => {
          // Format property data to match expected structure
          const formattedProperty = {
            id: property.id,
            title: property.name || "Property",
            description: property.description || "Beautiful property",
            price: property.pricePerMonth || 0,
            bedrooms: property.beds || 0,
            bathrooms: property.baths || 0,
            squareFeet: property.squareFeet || 0,
            propertyType: property.propertyType || "apartment",
            photoUrls: property.photoUrls || [],
            amenities: property.amenities || [],
            highlights: property.highlights || [],
            location: {
              address: property.address || "",
              city: property.city || "",
              state: property.state || "",
              country: property.country || "USA",
              coordinates: {
                lat: property.lat || 0,
                lng: property.lng || 0
              }
            },
            distance: property.distance_meters ? Math.round(property.distance_meters / 1000 * 10) / 10 : null
          };

          return (
            <div key={property.id || index} className="relative">
              <PropertyCard property={formattedProperty} viewType="grid" />
              {formattedProperty.distance && (
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {formattedProperty.distance} km away
                </div>
              )}
            </div>
          );
        })}
      </div>

      {nearbyData?.meta && (
        <div className="mt-4 text-xs text-gray-400 text-center">
          Search radius: {nearbyData.meta.radius_km} km • 
          Reference property: #{nearbyData.meta.reference_property_id}
        </div>
      )}
    </div>
  );
};