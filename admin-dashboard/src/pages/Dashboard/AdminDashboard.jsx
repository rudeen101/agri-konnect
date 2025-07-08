import React from "react";
import "./Dashboard.css";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Header from "../../components/layout/Header/Header";

const Dashboard = () => {
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
                                <div className="card-value">1,248</div>
                                <div className="card-footer">
                                    <i className="fas fa-arrow-up"></i> 12.5% from last month
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title">Total Products</div>
                                    <div className="card-icon products">
                                        <i className="fas fa-box"></i>
                                    </div>
                                </div>
                                <div className="card-value">568</div>
                                <div className="card-footer">
                                    <i className="fas fa-arrow-up"></i> 5.3% from last month
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title">New Orders</div>
                                    <div className="card-icon orders">
                                        <i className="fas fa-shopping-cart"></i>
                                    </div>
                                </div>
                                <div className="card-value">324</div>
                                <div className="card-footer danger">
                                    <i className="fas fa-arrow-down"></i> 2.1% from last month
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title">Total Revenue</div>
                                    <div className="card-icon revenue">
                                        <i className="fas fa-dollar-sign"></i>
                                    </div>
                                </div>
                                <div className="card-value">$24,780</div>
                                <div className="card-footer">
                                    <i className="fas fa-arrow-up"></i> 8.7% from last month
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="charts">
                            <div className="chart-card">
                                <div className="chart-header">
                                    <div className="chart-title">Revenue Overview</div>
                                    <div className="chart-actions">
                                        <button>Week</button>
                                        <button className="active">Month</button>
                                        <button>Year</button>
                                    </div>
                                </div>
                                <div className="chart-placeholder">
                                    [Revenue Chart Placeholder]
                                </div>
                            </div>

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
                                    <button>View All</button>
                                </div>
                            </div>
                            <ul className="activity-list">
                                <li className="activity-item">
                                    <div className="activity-icon">
                                        <i className="fas fa-user-plus"></i>
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-message">New user registered - John Doe</div>
                                        <div className="activity-time">10 minutes ago</div>
                                    </div>
                                </li>
                                <li className="activity-item">
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
                                </li>
                            </ul>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default Dashboard;