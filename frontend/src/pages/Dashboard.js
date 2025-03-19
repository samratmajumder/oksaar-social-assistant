import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingPosts: 0,
    activePosts: 0,
    interactions: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentInteractions, setRecentInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats, recent posts, and interactions in parallel
        const [statsRes, postsRes, interactionsRes] = await Promise.all([
          axios.get('/api/stats'),
          axios.get('/api/posts?limit=5'),
          axios.get('/api/interactions?limit=5')
        ]);

        setStats(statsRes.data);
        setRecentPosts(postsRes.data);
        setRecentInteractions(interactionsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const generateNewPost = async () => {
    try {
      await axios.post('/api/posts/generate');
      // Refresh the posts list
      const postsRes = await axios.get('/api/posts?limit=5');
      setRecentPosts(postsRes.data);
    } catch (error) {
      console.error('Error generating post:', error);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.username || 'User'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your social media posts and interactions from one place
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h5" color="primary">{stats.pendingPosts}</Typography>
            <Typography variant="body1">Pending Posts</Typography>
            <Button 
              component={RouterLink} 
              to="/posts?status=Pending" 
              variant="outlined" 
              size="small" 
              sx={{ mt: 1 }}
            >
              View
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h5" color="primary">{stats.activePosts}</Typography>
            <Typography variant="body1">Active Posts</Typography>
            <Button 
              component={RouterLink} 
              to="/posts?status=Posted" 
              variant="outlined" 
              size="small" 
              sx={{ mt: 1 }}
            >
              View
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h5" color="primary">{stats.interactions}</Typography>
            <Typography variant="body1">Interactions</Typography>
            <Button 
              component={RouterLink} 
              to="/interactions" 
              variant="outlined" 
              size="small" 
              sx={{ mt: 1 }}
            >
              View
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item>
          <Button 
            variant="contained" 
            color="primary"
            onClick={generateNewPost}
          >
            Generate New Post
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/profile"
          >
            Update Profile
          </Button>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Posts</Typography>
            <Divider sx={{ mb: 2 }} />
            {recentPosts.length > 0 ? (
              <List>
                {recentPosts.map((post) => (
                  <ListItem key={post.postId} sx={{ py: 1 }}>
                    <ListItemText 
                      primary={post.content.micro.substring(0, 60) + '...'}
                      secondary={`Status: ${post.status} | ${new Date(post.createdAt).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No posts yet
              </Typography>
            )}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button component={RouterLink} to="/posts" size="small">
                View All Posts
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Interactions</Typography>
            <Divider sx={{ mb: 2 }} />
            {recentInteractions.length > 0 ? (
              <List>
                {recentInteractions.map((interaction) => (
                  <ListItem key={interaction.interactionId} sx={{ py: 1 }}>
                    <ListItemText 
                      primary={interaction.replyContent.substring(0, 60) + '...'}
                      secondary={`Response: ${interaction.response ? 'Sent' : 'Pending'} | ${new Date(interaction.respondedAt || interaction.createdAt).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No interactions yet
              </Typography>
            )}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button component={RouterLink} to="/interactions" size="small">
                View All Interactions
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
