import React, {useContext} from 'react';
import { Paper, Typography } from '@mui/material';
import DashboardCard from '../../components/dashboardBox/DashboardCard';
import SalesTrendChart from '../../components/charts/SalesTrandChart';
import OrdersTrendsChart from '../../components/charts/OrdersTrandChart';
import RecentOrders from '../../components/orders/RecentOrders';
import { MyContext } from '../../App';

const StrategicDashboard = () => {
  const context = useContext(MyContext);

  return (
    <div>

     {/* Key Metrics */}
      <div className="metrics-container">
        <DashboardCard
          metric= {`${context?.buyerStats?.ordersPlaced}`}
          label="Order Placed"
          trend="up"
          trendValue="(This Month)"
        />
        <DashboardCard
          metric={`${context?.buyerStats?.totalSpent}`}
          label="Total Spent"
          trend="up"
          trendValue="(All Expenditure)"
        />
        <DashboardCard
          metric={`${context?.buyerStats?.wishlistItems}`}
          label="Wishlist Items"
          trend="up"
          trendValue="(All Items in List)"
        />
        <DashboardCard
          metric={`${context?.buyerStats?.reviewsGiven}`}
          label="Review Given"
          trend="up"
          trendValue="(All Products Commented)"
        />

        {
			context?.isSeller &&
			<>
				<DashboardCard
					metric={`${context?.sellerStats?.totalOrders}`}
					label="Orders Reveived"
					trend="up"
					trendValue="(Total Orders)"
				/>
				<DashboardCard
					metric={`${context?.sellerStats?.totalRevenue}`}
					label="Total Revenue"
					trend="up"
					trendValue="(Revenue Generated)"
				/>
				<DashboardCard
					metric={`${context?.sellerStats?.pendingOrders}`}
					label="Pending Orders"
					trend="up"
					trendValue="(Orders Requested)"
				/>
				<DashboardCard
					metric={`${context?.sellerStats?.averageRating}`}
					label="Average Rating"
					trend="up"
					trendValue="(Buyers Ratings)"
				/>
			</>
        }

      </div>

      {/* Charts */}
      <div className="charts-container">
		{
			context?.isSeller  &&
			<Paper className="chart-container">
				<SalesTrendChart />
		  	</Paper>
		}

        <Paper className="chart-container">
        	<OrdersTrendsChart />
        </Paper>
      </div>

      {/* Recent Orders Placed */}
      <div className="orders-container">
		{
			context?.placedOrders.length !== 0 &&
			<RecentOrders orders={context?.placedOrders} title="Recent Orders Placed" />

		}
      </div>

      {/* Recent Orders Received */}
		<div className="orders-container">
			{
				context?.isSeller &&
				<RecentOrders orders={context?.receivedOrders} title="Recent Orders Placed" />
			}
		</div>

    </div>
  );
};

export default StrategicDashboard;