import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const TransactionsBarChart = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    
    fetch('http://localhost:5000/combinedData')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((rawData) => {
        setData(rawData);
        
        const priceRanges = {
          '0 - 100': 0,
          '101 - 200': 0,
          '201 - 300': 0,
          '301 - 400': 0,
          '401 - 500': 0,
          '501 - 600': 0,
          '601 - 700': 0,
          '701 - 800': 0,
          '801 - 900': 0,
          '901-above': 0,
        };

        rawData.forEach((item) => {
          const price = item.price;
          const date = new Date(item.dateOfSale);
          const month = date.getMonth() + 1;
          if (selectedMonth === '' || month === parseInt(selectedMonth)) {
            for (const range in priceRanges) {
              const [min, max] = range.split(' - ').map(Number);
              if (price >= min && price <= max) {
                priceRanges[range]++;
                break;
              }
            }
          }
        });

        const priceRangeData = Object.entries(priceRanges).map(([range, count]) => ({
          range,
          count,
        }));

        
        setChartData(priceRangeData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [selectedMonth]);

  
  const monthOptions = [
    { value: '', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
  ];

  const handleMonthSelectChange = (selectedOption) => {
    setSelectedMonth(selectedOption.value);
  };

  return (
    <div className="chart-container">
  <h1 className="chart-title">Transactions Bar Chart</h1>
  <Select
    className="month-select"
    options={monthOptions}
    onChange={handleMonthSelectChange}
    placeholder="Select Month"
  />
  <div className="chart">
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <XAxis dataKey="range" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="rgba(75,192,192,0.5)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

  );
};

export default TransactionsBarChart;