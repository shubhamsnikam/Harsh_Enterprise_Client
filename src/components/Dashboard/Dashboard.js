import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Form } from 'react-bootstrap';

const Dashboard = () => {
  const [visits, setVisits] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Fetch visits by date
    fetch(`/api/visits/date/${date}`)
      .then(res => res.json())
      .then(data => setVisits(data))
      .catch(err => console.error('Error fetching visits:', err));

    // Fetch today's count
    fetch('/api/visits/today/count')
      .then(res => res.json())
      .then(data => setTodayCount(data.count))
      .catch(err => console.error('Error fetching today visit count:', err));

    // Fetch upcoming count
    fetch('/api/visits/upcoming/count')
      .then(res => res.json())
      .then(data => setUpcomingCount(data.count))
      .catch(err => console.error('Error fetching upcoming visit count:', err));

    // Fetch revenue
    fetch('/api/visits/revenue/total')
      .then(res => res.json())
      .then(data => setTotalRevenue(data.totalRevenue))
      .catch(err => console.error('Error fetching revenue:', err));
  }, [date]);

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4 text-center text-primary">Dashboard </h2>

      {/* Summary Cards */}
      <Row className="mb-4 g-4">
        <Col md={4}>
          <Card className="shadow border-start border-4 border-success">
            <Card.Body>
              <Card.Title>Today's Visits</Card.Title>
              <h3 className="text-success">{todayCount}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow border-start border-4 border-warning">
            <Card.Body>
              <Card.Title>Upcoming Visits</Card.Title>
              <h3 className="text-warning">{upcomingCount}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow border-start border-4 border-info">
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              <h3 className="text-info">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Date Filter */}
      <Row className="mb-4">
        <Col md={4} className="mx-auto">
          <Form.Group controlId="dateSelect">
            <Form.Label>Select Date to View Visits</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Visit Table */}
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              Visits on {new Date(date).toLocaleDateString()}
            </Card.Header>
            <Card.Body className="p-0">
              {visits.length > 0 ? (
                <Table striped bordered hover responsive className="mb-0 text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Customer</th>
                      <th>Next Visit</th>
                      <th>Service Charges</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map(visit => (
                      <tr key={visit._id}>
                        <td>{visit.customerName}</td>
                        <td>
                          {new Date(visit.nextVisitDate).toLocaleDateString()} {visit.visitTime || ''}
                        </td>
                        <td>₹{parseFloat(visit.serviceCharges).toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`badge ${visit.paymentStatus === 'Paid' ? 'bg-success' : 'bg-secondary'}`}>
                            {visit.paymentStatus}
                          </span>
                        </td>
                      </tr>

                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="p-3 text-muted text-center">No visits scheduled for this date.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;