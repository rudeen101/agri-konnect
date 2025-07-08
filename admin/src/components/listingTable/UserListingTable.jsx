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
import { MdDelete } from "react-icons/md";
import "./table.css"
import { IoMdCloseCircle } from "react-icons/io";


const UserListingTable = ({thData, tableData, searchPlaceholder, onDeleteUser, onDeleteUserRole}) => {
  
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');

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



    // Filter orders based on search query and status filter
    const filteredTableData = tableData?.filter((data) => {
        let matchesSearch = data?.name.toLowerCase().includes(searchQuery.toLowerCase());       
        return matchesSearch
    });


    return (
        <div className="recent-orders">

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

                    </TableRow>
                </TableHead>
                <TableBody>
                {filteredTableData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data, index) => (
                    <TableRow key={index}>
                   
                        <TableCell>
                            <span>
                                {data?._id}
                            </span>
                        </TableCell>

                        <TableCell>
                            <span>
                                {data?.name}
                            </span>
                        </TableCell>

                        <TableCell>
                            <span>
                                {data?.contact}
                            </span>
                        </TableCell>

                        <TableCell>
                            {
                                data?.roles?.map((role, index) => {
                                    return (
                                        <div className="subCatContainer">
                                            <div className="subCategory card role" key={index}>
                                                <span>{role}</span>
                                                <IoMdCloseCircle className="deleteIcon cursor" color="error" onClick={() => onDeleteUserRole(data?._id, role)}/>

                                            </div>
                                        </div>
                                    )
                                }) 
                            }
                        </TableCell>

                        <TableCell>
                            <div className="actions d-flex align-items-center">
                                <div className="actions d-flex align-items-center">
                                    <Button className="error" color="error" onClick={() => onDeleteUser(data?._id)}><MdDelete /></Button>
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

export default UserListingTable;