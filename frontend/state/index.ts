import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  location: string;
  beds: string;
  baths: string;
  propertyType: string;
  amenities: string[];
  priceRange: [number, number] | [null, null];
  squareFeet: [number, number] | [null, null];
  coordinates: [number, number];
  availableFrom?: string;
}

export interface GlobalState {
  filters: FiltersState;
  isFiltersFullOpen: boolean;
  isSidebarOpen: boolean;
  isDarkMode: boolean;
}

const initialState: GlobalState = {
  filters: {
    location: "",
    beds: "any",
    baths: "any",
    propertyType: "any",
    amenities: [],
    priceRange: [null, null],
    squareFeet: [null, null],
    coordinates: [-122.4194, 37.7749], // Default to San Francisco
    availableFrom: "",
  },
  isFiltersFullOpen: false,
  isSidebarOpen: false,
  isDarkMode: false,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    toggleFiltersFullOpen: (state) => {
      state.isFiltersFullOpen = !state.isFiltersFullOpen;
    },
    setFiltersFullOpen: (state, action: PayloadAction<boolean>) => {
      state.isFiltersFullOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.filters.location = action.payload;
    },
    setCoordinates: (state, action: PayloadAction<[number, number]>) => {
      state.filters.coordinates = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number] | [null, null]>) => {
      state.filters.priceRange = action.payload;
    },
    setBeds: (state, action: PayloadAction<string>) => {
      state.filters.beds = action.payload;
    },
    setBaths: (state, action: PayloadAction<string>) => {
      state.filters.baths = action.payload;
    },
    setPropertyType: (state, action: PayloadAction<string>) => {
      state.filters.propertyType = action.payload;
    },
    setAmenities: (state, action: PayloadAction<string[]>) => {
      state.filters.amenities = action.payload;
    },
    toggleAmenity: (state, action: PayloadAction<string>) => {
      const amenity = action.payload;
      const currentAmenities = state.filters.amenities;
      if (currentAmenities.includes(amenity)) {
        state.filters.amenities = currentAmenities.filter(a => a !== amenity);
      } else {
        state.filters.amenities = [...currentAmenities, amenity];
      }
    },
  },
});

export const {
  setFilters,
  resetFilters,
  toggleFiltersFullOpen,
  setFiltersFullOpen,
  toggleSidebar,
  setSidebarOpen,
  toggleDarkMode,
  setLocation,
  setCoordinates,
  setPriceRange,
  setBeds,
  setBaths,
  setPropertyType,
  setAmenities,
  toggleAmenity,
} = globalSlice.actions;

export default globalSlice.reducer;