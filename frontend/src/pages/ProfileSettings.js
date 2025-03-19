import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  TextField, 
  Button, 
  Chip,
  Grid,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    topics: [],
    articleUrls: [],
    purpose: '',
    tone: '',
    searchCriteria: '',
    schedule: ''
  });
  const [newTopic, setNewTopic] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Available tones for selection
  const tones = [
    'professional', 
    'casual', 
    'friendly', 
    'authoritative', 
    'informative', 
    'enthusiastic'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setNotification({
          open: true,
          message: 'Failed to load profile. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAddTopic = () => {
    if (newTopic.trim() && !profile.topics.includes(newTopic.trim())) {
      setProfile(prev => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()]
      }));
      setNewTopic('');
    }
  };

  const handleDeleteTopic = (topicToDelete) => {
    setProfile(prev => ({
      ...prev,
      topics: prev.topics.filter(topic => topic !== topicToDelete)
    }));
  };

  const handleAddUrl = () => {
    if (newUrl.trim() && !profile.articleUrls.includes(newUrl.trim())) {
      setProfile(prev => ({
        ...prev,
        articleUrls: [...prev.articleUrls, newUrl.trim()]
      }));
      setNewUrl('');
    }
  };

  const handleDeleteUrl = (urlToDelete) => {
    setProfile(prev => ({
      ...prev,
      articleUrls: prev.articleUrls.filter(url => url !== urlToDelete)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put('/api/profile', profile);
      setNotification({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: 'Failed to update profile. Please try again.',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Customize your social media assistant preferences
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {/* Topics Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Topics of Interest
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add a topic"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={handleAddTopic}
                          disabled={!newTopic.trim()}
                          edge="end"
                        >
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTopic();
                    }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profile.topics.map((topic, index) => (
                  <Chip
                    key={index}
                    label={topic}
                    onDelete={() => handleDeleteTopic(topic)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            {/* Article URLs Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Interesting Article URLs
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add a URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={handleAddUrl}
                          disabled={!newUrl.trim()}
                          edge="end"
                        >
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddUrl();
                    }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {profile.articleUrls.map((url, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: 'background.paper',
                      p: 1,
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="body2" 
                      sx={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        maxWidth: { xs: '200px', sm: '400px', md: '600px' }
                      }}
                    >
                      {url}
                    </Typography>
                    <IconButton size="small" onClick={() => handleDeleteUrl(url)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Purpose, Tone, Search Criteria */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Purpose"
                name="purpose"
                placeholder="e.g., promote my expertise"
                value={profile.purpose}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="tone-select-label">Tone</InputLabel>
                <Select
                  labelId="tone-select-label"
                  id="tone-select"
                  name="tone"
                  value={profile.tone}
                  label="Tone"
                  onChange={handleChange}
                >
                  <MenuItem value=""><em>Select a tone</em></MenuItem>
                  {tones.map(tone => (
                    <MenuItem key={tone} value={tone}>
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Search Criteria"
                name="searchCriteria"
                placeholder="e.g., recent news, trending topics"
                value={profile.searchCriteria}
                onChange={handleChange}
              />
            </Grid>

            {/* Schedule */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Schedule"
                name="schedule"
                placeholder="e.g., 09:00 daily"
                value={profile.schedule}
                onChange={handleChange}
                helperText="Specify when to generate new posts"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={saving}
                sx={{ minWidth: 150 }}
              >
                {saving ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfileSettings;
