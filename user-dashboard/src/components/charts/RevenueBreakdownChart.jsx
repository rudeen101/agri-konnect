// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const RevenueBreakdownChart = () => {
//   const data = {
//     labels: ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys'],
//     datasets: [
//       {
//         label: 'Revenue',
//         data: [20000, 15000, 12000, 8000, 5000],
//         backgroundColor: 'rgba(54, 162, 235, 0.6)',
//         borderColor: 'rgba(54, 162, 235, 1)',
//         borderWidth: 1,
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
//         text: 'Revenue Breakdown by Category',
//       },
//     },
//   };

//   return <Bar data={data} options={options} />;
// };

// export default RevenueBreakdownChart;


import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/apiCalls";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueByCategoryChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
		fetchDataFromApi('/api/sales/revenueByCategory').then((res) => {
			const categories = res?.map(item => item?._id); // Category names
			const revenues = res?.map(item => item?.totalRevenue); // Revenue values

			setChartData({
			labels: categories,
			datasets: [
				{
					label: "Revenue by Category",
					data: revenues,
					backgroundColor: "rgba(75, 192, 192, 0.6)",
					borderColor: "rgba(75, 192, 192, 1)",
					borderWidth: 1,
				}
			]
			});
		})
    }, []);

    return (
        <div style={{ width: "100%", margin: "auto" }}>
            <h3>Revenue Breakdown by Category</h3>
            {chartData ? <Bar data={chartData} options={{ responsive: true }} /> : <p>Loading chart...</p>}
        </div>
    );
};

export default RevenueByCategoryChart;
