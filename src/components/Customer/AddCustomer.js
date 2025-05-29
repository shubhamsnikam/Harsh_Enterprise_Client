import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

const AddCustomer = ({ onCustomerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/customers', formData);
      toast.success('Customer added successfully!');
      setFormData({ name: '', mobile: '', email: '', address: '' });
      onCustomerAdded?.();
    } catch (err) {
      console.error('Error adding customer:', err);
      toast.error('Failed to add customer.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="p-4 shadow">
            <h4 className="mb-3">Add Customer</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter customer name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formMobile">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="text"
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email (optional)"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  placeholder="Enter address (optional)"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="submit" variant="success" className="w-100">
                Add Customer
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddCustomer;
