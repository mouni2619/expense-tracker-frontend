import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import NavBar from './components/Navbar';
import SpendingSummary from './components/SpendingSummary';
import { Box } from '@mui/material';

function App() {
  const location = useLocation();

  const shouldShowNavBar = !['/', '/register'].includes(location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: "#000" }}>
      {shouldShowNavBar && <NavBar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,

          ml: shouldShowNavBar ? '' : '0',

          pt: '5rem',
          backgroundImage: "url(https://img.pikbest.com/ai/illus_our/20230427/c1f590b396423c5eca11e8ec940ffec2.jpg!w700wp)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",

          backgroundColor: "white"

        }}
      >
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/expenses" element={<ExpenseForm />} />
          <Route path="/list" element={<ExpenseList />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/SpendingSummary" element={<SpendingSummary />} />

        </Routes>
      </Box>
    </Box>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}


