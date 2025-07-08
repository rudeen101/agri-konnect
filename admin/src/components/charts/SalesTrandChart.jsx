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
      <h4>📈 Sales Trends</h4>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SalesTrendsChart;
