import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box, Button, AppBar, Toolbar, Card, CardContent, Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

export default function Rapor() {
  const [raporlar, setRaporlar] = useState([]);
  const [ciro, setCiro] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API_BASE_URL}/api/raporlar`),
      axios.get(`${API_BASE_URL}/api/raporlar/gunluk-ciro`)
    ]).then(([raporRes, ciroRes]) => {
      setRaporlar(raporRes.data);
      setCiro(ciroRes.data);
    }).catch(err => {
      console.error('Error loading reports:', err);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Button 
            edge="start" 
            color="inherit" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Geri
          </Button>
          <AssessmentIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gün Sonu Raporu
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card sx={{ mb: 4, bgcolor: '#1976d2', color: 'white' }}>
          <CardContent>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, textAlign: 'center' }}>
              Toplam Ciro
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 700, textAlign: 'center', mt: 2 }}>
              {ciro.toFixed(2)} ₺
            </Typography>
          </CardContent>
        </Card>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
          </Box>
        ) : raporlar.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Henüz rapor bulunmuyor
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ürün</TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Satış Adedi</TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Toplam Tutar (₺)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {raporlar.map((rapor) => (
                  <TableRow 
                    key={rapor.raporId}
                    sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' },
                      '&:hover': { bgcolor: '#f0f0f0' }
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                      {rapor.urun?.urunAdi || 'Bilinmeyen Ürün'}
                    </TableCell>
                    <TableCell align="right">{rapor.satisAdedi || 0}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      {rapor.toplamTutar.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}
