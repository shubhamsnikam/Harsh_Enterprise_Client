import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string received:', dateString);
        return '';
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return '';
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    city: '',
    billNumber: '',
    warrantyDateFrom: '',
    warrantyDateTo: '',
    modelName: '',
    price: '',
    invoiceDate: '', // ✅ New Field
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/customers/${id}`)
        .then(res => {
          setFormData({
            name: res.data.name || '',
            mobile: res.data.mobile || '',
            address: res.data.address || '',
            city: res.data.city || '',
            billNumber: res.data.billNumber || '',
            warrantyDateFrom: formatDateForInput(res.data.warrantyDateFrom),
            warrantyDateTo: formatDateForInput(res.data.warrantyDateTo),
            modelName: res.data.modelName || '',
            price: res.data.price || '',
            invoiceDate: formatDateForInput(res.data.invoiceDate), // ✅ Populate invoice date
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

    if (!formData.name || !formData.mobile || !formData.address || !formData.city || !formData.billNumber || !formData.modelName || !formData.price) {
      toast.error('Please fill in all required fields including Price.');
      return;
    }

    try {
      if (id) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/customers/${id}`, formData);
        toast.success('Customer updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/customers`, formData);
        toast.success('Customer added successfully');
      }
      navigate('/customers');
    } catch (error) {
      console.error('Failed to save customer data:', error.response?.data || error.message);
      toast.error('Failed to save customer data');
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <div>Loading customer data...</div>
      </div>
    );
  }

  return (
    <Card className="shadow-sm mt-4">
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

          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter street address"
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
              placeholder="Enter product model name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              type="number"
              placeholder="Enter price"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formWarrantyDateFrom">
            <Form.Label>Warranty Date From</Form.Label>
            <Form.Control
              name="warrantyDateFrom"
              value={formData.warrantyDateFrom}
              onChange={handleChange}
              type="date"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formWarrantyDateTo">
            <Form.Label>Warranty Date To</Form.Label>
            <Form.Control
              name="warrantyDateTo"
              value={formData.warrantyDateTo}
              onChange={handleChange}
              type="date"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formInvoiceDate">
            <Form.Label>Invoice Date</Form.Label>
            <Form.Control
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              type="date"
              placeholder="Select invoice date"
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
