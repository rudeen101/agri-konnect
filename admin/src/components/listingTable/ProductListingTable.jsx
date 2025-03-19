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
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/apiCalls';
import { Link } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ListingTable = ({thData, tableData, searchPlaceholder, filterData, headerText, filterHeader, onDelete}) => {
  
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [orderBy, setOrderBy] = useState('id'); // Default sort by Order ID
    const [order, setOrder] = useState('asc'); // Default sort order
    const [orders, setOrders] = useState([]); // Default sort order

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
        console.log("testing..", event.target.value)
        setStatusFilter(event.target.value);
        setPage(0); // Reset to the first page when filtering
    };


    // Filter orders based on search query and status filter
    const filteredTableData = tableData?.filter((data) => {

        const matchesSearch = data?.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||  data?.catName === statusFilter;
        
        return matchesSearch && matchesStatus;
    });


    return (
        <div className="recent-orders">
            <h4>{headerText}</h4>

            {/* Search and Filter Controls */}
                <div className="search-filter-container">
                <TextField
                    placeholder={searchPlaceholder}
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
                    <InputLabel>{filterHeader}</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        label="Status"
                    >
                        <MenuItem value="all">All</MenuItem>

                        {
                            filterData?.length !== 0 &&
                            filterData?.map((category, index) => (
                                <MenuItem key={index} value={category?.name}>{category?.name}</MenuItem>

                            ))
                        }
                    
                    </Select>
                </FormControl>
            </div>

            {/* Orders Table */}
            <TableContainer component={Paper}  sx={{ overflowX: "auto", maxWidth: "100%" }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        {
                            thData?.length !== 0 && thData?.map((headerText, index) => (
                                <TableCell key={index}>
                                    {headerText}
                                </TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                {filteredTableData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data, index) => (
                    <TableRow key={index}>
                        {/* <TableCell>{data?._id}</TableCell> */}
                        <TableCell>
                            <div className='d-flex '>
                                <div className='card' style={{overflow: "hidden", width: "50px", height: "50px", marginRight: "5px"}}> <img style={{width: "100%", height: "100%", objectFit:"cover"}} src={data?.images[0]} alt={data?.name} /> </div>
                                <div>{data?.name}</div>
                            </div>
                            
                        </TableCell>
                        <TableCell>{data?.catName}</TableCell>
                        <TableCell>{data?.brand}</TableCell>
                        <TableCell>${data?.price}</TableCell>
                        <TableCell>{data?.countInStock}</TableCell>
                        <TableCell>{data?.salesCount}</TableCell>
                        <TableCell>
                            <div className="actions d-flex align-items-center">
                                <Link to={`/product/details/${data?._id}`}>
                                    <Button className="secondary" color="secondary"><FaEye /></Button>
                                </Link> 
                                <Link to={`/product/edit/${data?._id}`}>
                                    <Button className="success" color="sucess"><FaPencilAlt /></Button>
                                </Link>
                                <Button className="error" color="error" onClick={() => onDelete(data?._id)}><MdDelete /></Button>
                            </div>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTableData?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default ListingTable;