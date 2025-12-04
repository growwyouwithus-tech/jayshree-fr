import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material'
import {
  Close,
  CompareArrows,
  LocationOn,
  CheckCircle,
  Cancel,
} from '@mui/icons-material'
import { colonyService, compareService } from '../services/api.service'
import toast from 'react-hot-toast'

const Compare = () => {
  const navigate = useNavigate()
  const [compareList, setCompareList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompareList()
  }, [])

  const fetchCompareList = async () => {
    setLoading(true)
    try {
      const compareIds = compareService.get()
      if (compareIds.length === 0) {
        setCompareList([])
        setLoading(false)
        return
      }

      const allColonies = await colonyService.getAll()
      const compareColonies = allColonies.filter(colony => 
        compareIds.includes(colony._id)
      )
      setCompareList(compareColonies)
    } catch (error) {
      console.error('Error fetching compare list:', error)
      toast.error('Failed to load comparison')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = (colonyId) => {
    compareService.remove(colonyId)
    setCompareList(compareList.filter(colony => colony._id !== colonyId))
    toast.success('Removed from comparison')
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all comparisons?')) {
      compareService.clear()
      setCompareList([])
      toast.success('All comparisons cleared')
    }
  }

  const handleViewDetails = (colonyId) => {
    navigate(`/colonies/${colonyId}`)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (compareList.length === 0) {
    return (
      <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="sm">
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <CompareArrows sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Properties to Compare
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add up to 3 properties to compare
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/colonies')}
              sx={{ bgcolor: 'primary.main' }}
            >
              Browse Properties
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pb: 2 }}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <Typography variant="h6" fontWeight={700}>
            Compare Properties ({compareList.length}/3)
          </Typography>
          <Button
            size="small"
            color="error"
            onClick={handleClearAll}
            startIcon={<Close />}
          >
            Clear All
          </Button>
        </Box>

        {/* Property Cards */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3,
          overflowX: 'auto',
          pb: 2
        }}>
          {compareList.map((colony) => (
            <Card
              key={colony._id}
              sx={{
                minWidth: 250,
                maxWidth: 250,
                position: 'relative',
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <IconButton
                onClick={() => handleRemove(colony._id)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'white',
                  zIndex: 1,
                  '&:hover': { bgcolor: 'white' }
                }}
              >
                <Close />
              </IconButton>
              <CardMedia
                component="img"
                height="140"
                image={colony.mapImages?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'}
                alt={colony.name}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" fontWeight={600} noWrap gutterBottom>
                  {colony.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <LocationOn sx={{ fontSize: 14, color: '#666' }} />
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {colony.location?.city}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  onClick={() => handleViewDetails(colony._id)}
                  sx={{ textTransform: 'none', borderColor: 'primary.main', color: 'primary.main' }}
                >
                  View Details
                </Button>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Comparison Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Feature</TableCell>
                {compareList.map((colony) => (
                  <TableCell key={colony._id} sx={{ color: 'white', fontWeight: 700 }}>
                    {colony.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Price */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Price per Gaj</TableCell>
                {compareList.map((colony) => (
                  <TableCell key={colony._id}>
                    <Typography variant="body1" fontWeight={700} color="primary.main">
                      ₹{colony.basePricePerGaj?.toLocaleString()}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>

              {/* Location */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                {compareList.map((colony) => (
                  <TableCell key={colony._id}>
                    {colony.location?.city}, {colony.location?.state}
                  </TableCell>
                ))}
              </TableRow>

              {/* Status */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                {compareList.map((colony) => (
                  <TableCell key={colony._id}>
                    <Chip
                      label={colony.status === 'ready_to_sell' ? 'Ready to Sell' : 'Available'}
                      size="small"
                      color={colony.status === 'ready_to_sell' ? 'success' : 'default'}
                    />
                  </TableCell>
                ))}
              </TableRow>

              {/* Available Plots */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Available Plots</TableCell>
                {compareList.map((colony) => (
                  <TableCell key={colony._id}>
                    {colony.availablePlots || 0} plots
                  </TableCell>
                ))}
              </TableRow>

              {/* Total Plots */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Total Plots</TableCell>
                {compareList.map((colony) => (
                  <TableCell key={colony._id}>
                    {colony.totalPlots || 0} plots
                  </TableCell>
                ))}
              </TableRow>

              {/* Amenities */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Amenities</TableCell>
                {compareList.map((colony) => (
                  <TableCell key={colony._id}>
                    {colony.amenities?.length || 0} amenities
                  </TableCell>
                ))}
              </TableRow>

              {/* Facilities */}
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Facilities</TableCell>
                {compareList.map((colony) => (
                  <TableCell key={colony._id}>
                    {colony.facilities?.length || 0} facilities
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  )
}

export default Compare
