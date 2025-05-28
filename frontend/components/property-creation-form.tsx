"use client";

import React, { useState } from 'react';
import { ImageUpload } from './image-upload';
import { Building, MapPin, DollarSign, Home, Save, X } from 'lucide-react';

interface UploadedImage {
  url: string;
  key: string;
  originalName: string;
  size: number;
}

interface PropertyFormData {
  name: string;
  description: string;
  pricePerMonth: number;
  securityDeposit: number;
  applicationFee: number;
  beds: number;
  baths: number;
  squareFeet: number;
  propertyType: string;
  isPetsAllowed: boolean;
  isParkingIncluded: boolean;
  amenities: string[];
  highlights: string[];
  // Location data
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface PropertyCreationFormProps {
  onSubmit: (data: PropertyFormData & { images: UploadedImage[] }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const PROPERTY_TYPES = [
  'Apartment',
  'Villa',
  'Townhouse',
  'Cottage',
  'Rooms',
  'Tinyhouse'
];

const AMENITIES = [
  'WasherDryer',
  'AirConditioning', 
  'Dishwasher',
  'HighSpeedInternet',
  'HardwoodFloors',
  'WalkInClosets',
  'Microwave',
  'Refrigerator',
  'Pool',
  'Gym',
  'Parking',
  'PetsAllowed',
  'WiFi'
];

const HIGHLIGHTS = [
  'HighSpeedInternetAccess',
  'WasherDryer',
  'AirConditioning',
  'Heating',
  'SmokeFree',
  'CableReady',
  'SatelliteTV',
  'DoubleVanities',
  'TubShower',
  'Intercom',
  'SprinklerSystem',
  'RecentlyRenovated',
  'CloseToTransit',
  'GreatView',
  'QuietNeighborhood'
];

export const PropertyCreationForm: React.FC<PropertyCreationFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    description: '',
    pricePerMonth: 0,
    securityDeposit: 0,
    applicationFee: 0,
    beds: 1,
    baths: 1,
    squareFeet: 0,
    propertyType: 'Apartment',
    isPetsAllowed: false,
    isParkingIncluded: false,
    amenities: [],
    highlights: [],
    address: '',
    city: '',
    state: '',
    country: 'USA',
    postalCode: ''
  });

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxArrayChange = (field: 'amenities' | 'highlights', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert('Property name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Property description is required');
      return;
    }
    
    if (formData.pricePerMonth <= 0) {
      alert('Price per month must be greater than 0');
      return;
    }
    
    if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim()) {
      alert('Complete address is required');
      return;
    }
    
    if (images.length === 0) {
      alert('At least one image is required');
      return;
    }

    onSubmit({ ...formData, images });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building className="h-6 w-6 text-muted-red" />
          <h2 className="text-2xl font-medium text-soft-black">Create New Property</h2>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-warm-grey hover:text-soft-black transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
            <Home className="h-5 w-5 text-gray-400" />
            <span>Basic Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Property Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent"
                placeholder="Beautiful 2BR Downtown Apartment"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Property Type</label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent"
              >
                {PROPERTY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent"
              placeholder="Describe the property, its features, and what makes it special..."
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <span>Property Details</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Monthly Rent ($)</label>
              <input
                type="number"
                value={formData.pricePerMonth}
                onChange={(e) => handleInputChange('pricePerMonth', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Security Deposit ($)</label>
              <input
                type="number"
                value={formData.securityDeposit}
                onChange={(e) => handleInputChange('securityDeposit', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Application Fee ($)</label>
              <input
                type="number"
                value={formData.applicationFee}
                onChange={(e) => handleInputChange('applicationFee', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Bedrooms</label>
              <input
                type="number"
                value={formData.beds}
                onChange={(e) => handleInputChange('beds', parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Bathrooms</label>
              <input
                type="number"
                value={formData.baths}
                onChange={(e) => handleInputChange('baths', parseFloat(e.target.value) || 1)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent"
                min="0"
                step="0.5"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Square Feet</label>
              <input
                type="number"
                value={formData.squareFeet}
                onChange={(e) => handleInputChange('squareFeet', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isPetsAllowed}
                onChange={(e) => handleInputChange('isPetsAllowed', e.target.checked)}
                className="w-4 h-4 text-muted-red border-gray-300 rounded focus:ring-muted-red"
              />
              <label className="text-sm text-gray-700">Pets Allowed</label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isParkingIncluded}
                onChange={(e) => handleInputChange('isParkingIncluded', e.target.checked)}
                className="w-4 h-4 text-muted-red border-gray-300 rounded focus:ring-muted-red"
              />
              <label className="text-sm text-gray-700">Parking Included</label>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span>Location</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-2">Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent"
                placeholder="123 Main Street"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent"
                placeholder="New York"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent"
                placeholder="NY"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent"
                placeholder="USA"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-muted-red focus:border-transparent"
                placeholder="10001"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Property Images</h3>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={10}
          />
        </div>

        {/* Amenities */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {AMENITIES.map(amenity => (
              <div key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleCheckboxArrayChange('amenities', amenity)}
                  className="w-4 h-4 text-muted-red border-gray-300 rounded focus:ring-muted-red"
                />
                <label className="text-sm text-gray-700">{amenity.replace(/([A-Z])/g, ' $1').trim()}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Highlights</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {HIGHLIGHTS.map(highlight => (
              <div key={highlight} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.highlights.includes(highlight)}
                  onChange={() => handleCheckboxArrayChange('highlights', highlight)}
                  className="w-4 h-4 text-muted-red border-gray-300 rounded focus:ring-muted-red"
                />
                <label className="text-sm text-gray-700">{highlight.replace(/([A-Z])/g, ' $1').trim()}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-charcoal-grey hover:text-soft-black transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-muted-red text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? 'Creating...' : 'Create Property'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};