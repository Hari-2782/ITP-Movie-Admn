import React from 'react';
import { Navbar, Nav, Button, Form, FormControl } from 'react-bootstrap';

const TopNavbar = ({ isLoggedIn, onLogin, onLogout, showLoginForm, onToggleLoginForm }) => {
    return (
        <Navbar bg="light" expand="">
            <Navbar.Brand href="#home">Admin Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#link">Link</Nav.Link>
                </Nav>
                {isLoggedIn ? (
                    <Button variant="outline-success" onClick={onLogout}>
                        Logout
                    </Button>
                ) : (
                    <Button variant="outline-primary" onClick={onToggleLoginForm}>
                        Login
                    </Button>
                )}
                {showLoginForm && (
                    <Form inline>
                        <FormControl type="text" placeholder="Username" className="mr-sm-2" />
                        <FormControl type="password" placeholder="Password" className="mr-sm-2" />
                        <Button variant="outline-success" onClick={onLogin}>
                            Login
                        </Button>
                    </Form>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default TopNavbar;
