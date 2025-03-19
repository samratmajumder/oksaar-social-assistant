import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Pagination
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import axios from 'axios';

const InteractionView = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    responded: 0,
    pending: 0
  });

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchInteractions(page);
  }, [page]);

  const fetchInteractions = async (currentPage) => {
    setLoading(true);
    try {
      // Fetch interactions for the current page
      const interactionsRes = await axios.get(`/api/interactions?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
      setInteractions(interactionsRes.data.items || []);
      setTotalPages(Math.ceil((interactionsRes.data.total || 0) / ITEMS_PER_PAGE));
      
      // Fetch interaction stats
      const statsRes = await axios.get('/api/interactions/stats');
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching interactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading && page === 1) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Interactions
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Monitor and manage responses to your social media posts
        </Typography>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="primary">{stats.total}</Typography>
                <Typography variant="body1">Total Interactions</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="success.main">{stats.responded}</Typography>
                <Typography variant="body1">Responded</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="warning.main">{stats.pending}</Typography>
                <Typography variant="body1">Pending</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {interactions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No interactions yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Interactions will appear here once people reply to your posts
          </Typography>
        </Paper>
      ) : (
        <>
          <List sx={{ bgcolor: 'background.paper' }}>
            {interactions.map((interaction, index) => (
              <React.Fragment key={interaction.interactionId}>
                {index > 0 && <Divider component="li" />}
                <ListItem alignItems="flex-start" sx={{ py: 3 }}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
                          Post Reply
                        </Typography>
                        <Chip 
                          size="small" 
                          label={interaction.response ? 'Responded' : 'Pending'} 
                          color={interaction.response ? 'success' : 'warning'}
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(interaction.createdAt)}
                      </Typography>
                    </Box>
                    
                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <Box>
                          <Typography variant="body1">
                            {interaction.replyContent}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Via: {interaction.platform || 'Social Media'}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                    
                    {interaction.response && (
                      <Paper variant="outlined" sx={{ p: 2, ml: 4, bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <AutoAwesomeIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <Box>
                            <Typography variant="body1">
                              {interaction.response}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Responded: {formatTimestamp(interaction.respondedAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    )}
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
          </List>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default InteractionView;