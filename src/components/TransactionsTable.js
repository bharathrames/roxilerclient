import React, { useState, useEffect } from 'react';

function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('3'); 
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadTransactions();
  }, [selectedMonth, currentPage, searchText]); 

  const loadTransactions = async () => {
    try {
      const response = await fetch(`https://roxilerserver-j5ii.vercel.app/combinedData`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      const filteredTransactions = data.filter((transaction) => {
        const transactionMonth = new Date(transaction.dateOfSale).getMonth() + 1;
        return transactionMonth.toString() === selectedMonth;
      });

      const searchedTransactions = filteredTransactions.filter((transaction) => {
        return (
          transaction.title.toLowerCase().includes(searchText.toLowerCase()) ||
          transaction.description.toLowerCase().includes(searchText.toLowerCase()) ||
          transaction.price.toString().includes(searchText)
        );
      });

      setTransactions(searchedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  // ...
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className='maincontainer'>
      <h1>Transactions Table</h1>
      <label>Select Month</label>
      <select value={selectedMonth} onChange={handleMonthChange}>
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i + 1} value={(i + 1).toString()}>
            {new Date(0, i).toLocaleString('default', { month: 'long' })}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search Transaction..."
        value={searchText}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Image</th>
            <th>Sold</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.price}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td>
                <img src={transaction.image} alt={transaction.title} />
              </td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
              <td>{transaction.dateOfSale}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button className='buttontable' onClick={handlePrevPage}>Previous</button>
        <button className='buttontable'  onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
}

export default TransactionsTable;