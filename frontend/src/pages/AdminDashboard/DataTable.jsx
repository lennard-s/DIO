import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import {
    Box, Checkbox, IconButton, Table, TableBody,
    TableCell, TableContainer, TableHead,
    TablePagination, TableRow, TableSortLabel,
    Toolbar, Tooltip, Typography,
    TextField, Paper
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SkeletonRow from './SkeletonRow';
import DataTableRow from './DataTableRow';


function descendingComparator(a, b, orderBy) {
    if (orderBy === 'LastUpdated') {
        const dateA = new Date(a[orderBy]);
        const dateB = new Date(b[orderBy]);
        return dateB - dateA;
    }
    if (orderBy === 'Status') {
        // Define a custom order for statuses
        const statusOrder = ['Active', 'CarryoverActive', 'Exempt', 'General', 'Alumni'];
        const statusA = statusOrder.indexOf(a[orderBy]) !== -1 ? statusOrder.indexOf(a[orderBy]) : statusOrder.length;
        const statusB = statusOrder.indexOf(b[orderBy]) !== -1 ? statusOrder.indexOf(b[orderBy]) : statusOrder.length;
        return statusA - statusB;
    }
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
    // {
    //     id: 'MemberID',
    //     numeric: true,
    //     disablePadding: true,
    //     label: 'MemberID',
    // },
    {
        id: 'FullName',
        numeric: false,
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'Status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'AttendanceRecord',
        numeric: true,
        disablePadding: false,
        label: 'Attendance Record',
    },
    {
        id: 'LastUpdated',
        numeric: true,
        disablePadding: false,
        label: 'Last Updated',
    },
    {
        id: 'ViewDetails',
        numeric: true,
        disablePadding: false,
        label: '',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => onRequestSort(event, property);

    return (
        <TableHead>
            <TableRow>
                {/* <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all members' }}
                    />
                </TableCell> */}
                {headCells.map((headCell) => (
                    <TableCell
                        sx={{ fontWeight: 'bold' }}
                        key={headCell.id}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected, handleSearchChange } = props;

    return (
        <Toolbar
            sx={[
                { pl: { sm: 2 }, pr: { xs: 1, sm: 1 } },
                numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%', fontWeight: 'bold' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Member Data
                </Typography>
            )}
            <TextField
                label="Search"
                variant="outlined"
                size="small"
                onChange={handleSearchChange}
                sx={{ marginLeft: 'auto', m: 2 }}
            />
            {/* {numSelected > 0 ? (
                <Tooltip title="Generate Report on Selected">
                    <IconButton>
                        <EditNoteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter Table">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )} */}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = { numSelected: PropTypes.number.isRequired };


/**
 * DataTable.jsx
 * 
 * This React component renders a dynamic and interactive table for displaying and managing member data.
 * It supports sorting, filtering, pagination, and selection of rows, providing administrators with
 * a comprehensive view of member information.
 * 
 * Key Features:
 * - Displays member data with sortable columns and customizable headers.
 * - Supports search functionality to filter rows based on user input.
 * - Provides pagination for navigating large datasets.
 * - Allows row selection for bulk actions or detailed operations.
 * - Dynamically updates rows when member data changes.
 * - Displays loading skeletons while data is being fetched.
 * 
 * Props:
 * - orgID: String representing the organization ID.
 * - memberData: Array of objects containing member information.
 * - isLoading: Boolean indicating whether the data is still loading.
 * - selectedSemester: Object representing the currently selected semester.
 * - activeSemester: Object representing the active semester.
 * - onMemberUpdate: Callback function triggered when member data is updated.
 * 
 * Dependencies:
 * - React, Material-UI components, and Material-UI icons.
 * - Custom components: SkeletonRow, DataTableRow.
 * 
 * Functions:
 * - descendingComparator: Custom comparator for sorting rows based on column data.
 * - getComparator: Returns a comparator function based on the sort order and column.
 * - handleRequestSort: Handles sorting when a column header is clicked.
 * - handleSearchChange: Updates the search query for filtering rows.
 * - handleSelectAllClick: Selects or deselects all rows in the table.
 * - handleClick: Toggles the selection of a specific row.
 * - handleChangePage: Updates the current page in the pagination.
 * - handleChangeRowsPerPage: Updates the number of rows displayed per page.
 * 
 * Hooks:
 * - React.useState: Manages state for sorting, pagination, search query, and selected rows.
 * - React.useEffect: Updates rows when member data changes.
 * - React.useMemo: Optimizes visible rows calculation for performance.
 * 
 * @component
 */
export default function DataTable({ orgID, memberData, isLoading, selectedSemester, activeSemester, onMemberUpdate }) {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('LastUpdated');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [rows, setRows] = React.useState([]);

    // Update rows when memberData changes
    React.useEffect(() => {
        setRows(memberData);
    }, [memberData]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0); // Reset to first page on search
    };

    const filteredRows = rows.filter((row) =>
        (row.FullName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (row.Status?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.MemberID);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, MemberID) => {
        const selectedIndex = selected.indexOf(MemberID);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, MemberID);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            [...filteredRows]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, filteredRows],
    );

    return (
        <Paper sx={{ width: '100%' }}>
            <EnhancedTableToolbar numSelected={selected.length} handleSearchChange={handleSearchChange} />
            <TableContainer sx={{ maxHeight: '450px' }}>
                <Table stickyHeader sx={{ minWidth: 800, overflowY: 'auto' }} aria-labelledby="member-data-table">
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={filteredRows.length}
                    />
                    <TableBody>
                        {isLoading ? (
                            Array.from(new Array(5)).map((_, index) => (
                                <SkeletonRow key={`skeleton-${index}`} index={index} />
                            ))
                        ) : visibleRows.length > 0 ? (
                            visibleRows.map((row, index) => {
                                const isItemSelected = selected.includes(row.MemberID);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <DataTableRow
                                        key={row.MemberID}
                                        row={row}
                                        isItemSelected={isItemSelected}
                                        labelId={labelId}
                                        handleClick={handleClick}
                                        orgID={orgID}
                                        selectedSemester={selectedSemester}
                                        activeSemester={activeSemester}
                                        onMemberUpdate={onMemberUpdate}
                                    />
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="subtitle1">No records found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
