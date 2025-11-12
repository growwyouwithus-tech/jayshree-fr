import { useState, useEffect } from 'react'
import { Box, Typography, Button, Card, CardContent, Chip, CircularProgress } from '@mui/material'
import { CheckCircle, Error, Refresh } from '@mui/icons-material'
import axios from '../api/axios'

const TestConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing')
  const [apiResults, setApiResults] = useState({})
  const [loading, setLoading] = useState(false)

  const testBackendConnection = async () => {
    setLoading(true)
    setConnectionStatus('testing')
    const results = {}

    try {
      // Test 1: Health Check
      console.log('Testing health endpoint...')
      try {
        const healthResponse = await axios.get('/health')
        results.health = { status: 'success', data: healthResponse.data }
      } catch (error) {
        results.health = { status: 'error', error: error.message }
      }

      // Test 2: Colonies (Protected endpoint - expected to fail without auth)
      console.log('Testing colonies endpoint...')
      try {
        const coloniesResponse = await axios.get('/colonies')
        results.colonies = { 
          status: 'success', 
          count: coloniesResponse.data.data?.colonies?.length || 0 
        }
      } catch (error) {
        if (error.response?.status === 401) {
          results.colonies = { 
            status: 'success', 
            message: 'Protected endpoint working (auth required)' 
          }
        } else {
          results.colonies = { status: 'error', error: error.message }
        }
      }

      // Test 3: Cities (Public endpoint)
      console.log('Testing cities endpoint...')
      try {
        const citiesResponse = await axios.get('/cities')
        results.cities = { 
          status: 'success', 
          count: citiesResponse.data.data?.cities?.length || 0 
        }
      } catch (error) {
        results.cities = { status: 'error', error: error.message }
      }

      // Test 4: Auth endpoints structure
      console.log('Testing auth endpoints...')
      try {
        await axios.post('/auth/login', {})
      } catch (error) {
        if (error.response?.status === 400) {
          results.auth = { status: 'success', message: 'Auth endpoints working' }
        } else {
          results.auth = { status: 'error', error: error.message }
        }
      }

      setApiResults(results)
      
      // Overall status
      const hasErrors = Object.values(results).some(result => result.status === 'error')
      setConnectionStatus(hasErrors ? 'partial' : 'success')

    } catch (error) {
      console.error('Connection test failed:', error)
      setConnectionStatus('failed')
    }

    setLoading(false)
  }

  useEffect(() => {
    testBackendConnection()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success'
      case 'error': return 'error'
      case 'testing': return 'warning'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle />
      case 'error': return <Error />
      case 'testing': return <CircularProgress size={20} />
      default: return null
    }
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🔌 Backend Connection Test
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Testing connection to Jayshree Properties Backend API
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h6">Overall Status:</Typography>
            <Chip 
              label={connectionStatus.toUpperCase()} 
              color={getStatusColor(connectionStatus)}
              icon={getStatusIcon(connectionStatus)}
            />
            <Button 
              variant="outlined" 
              startIcon={<Refresh />}
              onClick={testBackendConnection}
              disabled={loading}
            >
              Retest
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            API URL: {import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        API Endpoints Test Results:
      </Typography>

      {Object.entries(apiResults).map(([endpoint, result]) => (
        <Card key={endpoint} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                {endpoint}
              </Typography>
              <Chip 
                label={result.status} 
                color={getStatusColor(result.status)}
                size="small"
              />
            </Box>
            
            {result.status === 'success' && (
              <Typography variant="body2" color="success.main">
                ✅ {result.count !== undefined ? `Found ${result.count} items` : result.message || 'Working properly'}
              </Typography>
            )}
            
            {result.status === 'error' && (
              <Typography variant="body2" color="error.main">
                ❌ {result.error}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}

      {connectionStatus === 'success' && (
        <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🎉 Connection Successful!
            </Typography>
            <Typography variant="body2">
              Your user app is successfully connected to the Jayshree Properties backend.
              You can now use all features like browsing colonies, making bookings, etc.
            </Typography>
          </CardContent>
        </Card>
      )}

      {connectionStatus === 'failed' && (
        <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ❌ Connection Failed
            </Typography>
            <Typography variant="body2">
              Please make sure the backend server is running on port 5000 and try again.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default TestConnection
