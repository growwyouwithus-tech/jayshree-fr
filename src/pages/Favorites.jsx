import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material'
import {
  LocationOn,
  ArrowForward,
  FavoriteBorder,
  Favorite,
  DeleteOutline,
} from '@mui/icons-material'
import { colonyService, wishlistService } from '../services/api.service'
import toast from 'react-hot-toast'

const Favorites = () => {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    setLoading(true)
    try {
      const wishlistIds = wishlistService.get()
      if (wishlistIds.length === 0) {
        setFavorites([])
        setLoading(false)
        return
      }

      const allColonies = await colonyService.getAll()
      const favoriteColonies = allColonies.filter(colony => 
        wishlistIds.includes(colony._id)
      )
      setFavorites(favoriteColonies)
    } catch (error) {
      console.error('Error fetching favorites:', error)
      toast.error('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = (colonyId, e) => {
    e.stopPropagation()
    wishlistService.remove(colonyId)
    setFavorites(favorites.filter(colony => colony._id !== colonyId))
    toast.success('Removed from favorites')
  }

  const handlePropertyClick = (colony) => {
    navigate(`/colonies/${colony._id}`)
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      wishlistService.clear()
      setFavorites([])
      toast.success('All favorites cleared')
    }
  }

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pb: 2 }}>
      <Container maxWidth="sm" sx={{ pt: 2 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <Typography variant="h6" fontWeight={700}>
            My Favorites ({favorites.length})
          </Typography>
          {favorites.length > 0 && (
            <Button
              size="small"
              color="error"
              onClick={handleClearAll}
              startIcon={<DeleteOutline />}
            >
              Clear All
            </Button>
          )}
        </Box>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : favorites.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <FavoriteBorder sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Favorites Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start adding properties to your favorites
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/colonies')}
              sx={{ bgcolor: 'primary.main' }}
            >
              Browse Properties
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {favorites.map((colony) => (
              <Card
                key={colony._id}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease'
                  }
                }}
                onClick={() => handlePropertyClick(colony)}
              >
                {/* Favorite Button */}
                <IconButton
                  onClick={(e) => handleRemoveFavorite(colony._id, e)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'white',
                    zIndex: 1,
                    '&:hover': { bgcolor: 'white' }
                  }}
                >
                  <Favorite sx={{ color: '#f44336' }} />
                </IconButton>

                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={colony.mapImages?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'}
                    alt={colony.name}
                  />
                  <Chip
                    label={colony.status === 'ready_to_sell' ? 'Ready to Sell' : 'Available'}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: '#4CAF50',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body1" fontWeight={600} gutterBottom noWrap>
                    {colony.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                    <LocationOn sx={{ fontSize: 16, color: '#666' }} />
                    <Typography variant="caption" sx={{ color: '#666' }} noWrap>
                      {colony.location?.city}, {colony.location?.state}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700} sx={{ color: 'primary.main' }}>
                        ₹{colony.basePricePerGaj?.toLocaleString()}/gaj
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {colony.availablePlots || 0} plots available
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<ArrowForward />}
                      sx={{
                        bgcolor: 'primary.main',
                        textTransform: 'none',
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Favorites
