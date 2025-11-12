import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setAuthFromStorage } from '../store/slices/authSlice'

const AuthChecker = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Check localStorage on app load and restore auth state
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      try {
        const userData = JSON.parse(user)
        const refreshToken = localStorage.getItem('refreshToken')
        
        // Restore auth state
        dispatch(setAuthFromStorage({
          user: userData,
          token: token,
          refreshToken: refreshToken,
          isAuthenticated: true
        }))
        
        console.log('✅ Auth state restored from localStorage')
      } catch (error) {
        console.error('❌ Failed to restore auth state:', error)
        // Clear corrupted data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('refreshToken')
      }
    }
  }, [dispatch])

  return children
}

export default AuthChecker
