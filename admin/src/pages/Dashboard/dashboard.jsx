import React, {useContext} from 'react';
import { Paper, Typography } from '@mui/material';
import DashboardCard from '../../components/dashboardBox/DashboardCard';
import SalesTrendChart from '../../components/charts/SalesTrandChart';
import RevenueBreakdownChart from '../../components/charts/RevenueBreakdownChart';
import RecentOrders from '../../components/orders/RecentOrders';
import { MyContext } from '../../App';

const StrategicDashboard = () => {
  const context = useContext(MyContext);

  return (
    <div>
      {/* Key Metrics */}
      <div className="metrics-container">
        <DashboardCard
          metric= {`$${context?.dashboardStats?.totalRevenue}`}
          label="Total Revenue"
          trend="up"
          trendValue="(last 30 days)"
        />
        <DashboardCard
          metric={`${context?.dashboardStats?.newCustomers}`}
          label="New Customers"
          trend="up"
          trendValue="(last 30 days)"
        />
        <DashboardCard
          metric={`${context?.dashboardStats?.customerRetention}`}
          label="Customer Retention"
          trend="up"
          trendValue="(last 30 days)"
        />
        <DashboardCard
          metric={`${context?.dashboardStats?.newProducts}`}
          label="New Prpducts"
          trend="up"
          trendValue="(last 30 days)"
        />
      </div>

      {/* Charts */}
      <div className="charts-container">
        <Paper className="chart-container">
          <SalesTrendChart />
        </Paper>
        <Paper className="chart-container">
          <RevenueBreakdownChart />
        </Paper>
      </div>

      {/* Recent Orders */}
      <div className="orders-container">
        <RecentOrders />
      </div>
    </div>
  );
};

export default StrategicDashboard;