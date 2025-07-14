import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import './SalesChart.css';
import { fetchDataFromApi } from '../../utils/apiCalls';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const [salesData, setSalesData] = useState({
    weekly: [],
    monthly: [],
    yearly: []
  });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('weekly');

    // Fetch dashboard recent activities 
    useEffect(() => {
        fetchDataFromApi('/api/v1/dashboard/sales').then((res) =>{
            console.log("Sales Data", res)
            setSalesData(res.data)
            setLoading(false)
            // setRecentActvities(res.activities)
        }).catch((error) => {
            console.error('Error fetching recent activities:', error);
        });
    }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch('/api/orders/sales');
//         const json = await res.json();
//         if (json.success) {
//           setSalesData(json.data);
//         }
//       } catch (err) {
//         console.error('Failed to load sales data', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

  const activeData = salesData[view] || [];

  const chartData = {
    labels: activeData.map(item => item.label),
    datasets: [
      {
        label: 'Total Sales (USD)',
        data: activeData.map(item => item.totalSales),
        fill: false,
        backgroundColor: '#ff6b6b',
        borderColor: '#ff6b6b',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `$${value}`
        }
      }
    }
  };

  return (
    // <div className="sales-chart-container">
    //   <div className="sales-chart-header">
    //     <h2>Sales Overview</h2>
    //     <select value={view} onChange={e => setView(e.target.value)}>
    //       <option value="weekly">Weekly</option>
    //       <option value="monthly">Monthly</option>
    //       <option value="yearly">Yearly</option>
    //     </select>
    //   </div>
    // <>
    //   {loading ? (
    //     <p className="loading-text">Loading chart...</p>
    //   ) : (
    //     <Line data={chartData} options={options} />
    //   )}
    // </>

    <div className="chart-card">
        <div className="chart-header">
            <div className="chart-title">Revenue Overview</div>
            <div className="chart-actions">
                <button className={view === "weekly" ? "active": null} onClick={() => setView("weekly")}>Week</button>
                <button  className={view === "monthly" ? "active": null} onClick={() => setView("monthly")}>Month</button>
                <button className={view === "yearly" ? "active": null} onClick={() => setView("yearly")}>Year</button>
            </div>
        </div>
        <div className="chart-placeolder">
            {loading ? (
                <p className="loading-text">Loading chart...</p>
            ) : (
                <Line data={chartData} options={options} />
            )}
        </div>
    </div>
  );
};

export default SalesChart;
