import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useMediaQuery } from '@mui/material';

const NavBar = () => {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="w-full bg-blue-600 fixed top-0 left-0 flex items-center justify-between p-4 z-50"
      style={{
        backgroundColor: 'rgb(221,194,167)',
        background: 'radial-gradient(circle, rgba(221,194,167,1) 1%, rgba(186,124,217,1) 94%)',

      }}    >
      <div className="flex items-center">
        <img
          src="https://w7.pngwing.com/pngs/417/38/png-transparent-expense-management-finance-budget-android-thumbnail.png"
          alt="Tracker Logo"
          style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '8px' }}
        />

        <h1
          className="font-dancing-script text-2xl font-bolder text-gray-900"
          style={{ fontFamily: 'Dancing Script, cursive' }}
        >
          Expense Tracker
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        {isSmallScreen ? (
          <FaBars
            className="text-black text-2xl cursor-pointer"
            onClick={() => setIsNavOpen(!isNavOpen)}
          />
        ) : (
          <div className="flex space-x-4">
            <Link
              to="/expenses"
              className="text-dark-gray font-bold hover:text-blue-700 transition-colors duration-300"
            >
              AddExpense
            </Link>
            <Link
              to="/list"
              className="text-dark-gray font-bold hover:text-blue-700 transition-colors duration-300"
            >
              ExpenseList
            </Link>
            <Link
              to="/summary"
              className="text-dark-gray font-bold hover:text-blue-700 transition-colors duration-300"
            >
              TotalExpenses
            </Link>
            <Link
              to="/SpendingSummary"
              className="text-dark-gray font-bold hover:text-blue-700 transition-colors duration-300"
            >
              Summary
            </Link>

            <FaSignOutAlt
              className="text-blue text-2xl cursor-pointer"
              onClick={handleLogout}
            />
          </div>
        )}
      </div>

      {isSmallScreen && isNavOpen && (
        <div className="absolute top-16 right-0 bg-black bg-opacity-90 p-4 rounded shadow-lg w-64">
          <Link to="/expenses" className="block text-white p-2" onClick={() => setIsNavOpen(false)}>
          AddExpense
          </Link>
          <Link to="/list" className="block text-white p-2" onClick={() => setIsNavOpen(false)}>
          ExpenseList
          </Link>
          <Link to="/summary" className="block text-white p-2" onClick={() => setIsNavOpen(false)}>
          TotalExpenses
          </Link>
          <Link to="/SpendingSummary" className="block text-white p-2" onClick={() => setIsNavOpen(false)}>
            Summary
          </Link>
          <button onClick={handleLogout} className="block text-white p-2 mt-2">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
