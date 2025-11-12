import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import colonyReducer from './slices/colonySlice'
import plotReducer from './slices/plotSlice'
import bookingReducer from './slices/bookingSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    colony: colonyReducer,
    plot: plotReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store
