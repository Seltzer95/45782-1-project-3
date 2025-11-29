import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaSignInAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/apiService.ts';
import { useAppDispatch } from '../../store/hooks.ts';
import { login } from '../../store/authSlice.ts';
import { User } from '../../models/VacationModel.ts';

interface LoginForm {
    email: string;
    password: string;
}

export const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginForm) => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', data);
            
            const token: string = response.data.token;
            const user: User = response.data.user; 
            
            dispatch(login({ token, user }));
            if (user.role === 'admin') {
                navigate('/admin/vacations');
            } else {
                navigate('/vacations');
            }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || 'Failed to log in. Please check your credentials and ensure the backend is running.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };    

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="shadow-lg border-0 rounded-3">
                        <Card.Body className="p-4 p-md-5">
                            <h2 className="text-center mb-4 fw-bold text-primary">Sign In</h2>
                            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        {...register('email', { 
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^\S+@\S+$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        {...register('password', { 
                                            required: 'Password is required' 
                                        })}
                                        isInvalid={!!errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="fw-bold d-flex align-items-center justify-content-center gap-2"
                                    >
                                        {isLoading ? 'Signing In...' : 'Login'} <FaSignInAlt />
                                    </Button>
                                </div>
                            </Form>
                            <p className="text-center mt-3 mb-0">
                                Don't have an account? <Link to="/register" className="fw-bold">Register here</Link>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};