import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Divider,
} from '@mui/material'
import {
  Phone,
  Email,
  LocationOn,
  WhatsApp,
  Facebook,
  Instagram,
  Twitter,
  Send,
} from '@mui/icons-material'
import toast from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    toast.success('Message sent successfully! We will contact you soon.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    })
  }

  const contactInfo = [
    {
      icon: <Phone />,
      title: 'Phone',
      value: '+91 9876543210',
      link: 'tel:+919876543210'
    },
    {
      icon: <Email />,
      title: 'Email',
      value: 'info@jayshriproperties.com',
      link: 'mailto:info@jayshriproperties.com'
    },
    {
      icon: <LocationOn />,
      title: 'Address',
      value: 'Agra, Uttar Pradesh, India',
      link: 'https://maps.google.com'
    },
    {
      icon: <WhatsApp />,
      title: 'WhatsApp',
      value: '+91 9876543210',
      link: 'https://wa.me/919876543210'
    },
  ]

  const socialMedia = [
    { icon: <Facebook />, link: 'https://facebook.com', color: '#1877F2' },
    { icon: <Instagram />, link: 'https://instagram.com', color: '#E4405F' },
    { icon: <Twitter />, link: 'https://twitter.com', color: '#1DA1F2' },
    { icon: <WhatsApp />, link: 'https://wa.me/919876543210', color: '#25D366' },
  ]

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pb: 2 }}>
      <Container maxWidth="sm" sx={{ pt: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We'd love to hear from you. Send us a message!
          </Typography>
        </Box>

        {/* Contact Info Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {contactInfo.map((info, index) => (
            <Grid item xs={6} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease'
                  }
                }}
                onClick={() => window.open(info.link, '_blank')}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 1,
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Typography variant="caption" fontWeight={600} display="block" gutterBottom>
                    {info.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {info.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Contact Form */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Send us a Message
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                endIcon={<Send />}
                sx={{
                  bgcolor: 'primary.main',
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#5200CA',
                  }
                }}
              >
                Send Message
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Follow Us
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Stay connected on social media
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              {socialMedia.map((social, index) => (
                <IconButton
                  key={index}
                  onClick={() => window.open(social.link, '_blank')}
                  sx={{
                    bgcolor: social.color,
                    color: 'white',
                    '&:hover': {
                      bgcolor: social.color,
                      opacity: 0.9,
                    }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mt: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Business Hours
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Monday - Friday</Typography>
              <Typography variant="body2" fontWeight={600}>9:00 AM - 6:00 PM</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Saturday</Typography>
              <Typography variant="body2" fontWeight={600}>10:00 AM - 4:00 PM</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Sunday</Typography>
              <Typography variant="body2" fontWeight={600} color="error">Closed</Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Contact
