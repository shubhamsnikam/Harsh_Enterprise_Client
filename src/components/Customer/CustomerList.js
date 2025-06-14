import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '-';
            return date.toLocaleDateString();
        } catch (error) {
            console.error('Error formatting display date:', dateString, error);
            return '-';
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/customers`);
            setCustomers(res.data);
        } catch (error) {
            console.error('CustomerList: Failed to fetch customers:', error);
            toast.error('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/customers/${id}`);
                toast.success('Customer deleted');
                fetchCustomers();
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
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobile?.includes(searchTerm) ||
        customer.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        placeholder="Search customers by name, mobile, bill no., model, city..."
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
                                <th>Invoice Date</th>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Bill Number</th>
                                <th>Model</th>
                                <th>Price ₹</th>
                                <th>Warranty (From - To)</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((cust, index) => (
                                    <tr key={cust._id}>
                                        <td>{index + 1}</td>
                                        <td>{formatDisplayDate(cust.invoiceDate)}</td>
                                        <td>{cust.name}</td>
                                        <td>{cust.mobile}</td>
                                        <td>{cust.billNumber || '-'}</td>
                                        <td>{cust.modelName || '-'}</td>
                                        <td>{cust.price ? `₹${cust.price.toFixed(2)}` : '-'}</td>
                                        <td>
                                            {formatDisplayDate(cust.warrantyDateFrom)} - {formatDisplayDate(cust.warrantyDateTo)}
                                        </td>
                                        <td>{cust.address || '-'}</td>
                                        <td>
                                            <Link to={`/edit-customer/${cust._id}`} className="btn btn-primary btn-sm me-2 mb-1">
                                                Edit
                                            </Link>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(cust._id)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-muted">
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
