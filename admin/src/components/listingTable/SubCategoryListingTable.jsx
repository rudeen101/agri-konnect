import React, { useState  } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { TiDelete } from "react-icons/ti";


const SubCategoryListingTable = ({thData, tableData, searchPlaceholder, filterData, headerText, filterHeader, onDelete}) => {
  
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

            </div>

            {/* sub category Table */}
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
                {
                    tableData?.length !== 0 && tableData?.map((category, index) => {
                        
                        if (category?.children?.length !== 0) {

                        }
                    })

                }                    
                {filteredTableData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((category, index) => {
                        if (category?.children?.length !== 0) {
                            return (
                                <TableRow key={index}>
                                    <TableCell>{category?._id}</TableCell>
                                    <TableCell>
                                        <div className='d-flex '>
                                            <div className='card' style={{overflow: "hidden", width: "50px", height: "50px", marginRight: "5px"}}> 
                                                <img style={{width: "100%", height: "100%", objectFit:"cover"}} src={category?.images[0]} alt={category?.name} /> 
                                            </div>
                                            <div>{category?.name}</div>
                                        </div>
                                        
                                    </TableCell>
                                    <TableCell><span style={{textTransform: "capitalize"}}>{category?.isFeatured?.toString()}</span></TableCell>
                                    <TableCell className='d-flex'>
                                        {
                                            category?.children?.length !== 0 && category?.children?.map((subCate, index) => {
                                                return(
                                                    <div className="subCatContainer">
                                                        <div className="subCategory card" key={index} style={{overflow: "hidden", width: "70px", height: "70px", marginRight: "5px"}}>
                                                            <LazyLoadImage
                                                                alt={"image"}
                                                                effect="blur"
                                                                className="img"
                                                                src={subCate?.images[0]}
                                                                style={{width: "100%", height: "100%", objectFit:"cover"}}
                                                            />
                                                            
                                                            <TiDelete className="deleteIcon cursor" color="error" onClick={() => onDelete(subCate._id)}/>

                                                        </div>
                                                        <p style={{textAlign: "center", fontSize:"13px"}}>{subCate.name}</p>
                                                    </div>
                                                )
                                            }) 
                                        }
                                    </TableCell>
                                  
                                </TableRow>
                            )
                        }
                  
                    })}
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

export default SubCategoryListingTable;