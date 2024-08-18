import React from 'react';
import { saveAs } from 'file-saver';

const ExportData = ({ expenses }) => {
  const exportToCSV = () => {
    const csvRows = [
      ['Date', 'Amount', 'Category', 'Description'],
      ...expenses.map(exp => [exp.date, exp.amount, exp.category, exp.description || '']),
    ];
    const csvContent = csvRows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'expenses.csv');
  };

  return (
    <button onClick={exportToCSV}>Export to CSV</button>
  );
};

export default ExportData;
