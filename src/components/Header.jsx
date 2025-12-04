import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Avatar,
  Divider,
  Badge,
  Button,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Home,
  Search,
  Favorite,
  CompareArrows,
  BookOnline,
  Person,
  Notifications,
  Settings,
  ContactSupport,
  Share,
  Logout,
  Login,
  PersonAdd,
  Close,
  Business,
} from '@mui/icons-material'
import { logout } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    setDrawerOpen(false)
    toast.success('Logged out successfully')
    navigate('/')
  }

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/', public: true },
    { text: 'Search Properties', icon: <Search />, path: '/search', public: true },
    { text: 'All Colonies', icon: <Business />, path: '/colonies', public: true },
    { text: 'Favorites', icon: <Favorite />, path: '/favorites', public: true },
    { text: 'Compare', icon: <CompareArrows />, path: '/compare', public: true },
    { divider: true },
    { text: 'My Bookings', icon: <BookOnline />, path: '/my-bookings', protected: true },
    { text: 'Profile', icon: <Person />, path: '/profile', protected: true },
    { text: 'Notifications', icon: <Notifications />, path: '/notifications', protected: true },
    { text: 'Referral', icon: <Share />, path: '/referral', protected: true },
    { divider: true },
    { text: 'Settings', icon: <Settings />, path: '/settings', public: true },
    { text: 'Contact Support', icon: <ContactSupport />, path: '/contact', public: true },
  ]

  const handleNavigation = (path) => {
    navigate(path)
    setDrawerOpen(false)
  }

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/') return 'Jayshri Properties'
    if (path === '/search') return 'Search'
    if (path === '/colonies') return 'All Colonies'
    if (path === '/favorites') return 'Favorites'
    if (path === '/compare') return 'Compare'
    if (path === '/my-bookings') return 'My Bookings'
    if (path === '/profile') return 'Profile'
    if (path === '/notifications') return 'Notifications'
    if (path === '/referral') return 'Referral'
    if (path === '/settings') return 'Settings'
    if (path === '/contact') return 'Contact'
    if (path.startsWith('/colonies/')) return 'Colony Details'
    if (path.startsWith('/plots/')) return 'Plot Details'
    return 'Jayshri Properties'
  }

  return (
    <>
      {/* App Bar */}
      <AppBar 
        position="sticky" 
        elevation={2}
        sx={{ 
          bgcolor: 'white',
          color: 'text.primary',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Menu Button */}
          <IconButton
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ color: 'primary.main' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Title */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'primary.main',
              flexGrow: 1,
              textAlign: 'center'
            }}
          >
            {getPageTitle()}
          </Typography>

          {/* Notification Icon */}
          {isAuthenticated && (
            <IconButton 
              onClick={() => navigate('/notifications')}
              sx={{ color: 'primary.main' }}
            >
              <Badge badgeContent={0} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          )}
          {!isAuthenticated && <Box sx={{ width: 40 }} />}
        </Toolbar>
      </AppBar>

      {/* Drawer Menu */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: '#FAFAFA'
          }
        }}
      >
        {/* Drawer Header */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              Menu
            </Typography>
            <IconButton 
              onClick={() => setDrawerOpen(false)}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* User Info */}
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  width: 50, 
                  height: 50,
                  bgcolor: 'white',
                  color: '#6200EA'
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {user?.email || 'user@example.com'}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Login />}
                onClick={() => handleNavigation('/login')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PersonAdd />}
                onClick={() => handleNavigation('/register')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { 
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>

        {/* Menu Items */}
        <List sx={{ pt: 2 }}>
          {menuItems.map((item, index) => {
            if (item.divider) {
              return <Divider key={`divider-${index}`} sx={{ my: 1 }} />
            }

            // Hide protected items if not authenticated
            if (item.protected && !isAuthenticated) {
              return null
            }

            const isActive = location.pathname === item.path

            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    bgcolor: isActive ? 'rgba(65, 152, 10, 0.08)' : 'transparent',
                    borderLeft: isActive ? '4px solid' : '4px solid transparent',
                    borderLeftColor: isActive ? 'primary.main' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(65, 152, 10, 0.04)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isActive ? 'primary.main' : 'text.secondary',
                    minWidth: 40
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'primary.main' : 'text.primary'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}

          {/* Logout Button */}
          {isAuthenticated && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    px: 2,
                    color: '#f44336',
                    '&:hover': {
                      bgcolor: 'rgba(244, 67, 54, 0.04)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: '#f44336', minWidth: 40 }}>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Logout"
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>

        {/* App Version */}
        <Box sx={{ 
          mt: 'auto', 
          p: 2, 
          textAlign: 'center',
          borderTop: '1px solid #e0e0e0'
        }}>
          <Typography variant="caption" color="text.secondary">
            Jayshri Properties v1.0.0
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            © 2024 All Rights Reserved
          </Typography>
        </Box>
      </Drawer>
    </>
  )
}

export default Header
