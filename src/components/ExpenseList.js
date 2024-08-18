import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Container, Typography, TextField, Paper, Box, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { CSVLink } from 'react-csv';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [editedAmount, setEditedAmount] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const API_URL = process.env.REACT_APP_API_URL; 
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/expenses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(response.data);
        setFilteredExpenses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch expenses:', err);
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    const filterExpenses = () => {
      return expenses.filter(expense => {
        const matchesCategory = categoryFilter === '' || expense.category.toLowerCase().includes(categoryFilter.toLowerCase());
        const matchesDate = dateFilter === '' || new Date(expense.date).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();
        return matchesCategory && matchesDate;
      });
    };
    
    setFilteredExpenses(filterExpenses());
  }, [categoryFilter, dateFilter, expenses]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setEditedAmount(expense.amount);
    setEditedCategory(expense.category);
    setEditedDate(expense.date.slice(0, 10)); 
    setEditedDescription(expense.description);
    setEditDialogOpen(true);
  };
  
  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedExpense = {
        amount: editedAmount,
        category: editedCategory,
        date: editedDate,
        description: editedDescription
      };
  
      if (!selectedExpense || !selectedExpense._id) {
        throw new Error('Selected expense or its ID is missing');
      }
  
      const response = await axios.put(`${API_URL}/expenses/${selectedExpense._id}`, updatedExpense, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const updatedExpenses = expenses.map(expense =>
        expense._id === selectedExpense._id
          ? { ...expense, ...updatedExpense }
          : expense
      );
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
      setEditDialogOpen(false);
    } catch (err) {
      console.error('Failed to update expense:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedExpenses = expenses.filter(expense => expense._id !== id);
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  };

  const headers = [
    { label: 'Amount', key: 'amount' },
    { label: 'Category', key: 'category' },
    { label: 'Date', key: 'date' },
    { label: 'Description', key: 'description' },
  ];

  return (
    <Container maxWidth="lg" >
      <Paper elevation={3} sx={{ backgroundColor:"#c4bea3", color: 'white' }}>
        <TextField
          label="Filter by Category"
          variant="outlined"
          fullWidth
          margin="normal"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{ mb: 0, '& .MuiInputBase-input': { color: 'black' }, backgroundColor:"white" }}
        />
        <TextField
          label="Filter by Date"
          variant="outlined"
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          sx={{ mb: 0 , backgroundColor:"white"}}
        />
        {loading ? (
          <Typography variant="body1" sx={{ color: 'white' }}>Loading...</Typography>
        ) : (
          <>
          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button variant="contained" color="success">
                <CSVLink data={filteredExpenses} headers={headers} filename="expenses.csv" style={{ color: 'white', textDecoration: 'none' }}>
                  Export as CSV
                </CSVLink>
              </Button>
            </Grid>
            <Box overflow="auto" sx={{ maxHeight: '60vh' }}>
              
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ color: 'black', fontSize: '1.2rem', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense._id}>
                      <TableCell sx={{ color: 'black' }}>${Number(expense.amount).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: 'black' }}>{expense.category}</TableCell>
                      <TableCell sx={{ color: 'black' }}>{formatDate(expense.date)}</TableCell>
                      <TableCell sx={{ color: 'black' }}>{expense.description}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(expense)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(expense._id)} color="secondary">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          
          </>
        )}
      </Paper>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={editedAmount}
            onChange={(e) => setEditedAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Date"
            variant="outlined"
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={editedDate}
            onChange={(e) => setEditedDate(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExpenseList;








