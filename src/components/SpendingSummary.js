import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Grid } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const SpendingSummary = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [monthlyData, setMonthlyData] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL; 
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data);

        const groupedByMonth = response.data.reduce((acc, expense) => {
          const date = new Date(expense.date);
          const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
          if (!acc[yearMonth]) {
            acc[yearMonth] = 0;
          }
          acc[yearMonth] += expense.amount;
          return acc;
        }, {});

        const monthlyExpenses = Object.keys(groupedByMonth).map((key) => ({
          month: key,
          amount: groupedByMonth[key],
        }));

        setMonthlyData(monthlyExpenses);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      }
    };

    fetchExpenses();
  }, []);

  const data = expenses.reduce((acc, expense) => {
    const existingCategory = acc.find((item) => item.name === expense.category);
    if (existingCategory) {
      existingCategory.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Container maxWidth="md" className="p-4">
    
      {error && <Typography color="error" className="text-red-500 mb-4">{error}</Typography>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4 shadow-md rounded-lg">
            <Typography variant="h6" gutterBottom className="text-xl font-semibold mb-2">
              Category Distribution
            </Typography>
            <div className="flex justify-center items-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4 shadow-md rounded-lg">
            <Typography variant="h6" gutterBottom className="text-xl font-semibold mb-2">
              Monthly Expenses
            </Typography>
            <div className="flex justify-center items-center">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SpendingSummary;

