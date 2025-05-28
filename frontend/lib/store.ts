import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { mockUsers, mockFavorites } from "./mock-users"
import type { User } from "./user" // Declare the User variable
import { api } from "@/state/api"
import globalReducer from "@/state/index"

// Auth Slice
interface AuthState {
  isAuthenticated: boolean
  currentUser: string | null
  loading: boolean
  error: string | null
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true
      state.currentUser = action.payload
      state.loading = false
      state.error = null
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.currentUser = null
    },
  },
})

// UI Slice
interface UIState {
  sidebarOpen: boolean
  modalOpen: string | null
}

const initialUIState: UIState = {
  sidebarOpen: false,
  modalOpen: null,
}

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUIState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modalOpen = action.payload
    },
    closeModal: (state) => {
      state.modalOpen = null
    },
  },
})

// Favorites Slice
interface FavoritesState {
  items: string[]
  loading: boolean
}

const initialFavoritesState: FavoritesState = {
  items: [],
  loading: false,
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: initialFavoritesState,
  reducers: {
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.items = action.payload
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      state.items.push(action.payload)
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((id) => id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

// Create the store
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    favorites: favoritesSlice.reducer,
    global: globalReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [api.util.getRunningQueriesThunk.type],
      },
    }).concat(api.middleware),
})

setupListeners(store.dispatch)

// Export actions
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions
export const { toggleSidebar, openModal, closeModal } = uiSlice.actions
export const { setFavorites, addFavorite, removeFavorite, setLoading } = favoritesSlice.actions

// Export types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Mock auth functions
export const mockLogin = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(loginStart())

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user = mockUsers.find((u) => u.email === email)

      if (user && password === "password") {
        dispatch(loginSuccess(user.id))

        // Load user favorites if tenant
        if (user.role === "tenant" && mockFavorites[user.id]) {
          dispatch(setFavorites(mockFavorites[user.id]))
        }

        return user
      } else {
        dispatch(loginFailure("Invalid email or password"))
        return null
      }
    } catch (error) {
      dispatch(loginFailure("An error occurred during login"))
      return null
    }
  }
}

export const mockSignup = (userData: Partial<User>) => {
  return async (dispatch: AppDispatch) => {
    dispatch(loginStart())

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, this would create a new user
      const newUserId = `user-${Math.floor(Math.random() * 1000)}`
      dispatch(loginSuccess(newUserId))

      return { ...userData, id: newUserId }
    } catch (error) {
      dispatch(loginFailure("An error occurred during signup"))
      return null
    }
  }
}
