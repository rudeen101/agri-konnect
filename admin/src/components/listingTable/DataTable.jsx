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
  InputAdornment,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./table.css"


const DataTable = ({thData, tableData, searchPlaceholder, filterData, action, isEditable, headerText, filterHeader, onDelete}) => {
  
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

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

    // Filter orders based on search query and status filter
    const filteredTableData = tableData?.filter((data) => {
        let matchesSearch;
        if(data.title) {
            matchesSearch = data?.title.toLowerCase().includes(searchQuery.toLowerCase());       
        } else {
            matchesSearch = data?.name.toLowerCase().includes(searchQuery.toLowerCase());       

        }

        return matchesSearch
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

            </div>

            {/* Orders Table */}
            <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {
                            thData?.length !== 0 && thData?.map((headerText, index) => (
                                <TableCell key={index}>
                                    {headerText}
                                </TableCell>
                            ))
                        }

                        {   action &&
                            <TableCell key={thData?.length+1}>
                                Action
                            </TableCell>
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                {filteredTableData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data, index) => (
                    <TableRow key={index}>
                        { 
                            data?.imageUrl &&
                            <TableCell>
                                <div className='d-flex '>
                                    <div className='card' style={{overflow: "hidden", width: "50px", height: "50px", marginRight: "5px"}}> 
                                        <img style={{width: "100%", height: "100%", objectFit:"cover"}} src={data?.imageUrl} alt={data?.title} /> 
                                    </div>
                                </div>
                            </TableCell>
                        }
                        { 
                            data?.images &&
                            <TableCell>
                                <div className='d-flex '>
                                    <div className='card' style={{overflow: "hidden", width: "50px", height: "50px", marginRight: "5px"}}> 
                                        <img style={{width: "100%", height: "100%", objectFit:"cover"}} src={data?.images[0]} alt={data?.name} /> 
                                    </div>
                                </div>
                            </TableCell>
                        }
                   
                        <TableCell><span style={{textTransform: "capitalize"}}>{`${data?.title ? data?.title : data?.name}`}</span></TableCell>
                            {
                                data?.subtitle &&
                                <TableCell><span style={{textTransform: "capitalize"}}>{data?.subtitle}</span></TableCell>
                            }

                            {
                                data?.category?.name &&
                                <TableCell><span style={{textTransform: "capitalize"}}>{data?.category?.name}</span></TableCell>
                            }
                            {
                                data?.description &&
                                <TableCell><span style={{textTransform: "capitalize"}}>{ data?.description}</span></TableCell>
                            }
                        <TableCell>
                            <div className="actions d-flex align-items-center">
                                {
                                    isEditable &&
                                    <Link to={`/banner/edit/${data?._id}`}>
                                        <Button className="success" color="success"><FaPencilAlt /></Button>
                                    </Link>
                                }

                                <div className="actions d-flex align-items-center">
                                    <Button className="error" color="error" onClick={() => onDelete(data?._id)}><MdDelete /></Button>
                                </div>
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

export default DataTable;