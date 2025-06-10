// components/CustomerList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    // Helper to format date for display in table
    const formatDisplayDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '-'; // Check for invalid date
            return date.toLocaleDateString(); // Formats as per locale (e.g., 6/10/2025)
        } catch (error) {
            console.error('Error formatting display date:', dateString, error);
            return '-';
        }
    };


    useEffect(() => {
        console.log('CustomerList: useEffect called to fetch customers.');
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/customers`);
            console.log('CustomerList: API response data:', res.data); // IMPORTANT: Check this log!
            setCustomers(res.data);
        } catch (error) {
            console.error('CustomerList: Failed to fetch customers:', error);
            toast.error('Failed to fetch customers');
        } finally {
            setLoading(false);
            console.log('CustomerList: Loading set to false.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/customers/${id}`);
                toast.success('Customer deleted');
                fetchCustomers(); // Re-fetch customers to update the list
            } catch (error) {
                console.error('CustomerList: Error deleting customer:', error);
                toast.error('Error deleting customer');
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobile.includes(searchTerm) ||
        (customer.billNumber && customer.billNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.modelName && customer.modelName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.address && customer.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.city && customer.city.toLowerCase().includes(searchTerm.toLowerCase())) // Include city in search
    );

    console.log('CustomerList: Customers in state:', customers); // IMPORTANT: Check this log!
    console.log('CustomerList: Filtered customers for rendering:', filteredCustomers); // IMPORTANT: Check this log!


    return (
        <Card className="shadow-sm mt-4">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Customer List</h4>
                    <Link to="/add-customer" className="btn btn-success">
                        + Add New Customer
                    </Link>
                </div>

                {/* Search Bar */}
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="Search customers by name, mobile, bill no., model name, city or address..."
                        aria-label="Search customers"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </InputGroup>

                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <Table striped bordered hover responsive className="text-center align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Bill Number</th>
                                <th>Warranty Date (From-To)</th>
                                <th>Model Name</th>
                                <th>Address</th>
                                {/* <th>City</th>  */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((cust, index) => (
                                    <tr key={cust._id}>
                                        <td>{index + 1}</td>
                                        <td>{cust.name}</td>
                                        <td>{cust.mobile}</td>
                                        <td>{cust.billNumber || '-'}</td>
                                        <td>
                                            {formatDisplayDate(cust.warrantyDateFrom) +
                                            ' - ' +
                                            formatDisplayDate(cust.warrantyDateTo)}
                                        </td>
                                        <td>{cust.modelName || '-'}</td>
                                        <td>{cust.address || '-'}</td>
                                        {/* <td>{cust.city || '-'}</td> Display city */}
                                        <td>
                                            <Link
                                                to={`/edit-customer/${cust._id}`}
                                                className="btn btn-primary btn-sm me-2"
                                            >
                                                Edit
                                            </Link>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(cust._id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    {/* Updated colSpan to match the new number of columns (9 columns now) */}
                                    <td colSpan="9" className="text-muted">
                                        {searchTerm ? 'No customers found matching your search.' : 'No customers found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
};

export default CustomerList;
