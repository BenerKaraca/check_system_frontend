import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Box, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import API_BASE_URL from '../config/api';

export default function Masalar() {
  const [masalar, setMasalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/masalar`)
      .then(res => {
        const raw = res.data || [];
        const map = new Map();
        raw.forEach(m => {
          const key = m.masaNo !== undefined && m.masaNo !== null ? String(m.masaNo).trim() : (m.masaId ? String(m.masaId) : '');
          if (!map.has(key)) map.set(key, m);
        });
        let unique = Array.from(map.values());
        const isUpper = s => /u$/i.test(String(s));
        const parseNum = s => {
          const match = String(s).match(/(\d+)/);
          return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
        };
        const lower = unique.filter(x => !isUpper(x.masaNo)).sort((a, b) => parseNum(a.masaNo) - parseNum(b.masaNo));
        const upper = unique.filter(x => isUpper(x.masaNo)).sort((a, b) => parseNum(a.masaNo) - parseNum(b.masaNo));
        setMasalar([...lower, ...upper]);
      })
      .catch(() => setMasalar([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ bgcolor: '#1976d2', mb: 4 }}>
        <Toolbar>
          <TableRestaurantIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Restoran Yönetim Sistemi
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<AssessmentIcon />} 
            onClick={() => navigate('/rapor')}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Gün Sonu Raporu
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
            Masalar
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AssessmentIcon />} 
            onClick={() => navigate('/rapor')}
            sx={{ display: { xs: 'flex', sm: 'none' }, mx: 'auto', mt: 2 }}
          >
            Gün Sonu Raporu
          </Button>
        </Box>
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
          </Box>
        ) : masalar.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              Henüz masa bulunmuyor
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {masalar.map((masa) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={masa.masaId}>
                <Card 
                  sx={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: 8 
                    },
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                  onClick={() => navigate(`/masa/${masa.masaId}`)}
                >
                  <Box sx={{ 
                    bgcolor: '#1976d2', 
                    color: 'white', 
                    p: 2,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Masa {masa.masaNo}
                    </Typography>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600, textAlign: 'center' }}>
                      {masa.masaTutar.toFixed(2)} ₺
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                      Toplam Tutar
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
} 