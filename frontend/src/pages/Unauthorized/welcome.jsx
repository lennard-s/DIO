import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import wicLogo from '/public/wichacks-logo.png';
import comsLogo from '/public/COMS.png';
import {
  Box, Button, Container,
  Typography, Grid, Card,
  CardContent, CardMedia,
  Paper, useTheme
} from '@mui/material';
import { checkAuth } from '../../ProtectedRoute';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const isProduction = API_BASE_URL.includes("https://dio.gccis.rit.edu");


/**
 * welcome.jsx
 * 
 * This React component renders the welcome page for the application. It serves as an entry point for users,
 * providing information about the app, its features, and the clubs it supports. The page includes options
 * for users to log in, explore clubs, and learn more about the app's functionality.
 * 
 * Key Features:
 * - Displays a hero section with a call-to-action for logging in or navigating to the home page.
 * - Lists supported clubs with descriptions, logos, and links to their respective websites.
 * - Highlights key features of the app, such as tracking attendance and monitoring membership progress.
 * - Includes a footer with navigation to the "About" page and copyright information.
 * - Dynamically adjusts the theme and content based on the user's authentication status and theme mode.
 * 
 * Dependencies:
 * - React, Material-UI components, and React Router.
 * - Custom utilities: `checkAuth` for verifying user authentication.
 * - Assets: Club logos and images.
 * 
 * Functions:
 * - handleLogin: Redirects the user to the SAML login route.
 * - handleHome: Navigates the user to the home page.
 * 
 * Hooks:
 * - React.useState: Manages state for authentication status.
 * - React.useEffect: Checks user authentication status on component mount.
 * - React Router's `useNavigate`: Used to programmatically navigate between pages.
 * - Material-UI's `useTheme`: Retrieves the current theme mode for dynamic styling.
 * 
 * @component
 */
const WelcomePage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const clubs = [
    {
      title: "Women in Computing",
      description: "Promoting the success and advancement of women and all gender minorities in their academic and professional careers.",
      icon: wicLogo, 
      URL: "https://www.rit.edu/womenincomputing/",
      bgColor: isDarkMode ? '#2C0034' : '#E4BEEB' // Change based on dark theme
    },
    {
      title: "Computing Organization of Multicultural Students",
      description: "building a supportive community that celebrates the talent of underrepresented students in computing.",
      icon: comsLogo,
      URL: "https://www.rit.edu/computing/coms/",
      bgColor: isDarkMode ? '#002631' : '#e3f2fd' // Change based on dark theme
    }
  ];

  useEffect(() => {
    if (isProduction) {
      const checkAuthentication = async () => {
        const authStatus = await checkAuth();
        setIsAuthenticated(authStatus);
      };

      checkAuthentication();
    } else {
      setIsAuthenticated(true); // Assume authenticated in non-production environments
    }
  }, []);

  const handleLogin = () => {
    window.location.href = '/saml2/login';
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box sx={{
        bgcolor: 'background.default',
        pt: 8,
        pb: 8
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h2"
                gutterBottom
                fontWeight="bold"
              >
                Track your club
                <Typography
                  component="span"
                  variant="h2"
                  sx={{ display: 'block', fontWeight: 'bold' }}
                >
                  membership journey
                </Typography>
              </Typography>
              <Typography variant="h5" color="text.secondary">
                Keep track of your active membership, monitor attendance, and earn your points towards participation in RIT's GCCIS vibrant club community.
              </Typography>
              {isAuthenticated === null ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled
                  sx={{ mt: 4 }}
                >
                  Loading...
                </Button>
              ) : isAuthenticated ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleHome}
                  sx={{ mt: 4 }}
                >
                  Home
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleLogin}
                  sx={{ mt: 4 }}
                >
                  Member Login
                </Button>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" elevation={4}>
                <CardMedia
                  component="img"
                  height="300"
                  image="memberDashBig.PNG"
                  alt="Students at club event"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Not a member yet?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Discover clubs below that match your interests and begin your journey today.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Club Categories */}
      <Container sx={{ py: 8,bgcolor: 'background.paper' }} maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" color="primary">
            Discover
          </Typography>
          <Typography variant="h3" component="h2" gutterBottom color="text.primary">
            Find your community
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mx: 'auto', maxWidth: 600 }}>
            Explore RIT's Student clubs and find where you belong.
          </Typography>
        </Box>

        <Grid container spacing={4} columns={8}>
          {clubs.map((club, index) => (
            <Grid item key={index} xs={12} md={4}>
              <Paper
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 3,
                  bgcolor: club.bgColor,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  }
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    height: 80,
                    width: 'auto',
                    objectFit: 'contain',
                    mb: 2,
                    marginX: 'auto' // Centers the image horizontally
                  }}
                  image={club.icon}
                  alt={`${club.title} logo`}
                />
                <Typography variant="h5" component="h3" gutterBottom color="text.primary">
                  {club.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }} color={isDarkMode ?'rgb(208, 208, 208)' : 'text.secondary'}>
                  {club.description}
                </Typography>
                <Button
                  sx={{ mt: 'auto' }}
                  variant="contained"
                  color="primary"
                  component="a"
                  href={club.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more →
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" color="primary">
              Features
            </Typography>
            <Typography variant="h3" component="h2" gutterBottom color="text.primary">
              Your membership, simplified
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mx: 'auto', maxWidth: 600 }}>
              Our app makes tracking club involvement easier than ever.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                title: "Track Attendance",
                description: "Easily record your attendance at meetings and events per semester."
              },
              {
                title: "Monitor Progress",
                description: "See your progress toward active membership status and recognition goals."
              },
              {
                title: "Receive Recognition",
                description: "Earn recognition for your contributions and years of active membership."
              },
              {
                title: "Access History",
                description: "View your complete membership history throughout your time at RIT."
              }
            ].map((feature, index) => (
              <Grid item key={index} xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Box>
                    <Typography variant="h6" component="h3" gutterBottom color="text.primary">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  RIT DIO Membership Tracker
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} RIT Diversity and Initiatives Office (DIO). All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default WelcomePage;