import React, {useEffect, useState} from "react";
import "./Dashboard.css";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Header from "../../components/layout/Header/Header";
import { fetchDataFromApi } from '../../utils/apiCalls'; 
import SalesChart from "../../components/chart/SalesChart";


const Dashboard = () => {
    const [dashboardStats, setDashboardStats] = useState([])
    const [recentActivities, setRecentActvities] = useState([])

    // Fetch dashboard recent activities 
    useEffect(() => {
        fetchDataFromApi('/api/v1/dashboard/activity').then((res) =>{
            console.log("Ativities", res)
            setRecentActvities(res.activities)
        }).catch((error) => {
            console.error('Error fetching recent activities:', error);
        });
    }, []);

    // Fetch dashboard stats 
    useEffect(() => {
        fetchDataFromApi('/api/v1/dashboard/stats').then((res) =>{
            console.log("dashboardStats", res.data.recentOrders[0].totalCount[0].count)
            setDashboardStats(res.data)
        }).catch((error) => {
            console.error('Error fetching dashboard stats:', error);
        });
    }, []);
    
    return (
        <div className="container">
            <Sidebar />
                <div className="main-content">
                    <Header />
                    <div className="dashboard-section">
                        <div className="stats-cards">
                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title">Total Users</div>
                                    <div className="card-icon users">
                                        <i className="fas fa-users"></i>
                                    </div>
                                </div>
                                <div className="card-value">{dashboardStats?.userCount}</div>
                                <div className="card-footer">
                                    {/* <i className="fas fa-arrow-up"></i>  */}
                                    from last month
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title">Total Products</div>
                                    <div className="card-icon products">
                                        <i className="fas fa-box"></i>
                                    </div>
                                </div>
                                <div className="card-value">{dashboardStats?.productCount}</div>
                                <div className="card-footer">
                                    {/* <i className="fas fa-arrow-up"></i>  */}
                                    from last month
                                </div>
                            </div>

                            {/* <div className="card">
                                <div className="card-header">
                                    <div className="card-title">New Orders</div>
                                    <div className="card-icon orders">
                                        <i className="fas fa-shopping-cart"></i>
                                    </div>
                                </div>
                                <div className="card-value">{dashboardStats?.recentOrders[0]?.totalCount[0]?.count}</div>
                                <div className="card-footer primary-dark">
                                    from last month
                                </div>
                            </div> */}

                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title">Total Revenue</div>
                                    <div className="card-icon revenue">
                                        <i className="fas fa-dollar-sign"></i>
                                    </div>
                                </div>
                                <div className="card-value">${dashboardStats?.revenue?.totalRevenue}</div>
                                <div className="card-footer">
                                    {/* <i className="fas fa-arrow-up"></i>  */}
                                    from last month
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="charts">
                            {/* <div className="chart-card">
                                <div className="chart-header">
                                    <div className="chart-title">Revenue Overview</div>
                                    <div className="chart-actions">
                                        <button>Week</button>
                                        <button className="active">Month</button>
                                        <button>Year</button>
                                    </div>
                                </div>
                                <div className="chart-placeolder">
                                    <SalesChart></SalesChart>
                                </div>
                            </div> */}
                            <SalesChart></SalesChart>

                            <div className="chart-card">
                                <div className="chart-header">
                                    <div className="chart-title">Traffic Sources</div>
                                    <div className="chart-actions">
                                        <button className="active">All</button>
                                    </div>
                                </div>
                                <div className="chart-placeholder">
                                    [Pie Chart Placeholder]
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="activity-card">
                            <div className="activity-header">
                                <div className="activity-title">Recent Activity</div>
                                <div className="chart-actions">
                                    {/* <button>View All</button> */}
                                </div>
                            </div>
                            <ul className="activity-list">
                                {
                                    recentActivities?.map((activity) => (
                                        <li className="activity-item">
                                            <div className="activity-icon">
                                                <i className={activity.icon}></i>
                                            </div>
                                            <div className="activity-content">
                                                <div className="activity-message">{activity.message}</div>
                                                <div className="activity-time">{activity.timeAgo}</div>
                                            </div>
                                        </li>
                                    ))
                                }
                             
                                {/* <li className="activity-item">
                                    <div className="activity-icon">
                                        <i className="fas fa-shopping-cart"></i>
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-message">New order #12345 placed</div>
                                        <div className="activity-time">1 hour ago</div>
                                    </div>
                                </li>
                                <li className="activity-item">
                                    <div className="activity-icon">
                                        <i className="fas fa-box-open"></i>
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-message">Product "Wireless Headphones" stock updated</div>
                                        <div className="activity-time">3 hours ago</div>
                                    </div>
                                </li>
                                <li className="activity-item">
                                    <div className="activity-icon">
                                        <i className="fas fa-comment-alt"></i>
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-message">New customer review received</div>
                                        <div className="activity-time">5 hours ago</div>
                                    </div>
                                </li> */}
                            </ul>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default Dashboard;