import { useState, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ThemeModeContext } from '../main'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Switch,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import {
  Person,
  Notifications,
  Language,
  DarkMode,
  Security,
  Help,
  Info,
  Logout,
  ChevronRight,
  Delete,
  Lock,
} from '@mui/icons-material'
import { logout } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

const Settings = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { mode, toggleTheme } = useContext(ThemeModeContext)
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    smsNotifications: false,
  })

  // Sync dark mode with theme context
  const isDarkMode = mode === 'dark'

  const [changePasswordDialog, setChangePasswordDialog] = useState(false)
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleToggle = (setting) => {
    if (setting === 'darkMode') {
      toggleTheme()
      toast.success(`${mode === 'light' ? 'Dark' : 'Light'} mode enabled`)
    } else {
      setSettings({
        ...settings,
        [setting]: !settings[setting]
      })
      toast.success('Setting updated')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    // Here you would call your API to change password
    console.log('Change password:', passwordData)
    toast.success('Password changed successfully')
    setChangePasswordDialog(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  const handleDeleteAccount = () => {
    // Here you would call your API to delete account
    console.log('Delete account')
    toast.success('Account deleted successfully')
    dispatch(logout())
    navigate('/')
  }

  const accountSettings = [
    {
      icon: <Person />,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      action: () => navigate('/profile'),
      showChevron: true,
    },
    {
      icon: <Lock />,
      title: 'Change Password',
      subtitle: 'Update your password',
      action: () => setChangePasswordDialog(true),
      showChevron: true,
      protected: true,
    },
    {
      icon: <Language />,
      title: 'Language',
      subtitle: 'English',
      action: () => toast.info('Language settings coming soon'),
      showChevron: true,
    },
  ]

  const notificationSettings = [
    {
      icon: <Notifications />,
      title: 'Push Notifications',
      subtitle: 'Receive push notifications',
      toggle: true,
      value: settings.notifications,
      action: () => handleToggle('notifications'),
    },
    {
      icon: <Notifications />,
      title: 'Email Notifications',
      subtitle: 'Receive email notifications',
      toggle: true,
      value: settings.emailNotifications,
      action: () => handleToggle('emailNotifications'),
    },
    {
      icon: <Notifications />,
      title: 'SMS Notifications',
      subtitle: 'Receive SMS notifications',
      toggle: true,
      value: settings.smsNotifications,
      action: () => handleToggle('smsNotifications'),
    },
  ]

  const appSettings = [
    {
      icon: <DarkMode />,
      title: 'Dark Mode',
      subtitle: isDarkMode ? 'Disable dark theme' : 'Enable dark theme',
      toggle: true,
      value: isDarkMode,
      action: () => handleToggle('darkMode'),
    },
  ]

  const otherSettings = [
    {
      icon: <Help />,
      title: 'Help & Support',
      subtitle: 'Get help and support',
      action: () => navigate('/contact'),
      showChevron: true,
    },
    {
      icon: <Info />,
      title: 'About',
      subtitle: 'App version and information',
      action: () => toast.info('Jayshri Properties v1.0.0'),
      showChevron: true,
    },
    {
      icon: <Security />,
      title: 'Privacy Policy',
      subtitle: 'Read our privacy policy',
      action: () => toast.info('Privacy policy coming soon'),
      showChevron: true,
    },
  ]

  const renderSettingItem = (item) => {
    // Hide protected items if not authenticated
    if (item.protected && !isAuthenticated) {
      return null
    }

    return (
      <ListItem key={item.title} disablePadding>
        <ListItemButton onClick={item.action} sx={{ py: 2 }}>
          <ListItemIcon sx={{ color: 'primary.main' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.title}
            secondary={item.subtitle}
            primaryTypographyProps={{ fontWeight: 600 }}
          />
          {item.toggle && (
            <Switch
              checked={item.value}
              onChange={item.action}
              onClick={(e) => e.stopPropagation()}
              color="primary"
            />
          )}
          {item.showChevron && <ChevronRight sx={{ color: '#999' }} />}
        </ListItemButton>
      </ListItem>
    )
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 2 }}>
      <Container maxWidth="sm" sx={{ pt: 2 }}>
        {/* Account Settings */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h6" fontWeight={700} sx={{ p: 2, pb: 1 }}>
              Account Settings
            </Typography>
            <List>
              {accountSettings.map((item) => renderSettingItem(item))}
            </List>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h6" fontWeight={700} sx={{ p: 2, pb: 1 }}>
              Notifications
            </Typography>
            <List>
              {notificationSettings.map((item) => renderSettingItem(item))}
            </List>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h6" fontWeight={700} sx={{ p: 2, pb: 1 }}>
              App Settings
            </Typography>
            <List>
              {appSettings.map((item) => renderSettingItem(item))}
            </List>
          </CardContent>
        </Card>

        {/* Other Settings */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h6" fontWeight={700} sx={{ p: 2, pb: 1 }}>
              Other
            </Typography>
            <List>
              {otherSettings.map((item) => renderSettingItem(item))}
            </List>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        {isAuthenticated && (
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight={700} color="error" gutterBottom>
                Danger Zone
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{ mb: 1, textTransform: 'none' }}
              >
                Logout
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={() => setDeleteAccountDialog(true)}
                sx={{ textTransform: 'none' }}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Change Password Dialog */}
        <Dialog
          open={changePasswordDialog}
          onClose={() => setChangePasswordDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setChangePasswordDialog(false)}>Cancel</Button>
            <Button onClick={handleChangePassword} variant="contained" color="primary">
              Change Password
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog
          open={deleteAccountDialog}
          onClose={() => setDeleteAccountDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle color="error">Delete Account</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              Are you sure you want to delete your account? This action cannot be undone.
              All your data will be permanently deleted.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteAccountDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteAccount} variant="contained" color="error">
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default Settings
