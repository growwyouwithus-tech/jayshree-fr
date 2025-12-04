import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import propertyReducer from './slices/propertySlice'
import plotReducer from './slices/plotSlice'
import bookingReducer from './slices/bookingSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    property: propertyReducer,
    plot: plotReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store
