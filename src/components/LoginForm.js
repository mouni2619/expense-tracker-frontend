import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Container, Typography, CircularProgress } from '@mui/material';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL; 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/SpendingSummary');
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Container maxWidth="xs" style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          style={{ position: 'relative' }}
        >
          {loading && <CircularProgress size={24} style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: '-12px', marginTop: '-12px' }} />}
          {loading ? 'Logging in...' : 'Login'} 
        </Button>
        {error && <Typography color="error" align="center">{error}</Typography>}
      </form>
      <Typography variant="body1" align="center" style={{ marginTop: '16px' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ textDecoration: 'underline', color: 'blue' }}>
          Register here
        </Link>
      </Typography>
      <Typography variant="body2" align="center" style={{ marginTop: '8px' }}>
        <b style={{ color: 'red' }}>Demo User:</b>
        <strong>Email:</strong> mounikaadada234@gmail.com
      </Typography>
      <Typography variant="body2" align="center" style={{ marginTop: '4px' }}>
        <strong>Password:</strong> mounika@744
      </Typography>
    </Container>
  );
};

export default LoginForm;
