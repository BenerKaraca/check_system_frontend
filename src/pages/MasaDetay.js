import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Grid, Card, CardContent, Button, Box, List, ListItem, ListItemText, IconButton, Divider, Snackbar, Alert, AppBar, Toolbar, Paper, Chip, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import API_BASE_URL from '../config/api';

export default function MasaDetay() {
  const { masaId } = useParams();
  const navigate = useNavigate();
  const [adisyon, setAdisyon] = useState({ siparisler: [], toplamTutar: 0, masaNo: '' });
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Adisyon ve ürünleri çek
  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API_BASE_URL}/api/masalar/${masaId}/adisyon`),
      axios.get(`${API_BASE_URL}/api/urunler`)
    ]).then(([adisyonRes, urunlerRes]) => {
      setAdisyon(adisyonRes.data);
      setUrunler(urunlerRes.data);
    }).catch(err => {
      console.error('Error loading data:', err);
      setSnackbar({ open: true, message: 'Veriler yüklenirken hata oluştu', severity: 'error' });
    }).finally(() => setLoading(false));
  }, [masaId]);

  // Sipariş ekle
  const handleAddUrun = (urunId) => {
    axios.post(`${API_BASE_URL}/api/siparisler`, null, { 
      params: { masaId, urunId, adet: 1 } 
    })
      .then(() => reloadAdisyon())
      .then(() => setSnackbar({ open: true, message: 'Ürün sepete eklendi', severity: 'success' }))
      .catch(() => setSnackbar({ open: true, message: 'Ürün eklenemedi', severity: 'error' }));
  };

  // Siparişten ürün çıkar veya adedini azalt
  const handleRemoveUrun = (siparis) => {
    const yeniAdet = siparis.adet - 1;
    axios.put(`${API_BASE_URL}/api/siparisler/${siparis.siparisId}/adet`, null, { 
      params: { yeniAdet } 
    })
      .then(() => reloadAdisyon())
      .then(() => setSnackbar({ open: true, message: 'Ürün çıkarıldı', severity: 'info' }))
      .catch(() => setSnackbar({ open: true, message: 'İşlem başarısız', severity: 'error' }));
  };

  // Adisyonu güncelle
  const reloadAdisyon = () => {
    return axios.get(`${API_BASE_URL}/api/masalar/${masaId}/adisyon`).then(res => setAdisyon(res.data));
  };

  // Adisyonu kapat (tüm siparişleri sil)
  const handleAdisyonKapat = () => {
    if (window.confirm('Adisyonu kapatmak istediğinize emin misiniz?')) {
      axios.delete(`${API_BASE_URL}/api/siparisler/masa/${masaId}`)
        .then(() => reloadAdisyon())
        .then(() => {
          setSnackbar({ open: true, message: 'Adisyon kapatıldı', severity: 'success' });
          setTimeout(() => navigate('/'), 1500);
        })
        .catch(() => setSnackbar({ open: true, message: 'Adisyon kapatılamadı', severity: 'error' }));
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f5f5' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Masa {adisyon.masaNo} - Adisyon
          </Typography>
          <ShoppingCartIcon sx={{ mr: 1 }} />
          <Chip 
            label={`${adisyon.siparisler.length} ürün`} 
            color="secondary" 
            size="small"
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Ürünler Bölümü */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, color: '#1976d2' }}>
                Ürünler
              </Typography>
              {urunler.length === 0 ? (
                <Typography color="text.secondary" align="center" py={4}>
                  Henüz ürün bulunmuyor
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {urunler.map((urun) => (
                    <Grid item xs={6} sm={4} md={3} key={urun.urunId}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            transform: 'translateY(-4px)',
                            boxShadow: 6 
                          }
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, flexGrow: 1 }}>
                            {urun.urunAdi}
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>
                            {urun.urunFiyati.toFixed(2)} ₺
                          </Typography>
                          <Button 
                            variant="contained" 
                            fullWidth 
                            startIcon={<AddIcon />}
                            onClick={() => handleAddUrun(urun.urunId)}
                            sx={{ mt: 'auto' }}
                          >
                            Ekle
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* Sepet Bölümü */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, color: '#1976d2' }}>
                Sepet
              </Typography>
              
              {adisyon.siparisler.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <ShoppingCartIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                  <Typography color="text.secondary">Sepet boş</Typography>
                </Box>
              ) : (
                <>
                  <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {adisyon.siparisler.map((siparis) => (
                      <React.Fragment key={siparis.siparisId}>
                        <ListItem 
                          secondaryAction={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <IconButton 
                                edge="end" 
                                onClick={() => handleRemoveUrun(siparis)}
                                color="error"
                                size="small"
                              >
                                <RemoveIcon />
                              </IconButton>
                              <Chip 
                                label={siparis.adet} 
                                size="small" 
                                sx={{ mx: 1, minWidth: 40 }}
                              />
                            </Box>
                          }
                        >
                          <ListItemText
                            primary={siparis.urun?.urunAdi || 'Ürün'}
                            secondary={`${siparis.toplamTutar.toFixed(2)} ₺`}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Toplam:
                      </Typography>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                        {adisyon.toplamTutar?.toFixed(2) || '0.00'} ₺
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    color="success" 
                    fullWidth 
                    size="large"
                    onClick={handleAdisyonKapat}
                    disabled={adisyon.siparisler.length === 0}
                    sx={{ 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}
                  >
                    Adisyonu Kapat
                  </Button>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
