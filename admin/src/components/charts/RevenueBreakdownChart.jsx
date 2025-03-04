import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueBreakdownChart = () => {
  const data = {
    labels: ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys'],
    datasets: [
      {
        label: 'Revenue',
        data: [20000, 15000, 12000, 8000, 5000],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue Breakdown by Category',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default RevenueBreakdownChart;