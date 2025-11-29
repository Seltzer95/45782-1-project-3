import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaUserPlus } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/apiService.ts';
import { useAppDispatch } from '../../store/hooks.ts';
import { login } from '../../store/authSlice.ts';
import { User } from '../../models/VacationModel.ts';

interface RegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export const Register: React.FC = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const password = watch('password', '');

    const onSubmit = async (data: RegisterForm) => {
        setError(null);
        setIsLoading(true);
        const registrationData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
        };

        try {
            const response = await api.post('/auth/register', registrationData);
            
            const token: string = response.data.token;
            const user: User = response.data.user; 
            dispatch(login({ token, user }));
            navigate('/vacations');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Registration error:', err);
            const errorMessage = err.response?.data?.message || 'Registration failed. Check if the email is already in use, and ensure the backend is running.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg border-0 rounded-3">
                        <Card.Body className="p-4 p-md-5">
                            <h2 className="text-center mb-4 fw-bold text-success">Create Account</h2>
                            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Form.Group as={Col} md={6} className="mb-3" controlId="firstName">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter first name"
                                            {...register('firstName', { 
                                                required: 'First name is required' 
                                            })}
                                            isInvalid={!!errors.firstName}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.firstName?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} md={6} className="mb-3" controlId="lastName">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter last name"
                                            {...register('lastName', { 
                                                required: 'Last name is required' 
                                            })}
                                            isInvalid={!!errors.lastName}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.lastName?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

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

                                <Row>
                                    <Form.Group as={Col} md={6} className="mb-3" controlId="password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            {...register('password', { 
                                                required: 'Password is required',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Password must be at least 6 characters'
                                                }
                                            })}
                                            isInvalid={!!errors.password}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} md={6} className="mb-4" controlId="confirmPassword">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm Password"
                                            {...register('confirmPassword', { 
                                                required: 'Confirm password is required',
                                                validate: value => 
                                                    value === password || 'Passwords do not match'
                                            })}
                                            isInvalid={!!errors.confirmPassword}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.confirmPassword?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                <div className="d-grid gap-2">
                                    <Button 
                                        variant="success" 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="fw-bold d-flex align-items-center justify-content-center gap-2"
                                    >
                                        {isLoading ? 'Registering...' : 'Register'} <FaUserPlus />
                                    </Button>
                                </div>
                            </Form>
                            <p className="text-center mt-3 mb-0">
                                Already have an account? <Link to="/login" className="fw-bold">Sign in here</Link>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};