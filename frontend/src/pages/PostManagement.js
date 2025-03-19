import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Button, 
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import axios from 'axios';

const PostManagement = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get('status') || 'All';

  const [status, setStatus] = useState(initialStatus);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [postDetails, setPostDetails] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchPosts(status);
  }, [status]);

  const fetchPosts = async (currentStatus) => {
    setLoading(true);
    try {
      const statusParam = currentStatus !== 'All' ? `status=${currentStatus}` : '';
      const response = await axios.get(`/api/posts?${statusParam}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setNotification({
        open: true,
        message: 'Failed to load posts. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (event, newValue) => {
    setStatus(newValue);
  };

  const handleApprovePost = async (postId) => {
    try {
      await axios.put(`/api/posts/${postId}/approve`);
      // Update the post status in the UI
      setPosts(posts.map(post => 
        post.postId === postId ? { ...post, status: 'Approved' } : post
      ));
      setNotification({
        open: true,
        message: 'Post approved successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error approving post:', error);
      setNotification({
        open: true,
        message: 'Failed to approve post. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleRejectPost = async (postId) => {
    try {
      await axios.put(`/api/posts/${postId}/reject`);
      // Update the post status in the UI
      setPosts(posts.map(post => 
        post.postId === postId ? { ...post, status: 'Rejected' } : post
      ));
      setNotification({
        open: true,
        message: 'Post rejected.',
        severity: 'info'
      });
    } catch (error) {
      console.error('Error rejecting post:', error);
      setNotification({
        open: true,
        message: 'Failed to reject post. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleGeneratePost = async () => {
    try {
      setNotification({
        open: true,
        message: 'Generating new post...',
        severity: 'info'
      });
      await axios.post('/api/posts/generate');
      // Fetch the updated list of posts
      fetchPosts(status);
      setNotification({
        open: true,
        message: 'New post generated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating post:', error);
      setNotification({
        open: true,
        message: 'Failed to generate post. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleViewDetails = (post) => {
    setPostDetails(post);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const getStatusColor = (postStatus) => {
    switch(postStatus) {
      case 'Pending': return '#FFA726'; // Orange
      case 'Approved': return '#66BB6A'; // Green
      case 'Posted': return '#42A5F5'; // Blue
      case 'Rejected': return '#EF5350'; // Red
      default: return '#9E9E9E'; // Grey
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Post Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGeneratePost}
          >
            Generate New Post
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary" paragraph>
          Review, approve, and manage your social media posts
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={status} 
            onChange={handleStatusChange}
            aria-label="post status tabs"
          >
            <Tab label="All" value="All" />
            <Tab label="Pending" value="Pending" />
            <Tab label="Approved" value="Approved" />
            <Tab label="Posted" value="Posted" />
            <Tab label="Rejected" value="Rejected" />
          </Tabs>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {posts.length > 0 ? posts.map((post) => (
            <Grid item xs={12} md={6} key={post.postId}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderLeft: 4, 
                borderColor: getStatusColor(post.status)
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: getStatusColor(post.status),
                        fontWeight: 'bold'
                      }}
                    >
                      {post.status}
                    </Typography>
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    X Post
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {post.content.micro}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1">
                    LinkedIn Preview:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {post.content.short}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button size="small" onClick={() => handleViewDetails(post)}>
                    View Details
                  </Button>
                  {post.status === 'Pending' && (
                    <>
                      <Button 
                        size="small" 
                        color="primary" 
                        variant="contained"
                        onClick={() => handleApprovePost(post.postId)}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="small" 
                        color="error"
                        onClick={() => handleRejectPost(post.postId)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          )) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  {status === 'All' 
                    ? 'No posts available. Generate your first post!' 
                    : `No ${status.toLowerCase()} posts available.`}
                </Typography>
                {status !== 'All' && (
                  <Button 
                    variant="outlined" 
                    sx={{ mt: 2 }}
                    onClick={() => setStatus('All')}
                  >
                    View All Posts
                  </Button>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* Post Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {postDetails && (
          <>
            <DialogTitle>
              Post Details
              <Typography variant="subtitle2" color="text.secondary">
                Created: {new Date(postDetails.createdAt).toLocaleString()}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <DialogContentText component="div">
                <Typography variant="h6" gutterBottom>X Post (≤280 characters)</Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="body1">{postDetails.content.micro}</Typography>
                </Paper>

                <Typography variant="h6" gutterBottom>LinkedIn Post (≤700 characters)</Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="body1">{postDetails.content.short}</Typography>
                </Paper>

                <Typography variant="h6" gutterBottom>Blog Post (Detailed)</Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{postDetails.content.long}</Typography>
                </Paper>
                
                {postDetails.imageUrl && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Post Image</Typography>
                    <Box sx={{ textAlign: 'center' }}>
                      <img 
                        src={postDetails.imageUrl} 
                        alt="Post visual" 
                        style={{ maxWidth: '100%', maxHeight: '300px' }} 
                      />
                    </Box>
                  </>
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {postDetails.status === 'Pending' && (
                <>
                  <Button onClick={() => handleRejectPost(postDetails.postId)} color="error">
                    Reject
                  </Button>
                  <Button 
                    onClick={() => {
                      handleApprovePost(postDetails.postId);
                      handleCloseDialog();
                    }} 
                    variant="contained"
                    color="primary"
                  >
                    Approve
                  </Button>
                </>
              )}
              <Button onClick={handleCloseDialog}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Notifications */}
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

export default PostManagement;
