import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Select, MenuItem, InputLabel, FormControl, Paper, Grid } from '@mui/material';

const ExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL; 
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const selectedCategory = category === 'Other' ? customCategory : category;

      await axios.post(
        `${API_URL}/expenses`, 
        { amount, category: selectedCategory, date, description }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/list');
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#E2DFD2', borderRadius: '8px' }}>
        <Typography variant="h5" gutterBottom align="center" color="">
          Add Expense
        </Typography>
        <form onSubmit={handleAddExpense}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Amount"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                  required
                >
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="Shopping">Shopping</MenuItem>
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {category === 'Other' && (
              <Grid item xs={12}>
                <TextField
                  label="Enter Custom Category"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label="Date"
                type="date"
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
              >
                Add Expense
              </Button>
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography color="error" style={{ marginTop: '16px' }} align="center">
                  {error}
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ExpenseForm;



