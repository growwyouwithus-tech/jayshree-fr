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

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [loginMethod, setLoginMethod] = useState('email') // 'email' or 'phone'
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    const identifier = loginMethod === 'email' ? formData.email : formData.phone
    if (!identifier || !formData.password) {
      toast.error(`Please enter ${loginMethod} and password`)
      return
    }

    setLoading(true)

    try {
      // Send appropriate identifier based on login method
      const credentials = {
        [loginMethod === 'email' ? 'email' : 'phone']: identifier,
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
            placeholder="Enter your password"
            sx={{ mb: 3 }}
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
