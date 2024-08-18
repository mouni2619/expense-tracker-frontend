import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Link } from '@mui/material';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL; 
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/expenses');
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <Container maxWidth="xs" style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
        {error && <Typography color="error" align="center">{error}</Typography>}
      </form>
      <Typography variant="body1" align="center" style={{ marginTop: '16px' }}>
        Already have an account?{' '}
        <Link href="/" variant="body1">
          Login here
        </Link>
      </Typography>
    </Container>
  );
};

export default RegisterForm;
