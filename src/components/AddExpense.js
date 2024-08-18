
import React, { useState } from 'react';
import axios from 'axios';

const AddExpense = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [description, setDescription] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const selectedCategory = category === 'Other' ? customCategory : category;

      const res = await axios.post(
        '/api/expenses',
        { amount, category: selectedCategory, date, description },
        config
      );
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-800 shadow-md rounded-md mt-8">
      <h1 className="text-2xl font-semibold mb-4 text-white">Add Expense</h1>
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white placeholder-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white placeholder-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {category === 'Other' && (
          <div>
            <input
              type="text"
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              required
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white placeholder-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white placeholder-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white placeholder-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
