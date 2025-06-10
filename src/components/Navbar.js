import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import axios from 'axios';
import { BellFill } from 'react-bootstrap-icons';

const NavigationBar = () => {
  const [todayVisits, setTodayVisits] = useState([]);

  useEffect(() => {
    fetchTodayVisits();
  }, []);

  const fetchTodayVisits = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/visits/today`);
      setTodayVisits(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="/"> Harsh Enterprise </Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link href="/visit-report" className="position-relative">
            <BellFill size={24} color="white" />
            {todayVisits.length > 0 && (
              <Badge
                bg="danger"
                pill
                className="position-absolute top-0 start-100 translate-middle"
                style={{ fontSize: '0.7rem' }}
              >
                {todayVisits.length}
              </Badge>
            )}
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
