import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

const VisitForm = ({ visitToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    employeeName: '',
    employeeMobile: '',
    serviceDescription: '',
    serviceCharges: '',
    serviceAddress: '',
    visitDate: '',
    nextVisitDate: '',
    visitTime: '',
    paymentStatus: 'Pending',
    installationDate: '',
    visitStatus: 'Pending',
  });

  const [message, setMessage] = useState('');

  // Auto-fill when editing
  useEffect(() => {
    if (visitToEdit) {
      setFormData({ ...visitToEdit });
    }
  }, [visitToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'visitDate') {
      const selectedDate = new Date(value);
      const autoNext = new Date(selectedDate);
      autoNext.setMonth(autoNext.getMonth() + 3);
      const formattedNext = autoNext.toISOString().slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        visitDate: value,
        nextVisitDate: formattedNext,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (visitToEdit) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/visits/${visitToEdit._id}`, formData);
        setMessage('Visit updated successfully!');
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/visits`, formData);
        setMessage('Visit created successfully!');
      }

      setFormData({
        customerName: '',
        employeeName: '',
        employeeMobile: '',
        serviceDescription: '',
        serviceCharges: '',
        serviceAddress: '',
        visitDate: '',
        nextVisitDate: '',
        visitTime: '',
        paymentStatus: 'Pending',
        installationDate: '',
        visitStatus: 'Pending',
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      setMessage('Error submitting visit');
    }
  };

  return (
    <Container className="mt-4 p-4 shadow rounded bg-light">
      <h3 className="mb-4 text-primary">{visitToEdit ? 'Edit Visit' : 'Add Visit'}</h3>

      {message && <Alert variant="info">{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Employee Name</Form.Label>
              <Form.Control
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Employee Mobile</Form.Label>
              <Form.Control
                type="text"
                name="employeeMobile"
                value={formData.employeeMobile}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Service Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="serviceDescription"
                value={formData.serviceDescription}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Service Charges</Form.Label>
              <Form.Control
                type="number"
                name="serviceCharges"
                value={formData.serviceCharges}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Service Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="serviceAddress"
                value={formData.serviceAddress}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Visit Date</Form.Label>
              <Form.Control
                type="date"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Next Visit Date (auto 3 months later)</Form.Label>
              <Form.Control
                type="date"
                name="nextVisitDate"
                value={formData.nextVisitDate}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Installation Date</Form.Label>
              <Form.Control
                type="date"
                name="installationDate"
                value={formData.installationDate}
                onChange={handleChange}
              />
            </Form.Group>

          

            <Form.Group className="mb-3">
              <Form.Label>Payment Status</Form.Label>
              <Form.Select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Paid</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="text-end">
          <Button variant="primary" type="submit">
            {visitToEdit ? 'Update Visit' : 'Add Visit'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default VisitForm;
