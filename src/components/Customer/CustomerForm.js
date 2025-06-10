// components/CustomerForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

const CustomerForm = () => {
    const { id } = useParams(); // Get ID from URL
    const navigate = useNavigate();

    // Helper to format date strings for input type="date"
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            // Ensure date is valid before formatting
            if (isNaN(date.getTime())) {
                console.warn('Invalid date string received:', dateString);
                return '';
            }
            return date.toISOString().split('T')[0]; // Gets YYYY-MM-DD
        } catch (error) {
            console.error('Error formatting date:', dateString, error);
            return '';
        }
    };

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        // email: '', // Removed
        address: '',
        city: '', // Added city
        billNumber: '', // Added billNumber
        warrantyDateFrom: '', // Added warrantyDateFrom
        warrantyDateTo: '', // Added warrantyDateTo
        modelName: '', // Added modelName
    });

    const [loading, setLoading] = useState(false);

    // Fetch existing customer data if editing
    useEffect(() => {
        if (id) {
            setLoading(true);
            axios.get(`/api/customers/${id}`)
                .then(res => {
                    console.log('Fetched customer data:', res.data); // Debug log
                    setFormData({
                        name: res.data.name || '',
                        mobile: res.data.mobile || '',
                        // email: res.data.email || '', // Removed
                        address: res.data.address || '',
                        city: res.data.city || '', // Populate city
                        billNumber: res.data.billNumber || '', // Populate billNumber
                        warrantyDateFrom: formatDateForInput(res.data.warrantyDateFrom), // Populate and format warrantyDateFrom
                        warrantyDateTo: formatDateForInput(res.data.warrantyDateTo), // Populate and format warrantyDateTo
                        modelName: res.data.modelName || '', // Populate modelName
                    });
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to load customer data:', err);
                    toast.error('Failed to load customer data');
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation (can be expanded)
        if (!formData.name || !formData.mobile || !formData.address || !formData.city || !formData.billNumber || !formData.modelName) {
            toast.error('Please fill in all required fields: Name, Mobile, Address, City, Bill Number, Model Name.');
            return;
        }

        try {
            if (id) {
                // If ID exists, update customer
                console.log('Updating customer with id:', id, formData);
                await axios.put(`/api/customers/${id}`, formData);
                toast.success('Customer updated successfully');
            } else {
                // If no ID, create new customer
                console.log('Creating new customer', formData);
                await axios.post('/api/customers', formData);
                toast.success('Customer added successfully');
            }
            navigate('/customers'); // After success, go back to customer list
        } catch (error) {
            console.error('Failed to save customer data:', error.response?.data || error.message);
            toast.error('Failed to save customer data');
        }
    };

    if (loading) return (
        <div className="text-center my-5">
            <Spinner animation="border" role="status" />
            <div>Loading customer data...</div>
        </div>
    );

    return (
        <Card className="shadow-sm mt-4"> {/* Added some margin for better spacing */}
            <Card.Body>
                <h4>{id ? 'Edit Customer' : 'Add New Customer'}</h4>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter customer name"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formMobile">
                        <Form.Label>Mobile</Form.Label>
                        <Form.Control
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                            type="tel"
                            placeholder="Enter mobile number"
                        />
                    </Form.Group>

                    {/* Removed Email Field */}
                    {/*
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Enter email (optional)"
                        />
                    </Form.Group>
                    */}

                    <Form.Group className="mb-3" controlId="formAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            placeholder="Enter street address, building, etc."
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formCity">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            placeholder="Enter city"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBillNumber">
                        <Form.Label>Bill Number</Form.Label>
                        <Form.Control
                            name="billNumber"
                            value={formData.billNumber}
                            onChange={handleChange}
                            required
                            placeholder="Enter bill number"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formModelName">
                        <Form.Label>Model Name</Form.Label>
                        <Form.Control
                            name="modelName"
                            value={formData.modelName}
                            onChange={handleChange}
                            required
                            placeholder="Enter model name of the product"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formWarrantyDateFrom">
                        <Form.Label>Warranty Date From</Form.Label>
                        <Form.Control
                            name="warrantyDateFrom"
                            value={formData.warrantyDateFrom}
                            onChange={handleChange}
                            type="date"
                            placeholder="Select start date of warranty"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formWarrantyDateTo">
                        <Form.Label>Warranty Date To</Form.Label>
                        <Form.Control
                            name="warrantyDateTo"
                            value={formData.warrantyDateTo}
                            onChange={handleChange}
                            type="date"
                            placeholder="Select end date of warranty"
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        {id ? 'Update Customer' : 'Add Customer'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/customers')} className="ms-2">
                        Cancel
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CustomerForm;