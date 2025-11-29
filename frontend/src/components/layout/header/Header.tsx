import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../store/hooks.ts';
import { logout } from '../../../store/authSlice.ts';
import { FaPlane, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

export const Header: React.FC = () => {
    const { user, isAuthenticated } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm sticky-top mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/vacations" className="fw-bold d-flex align-items-center gap-2">
                    <FaPlane /> Vacation Planner
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {isAuthenticated && (
                            <Nav.Link as={Link} to="/vacations">Vacations</Nav.Link>
                        )}
                        {isAuthenticated && user?.role === 'admin' && (
                            <>
                                <Nav.Link as={Link} to="/vacations/add">Add New</Nav.Link>
                                <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav className="align-items-center gap-3">
                        {!isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Button
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    as={Link as any}
                                    to="/register" 
                                    variant="light" 
                                    size="sm" 
                                    className="fw-bold text-primary"
                                >
                                    Register
                                </Button>
                            </>
                        ) : (
                            <>
                                <span className="text-white d-flex align-items-center gap-2">
                                    <FaUserCircle size={20} />
                                    Hello, {user?.firstName}
                                </span>
                                <Button 
                                    variant="outline-light" 
                                    size="sm" 
                                    onClick={handleLogout}
                                    className="d-flex align-items-center gap-2"
                                >
                                    Logout <FaSignOutAlt />
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};