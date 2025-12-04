import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import { Home, Search, Favorite, Business, AccountCircle } from '@mui/icons-material'

const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const getActiveTab = () => {
    if (location.pathname === '/') return 0
    if (location.pathname === '/search') return 1
    if (location.pathname === '/properties' || location.pathname === '/colonies') return 2
    if (location.pathname === '/favorites') return 3
    if (location.pathname === '/profile' || location.pathname === '/my-bookings') return 4
    return 0
  }

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/')
        break
      case 1:
        navigate('/search')
        break
      case 2:
        navigate('/properties')
        break
      case 3:
        navigate('/favorites')
        break
      case 4:
        // Check if user is authenticated before navigating to profile
        if (isAuthenticated) {
          navigate('/profile')
        } else {
          navigate('/login')
        }
        break
      default:
        break
    }
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid #e0e0e0',
      }}
      elevation={8}
    >
      <BottomNavigation 
        value={getActiveTab()} 
        onChange={handleChange} 
        showLabels
        sx={{
          height: 65,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 0',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.7rem',
            marginTop: '4px',
          },
          '& .Mui-selected': {
            color: 'primary.main',
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<Home />}
        />
        <BottomNavigationAction
          label="Search"
          icon={<Search />}
        />
        <BottomNavigationAction
          label="Properties"
          icon={<Business />}
        />
        <BottomNavigationAction
          label="Favorites"
          icon={<Favorite />}
        />
        <BottomNavigationAction
          label="Account"
          icon={<AccountCircle />}
        />
      </BottomNavigation>
    </Paper>
  )
}

export default BottomNav
