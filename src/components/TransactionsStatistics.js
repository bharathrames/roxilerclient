import React, { useState, useEffect } from 'react';


function TransactionsStatistics() {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [totalNotSold, setTotalNotSold] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://roxilerserver-j5ii.vercel.app/combinedData');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    calculateStatistics(e.target.value);
  };

  const calculateStatistics = (month) => {
    let totalAmount = 0;
    let totalSold = 0;
    let totalNotSold = 0;

    data.forEach((transaction) => {
      const transactionMonth = new Date(transaction.dateOfSale).toLocaleString('default', { month: 'long' });
      if (transactionMonth === month) {
        totalAmount += transaction.price;
        if (transaction.sold) {
          totalSold++;
        } else {
          totalNotSold++;
        }
      }
    });

    setTotalAmount(totalAmount.toFixed(2));
    setTotalSold(totalSold);
    setTotalNotSold(totalNotSold);
  };

  return (
    <div className="mainStatistics ">
      <h1 className='Statisticsh1'>Transaction Statistics</h1>
      <div>
        <label>Select Month</label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="">select month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>
      <div className="statistics">
        <div className="statistic-box">
          <h2 className='statisticsh2'>Total Amount of Sale </h2>
          <h3>{totalAmount}</h3>
        </div>
        <div className="statistic-box">
          <h2 className='statisticsh2'>Total Sold Items</h2>
          <h3>{totalSold}</h3>
        </div>
        <div className="statistic-box">
          <h2 className='statisticsh2'> Total Not Sold Items </h2>
          <h3>{totalNotSold}</h3>
        </div>
      </div>
    </div>
  );
}

export default TransactionsStatistics;