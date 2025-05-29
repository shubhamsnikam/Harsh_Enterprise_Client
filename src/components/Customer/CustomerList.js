// components/CustomerList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/api/customers');
      setCustomers(res.data);
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`/api/customers/${id}`);
        toast.success('Customer deleted');
        fetchCustomers();
      } catch (error) {
        toast.error('Error deleting customer');
      }
    }
  };

  return (
    <Card className="shadow-sm mt-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Customer List</h4>
          <Link to="/add-customer" className="btn btn-success">
            + Add New Customer
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Table striped bordered hover responsive className="text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((cust, index) => (
                  <tr key={cust._id}>
                    <td>{index + 1}</td>
                    <td>{cust.name}</td>
                    <td>{cust.mobile}</td>
                    <td>{cust.email || '-'}</td>
                    <td>{cust.address || '-'}</td>
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
                  <td colSpan="6" className="text-muted">
                    No customers found.
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
