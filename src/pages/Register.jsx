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
  Grid,
} from '@mui/material'
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material'
import { register } from '../store/slices/authSlice'
import toast from 'react-hot-toast'
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validatePasswordDigits,
  validatePasswordMatch,
  validateMinLength,
  validateMaxLength
} from '../utils/validation'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agentCode: '',
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

    // Name validation
    const nameError = validateRequired(formData.name, 'Full name') ||
                     validateMinLength(formData.name, 2, 'Full name') ||
                     validateMaxLength(formData.name, 100, 'Full name')
    if (nameError) {
      newErrors.name = nameError
      isValid = false
    }

    // Email validation
    const emailError = validateRequired(formData.email, 'Email') || validateEmail(formData.email)
    if (emailError) {
      newErrors.email = emailError
      isValid = false
    }

    // Phone validation
    const phoneError = validateRequired(formData.phone, 'Phone number') || validatePhone(formData.phone)
    if (phoneError) {
      newErrors.phone = phoneError
      isValid = false
    }

    // Password validation
    const passwordError = validateRequired(formData.password, 'Password') || validatePasswordDigits(formData.password)
    if (passwordError) {
      newErrors.password = passwordError
      isValid = false
    }

    // Confirm password validation
    const confirmPasswordError = validateRequired(formData.confirmPassword, 'Confirm password') ||
                                validatePasswordMatch(formData.password, formData.confirmPassword)
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError
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
      const { confirmPassword, ...registerData } = formData
      await dispatch(register(registerData)).unwrap()
      toast.success('Registration successful!')
      navigate('/')
    } catch (error) {
      toast.error(error || 'Registration failed')
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
          <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Register to start booking your dream plot
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={!!errors.name}
                helperText={errors.name}
                placeholder="Enter your full name"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={!!errors.email}
                helperText={errors.email}
                placeholder="your@email.com"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="9876543210"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Agent Code (Optional)"
                name="agentCode"
                value={formData.agentCode}
                onChange={handleChange}
                placeholder="Enter agent referral code if you have one"
                helperText="If you were referred by an agent, enter their code here"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                error={!!errors.password}
                helperText={errors.password}
                placeholder="Enter 8-digit password"
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
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                placeholder="Confirm 8-digit password"
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" underline="hover">
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default Register
