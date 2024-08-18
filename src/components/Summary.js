import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, CircularProgress, MenuItem, Select, Box } from '@mui/material';

const iconMapping = {
  Food: 'https://cdn-icons-png.flaticon.com/512/2927/2927347.png',
  Health: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
  Travel: 'https://cdn-icons-png.flaticon.com/512/5219/5219574.png',
  Entertainment: 'https://cdn-icons-png.flaticon.com/512/6008/6008427.png',
  Shopping: 'https://cdn-icons-png.flaticon.com/512/7411/7411553.png',
  Maintenance: 'https://cdn-icons-png.flaticon.com/512/9760/9760009.png',
  Other: 'https://cdn-icons-png.flaticon.com/512/6289/6289247.png'
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Summary = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/expenses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const expenses = response.data;


        const allYears = [...new Set(expenses.map(expense => new Date(expense.date).getFullYear()))];
        setYears(allYears);

        // Group expenses by month and year
        const groupedExpenses = expenses.reduce((acc, expense) => {
          const expenseDate = new Date(expense.date);
          const yearMonth = `${expenseDate.getFullYear()}-${expenseDate.getMonth() + 1}`;

          if (!acc[yearMonth]) {
            acc[yearMonth] = { total: 0, categories: {} };
          }

          acc[yearMonth].total += expense.amount;

          if (!acc[yearMonth].categories[expense.category]) {
            acc[yearMonth].categories[expense.category] = 0;
          }
          acc[yearMonth].categories[expense.category] += expense.amount;

          return acc;
        }, {});

        setMonthlyExpenses(groupedExpenses);
        if (allYears.length) {
          setSelectedYear(allYears[0]);
          const latestMonth = Object.keys(groupedExpenses)
            .filter(key => key.startsWith(allYears[0]))
            .sort()
            .reverse()[0]?.split('-')[1];
          setSelectedMonth(latestMonth || '');
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch expenses:', err);
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    const months = Object.keys(monthlyExpenses)
      .filter(key => key.startsWith(year))
      .map(key => key.split('-')[1]);
    setSelectedMonth(months[0] || '');
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const renderMonthSummary = (yearMonth, data) => {
    const [year, month] = yearMonth.split('-');
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

    return (
      <Box
        key={yearMonth}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // width: { xs: '100%', sm: '48%', md: '30%', lg: '22%' },
          margin: '8px',
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: 'white',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          boxSizing: 'border-box'
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: '16px' }}>
          Total Expenses: ${data.total.toFixed(2)}
        </Typography>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: '16px', // Space between grid items
          justifyContent: 'center',
          padding: '16px',
        }}>
          {Object.keys(data.categories).map((category) => (
            <Box
              key={category}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '130px',
                width: '150px',
                borderBottom: '1px solid #ddd',
                paddingBottom: '8px',
                backgroundColor: getRandomColor(),
                borderRadius: '8px',
                padding: '8px',
                color: 'white',
                boxSizing: 'border-box',
                flex: 'none',
              }}
            >
              <img
                src={iconMapping[category] || ''}
                alt={category}
                style={{ width: '54px', height: '54px', marginBottom: '8px', borderRadius: '50%' }}
              />
              <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '4px' }}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Typography>
              <Typography variant="body1">
                ${data.categories[category].toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const filteredExpenses = Object.keys(monthlyExpenses)
    .filter(key => key.startsWith(selectedYear) && key.split('-')[1] === selectedMonth)
    .reduce((acc, key) => {
      acc[key] = monthlyExpenses[key];
      return acc;
    }, {});

  return (
    <Container sx={{ padding: '16px' }}>

      <Box sx={{ marginBottom: '16px', display: 'flex', gap: '16px', color: "white", }}>
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          sx={{ flex: 1, minWidth: '120px', backgroundColor: "white" }}
          variant="outlined"
        >
          {years.map(year => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </Select>
        <Select
          value={selectedMonth}
          onChange={handleMonthChange}
          sx={{ flex: 1, minWidth: '120px', backgroundColor: "white" }}
          variant="outlined"
        >
          {Object.keys(monthlyExpenses)
            .filter(key => key.startsWith(selectedYear))
            .map(key => key.split('-')[1])
            .sort((a, b) => b - a)
            .map(month => (
              <MenuItem key={month} value={month}>
                {new Date(selectedYear, month - 1).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
        </Select>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          margin: '-8px',
          gap: '16px'
        }}>
          {Object.keys(filteredExpenses).length > 0
            ? Object.keys(filteredExpenses).map((yearMonth) =>
              renderMonthSummary(yearMonth, filteredExpenses[yearMonth])
            )
            : <Typography>No data available for selected month and year.</Typography>
          }
        </Box>
      )}
    </Container>
  );
};

export default Summary;
