// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const SalesTrendChart = () => {
//   const data = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
//     datasets: [
//       {
//         label: 'Sales',
//         data: [5000, 7000, 6000, 9000, 12000, 10000, 15000],
//         borderColor: '#4CAF50',
//         backgroundColor: 'rgba(76, 175, 80, 0.2)',
//         fill: true,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Sales Trends (Last 7 Months)',
//       },
//     },
//   };

//   return <Line data={data} options={options} />;
// };

// export default SalesTrendChart;








// components/SalesTrendsChart.js
import React, { useContext, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { MyContext } from "../../App";

// 📌 Register Chart.js Components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const SalesTrendsChart = () => {
  const [salesData, setSalesData] = useState([]);

  const context = useContext(MyContext)

  // useEffect(() => {
  //   const fetchSalesData = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:5000/api/sales-trends");
  //       setSalesData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching sales trends:", error);
  //     }
  //   };

  //   fetchSalesData();
  // }, []);

  // 📌 Format data for the chart
  const chartData = {
    labels: context?.salesTrendsData?.map(
      (data) => `${data._id.year}-${data._id.month}-${data._id.day}`
    ),
    datasets: [
      {
        label: "Sales Revenue ($)",
        data: context?.salesTrendsData?.map((data) => data.totalSales),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Sales ($)" }, beginAtZero: true },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "auto" }}>
      <h3>📈 Sales Trends</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SalesTrendsChart;
