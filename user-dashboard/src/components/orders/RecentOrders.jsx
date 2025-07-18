import React, { useContext, useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  MenuItem,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  TableSortLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const RecentOrders = ({orders, title}) => {
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderBy, setOrderBy] = useState('id'); // Default sort by Order ID
  const [order, setOrder] = useState('asc'); // Default sort order

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to the first page when searching
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0); // Reset to the first page when filtering
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';

    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filter orders based on search query and status filter
  const filteredOrders = orders?.filter((order) => {
    const matchesSearch = order?.orderedBy?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort orders
  const sortedOrders = filteredOrders?.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  return (
    <div className="recent-orders">
      	<h4>{title}</h4>

		{/* Search and Filter Controls */}
			<div className="search-filter-container">
			<TextField
				placeholder="Search by vendor"
				variant="outlined"
				size="small"
				value={searchQuery}
				onChange={handleSearchChange}
				InputProps={{
				startAdornment: (
					<InputAdornment position="start" >
						<SearchIcon />
					</InputAdornment>
				),
				}}
			/>

			<FormControl variant="outlined" size="small" style={{ minWidth: '120px' }}>
				<InputLabel>Status</InputLabel>
				<Select
					value={statusFilter}
					onChange={handleStatusFilterChange}
					label="Status"
				>
					<MenuItem value="all">All</MenuItem>
					<MenuItem value="pending">Pending</MenuItem>
					<MenuItem value="confirmed">Confirmed</MenuItem>
					<MenuItem value="processing">Processing</MenuItem>  
					<MenuItem value="delivered">Delivered</MenuItem>  
					<MenuItem value="received">Received</MenuItem>  
					<MenuItem value="completed">Completed</MenuItem>  
				</Select>
			</FormControl>
		</div>

      {/* Orders Table */}
      <TableContainer component={Paper}>
		<Table>
			<TableHead>
			<TableRow>
				<TableCell>
					<TableSortLabel
						active={orderBy === 'mainOrder'}
						direction={orderBy === 'mainOrder' ? order : 'asc'}
						onClick={() => handleSort('mainOrder')}
					>
						Order ID
					</TableSortLabel>
				</TableCell>
				<TableCell>
					<TableSortLabel
						active={orderBy === 'customer'}
						direction={orderBy === 'customer' ? order : 'asc'}
						onClick={() => handleSort('customer')}
					>
						Vendor
					</TableSortLabel>
				</TableCell>
				<TableCell>
					<TableSortLabel
						active={orderBy === 'subTotal'}
						direction={orderBy === 'subTotal' ? order : 'asc'}
						onClick={() => handleSort('subTotal')}
					>
						Amount ($)
					</TableSortLabel>
				</TableCell>
				<TableCell>
					<TableSortLabel
						active={orderBy === 'status'}
						direction={orderBy === 'status' ? order : 'asc'}
						onClick={() => handleSort('status')}
					>
						Status
					</TableSortLabel>
				</TableCell>
				</TableRow>
				</TableHead>
			<TableBody>
			{sortedOrders?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
				.map((order, index) => (
				<TableRow key={order?.index}>
					<TableCell>{order?.orderNumber}</TableCell>
					<TableCell>{order?.orderedBy.name}</TableCell>
					<TableCell>{order?.subTotal}</TableCell>
					<TableCell>{order?.status}</TableCell>
				</TableRow>
				))}
			</TableBody>
		</Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrders?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default RecentOrders;