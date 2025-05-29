import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

const CustomerForm = () => {
  const { id } = useParams();       // Get ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);

  // Fetch existing customer data if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`/api/customers/${id}`)
        .then(res => {
          console.log('Fetched customer data:', res.data);   // Debug log
          setFormData({
            name: res.data.name || '',
            mobile: res.data.mobile || '',
            email: res.data.email || '',
            address: res.data.address || '',
            city: res.data.city || '',
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

  try {
    if (id) {
      // If ID exists, update customer
      console.log('Updating customer with id:', id);
      await axios.put(`/api/customers/${id}`, formData);
      toast.success('Customer updated successfully');
    } else {
      // If no ID, create new customer
      console.log('Creating new customer');
      await axios.post('/api/customers', formData);
      toast.success('Customer added successfully');
    }
    navigate('/customers');  // After success, go back to customer list
  } catch (error) {
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
    <Card>
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

          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </Form.Group>

          

          <Button variant="primary" type="submit">
            {id ? 'Update Customer' : 'Add Customer'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CustomerForm;
