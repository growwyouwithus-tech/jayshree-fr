import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Divider,
} from '@mui/material'
import { Visibility, VisibilityOff, Login as LoginIcon, Email, Phone } from '@mui/icons-material'
import { login } from '../store/slices/authSlice'
import toast from 'react-hot-toast'
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validatePasswordDigits
} from '../utils/validation'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [loginMethod, setLoginMethod] = useState('email') // 'email' or 'phone'
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const clearError = (fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    clearError(name)
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    if (loginMethod === 'email') {
      const emailError = validateRequired(formData.email, 'Email') || validateEmail(formData.email)
      if (emailError) {
        newErrors.email = emailError
        isValid = false
      }
    } else {
      const phoneError = validateRequired(formData.phone, 'Phone number') || validatePhone(formData.phone)
      if (phoneError) {
        newErrors.phone = phoneError
        isValid = false
      }
    }

    const passwordError = validateRequired(formData.password, 'Password') || validatePasswordDigits(formData.password)
    if (passwordError) {
      newErrors.password = passwordError
      isValid = false
    }

    setErrors(newErrors)

    if (!isValid) {
      const firstError = Object.values(newErrors)[0]
      toast.error(firstError, {
        duration: 4000,
        position: 'top-right'
      })
    }

    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Send appropriate identifier based on login method
      const credentials = {
        [loginMethod === 'email' ? 'email' : 'phone']: loginMethod === 'email' ? formData.email : formData.phone,
        password: formData.password,
      }
      
      const result = await dispatch(login(credentials)).unwrap()
      console.log('Login successful:', result)
      toast.success('Welcome back! 🎉')
      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Login to your account to continue
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Login Method Tabs */}
          <Tabs
            value={loginMethod}
            onChange={(e, newValue) => setLoginMethod(newValue)}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab
              icon={<Email />}
              iconPosition="start"
              label="Email"
              value="email"
            />
            <Tab
              icon={<Phone />}
              iconPosition="start"
              label="Phone"
              value="phone"
            />
          </Tabs>

          {/* Email or Phone Input */}
          {loginMethod === 'email' ? (
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              sx={{ mb: 2 }}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="9876543210"
              sx={{ mb: 2 }}
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {/* Password Input */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your 8-digit password"
            sx={{ mb: 3 }}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Login Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <Divider sx={{ my: 3 }}>OR</Divider>

          {/* Forgot Password Link */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Link 
              component={RouterLink} 
              to="/forgot-password" 
              underline="hover"
              sx={{ fontSize: '0.875rem', color: 'primary.main' }}
            >
              Forgot Password?
            </Link>
          </Box>

          {/* Register Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link 
                component={RouterLink} 
                to="/register" 
                underline="hover"
                sx={{ fontWeight: 600, color: 'primary.main' }}
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default Login