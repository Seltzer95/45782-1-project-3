/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Image, Card, Row, Col, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/apiService';
import { appConfig } from '../../services/config';
import { toast } from 'react-toastify';

export const VacationForm: React.FC = () => {
    const { uuid } = useParams();
    const isEditMode = !!uuid;
    const navigate = useNavigate();
    const [preview, setPreview] = useState<string | null>(null);

    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm();
    const imageFile = watch('image');

    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            const file = imageFile[0];
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [imageFile]);

    useEffect(() => {
        if (isEditMode) {
            api.get(`/vacations/${uuid}`).then(res => {
                const v = res.data;
                setValue('destination', v.destination);
                setValue('description', v.description);
                setValue('startDate', v.startDate);
                setValue('endDate', v.endDate);
                setValue('price', v.price);
                setPreview(appConfig.getImageUrl(v.pictureUrl));
            });
        }
    }, [isEditMode, uuid, setValue]);

    const onSubmit = async (data: any) => {
        const formData = new FormData();
        formData.append('destination', data.destination);
        formData.append('description', data.description);
        formData.append('startDate', data.startDate);
        formData.append('endDate', data.endDate);
        formData.append('price', data.price.toString());
        
        if (data.image && data.image.length > 0) {
            formData.append('image', data.image[0]);
        }

        try {
            if (isEditMode) {
                await api.put(`/vacations/${uuid}`, formData);
                toast.success('Updated successfully');
            } else {
                await api.post('/vacations', formData);
                toast.success('Created successfully');
            }
            navigate('/vacations');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    return (
        <Container className="mt-5">
            <Card className="shadow p-4 mx-auto" style={{ maxWidth: '900px' }}>
                <h3 className="mb-4 text-center text-primary fw-bold">{isEditMode ? 'Edit Vacation' : 'Create New Vacation'}</h3>
                
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={7}>
                            <Form.Group className="mb-3">
                                <Form.Label>Destination</Form.Label>
                                <Form.Control {...register('destination', { required: true })} isInvalid={!!errors.destination} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={4} {...register('description', { required: true })} isInvalid={!!errors.description} />
                            </Form.Group>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control type="date" {...register('startDate', { required: true })} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control type="date" {...register('endDate', { required: true })} />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Price ($)</Form.Label>
                                <Form.Control type="number" step="0.01" {...register('price', { required: true, min: 0 })} />
                            </Form.Group>
                        </Col>

                        <Col md={5} className="d-flex flex-column">
                            <Form.Group className="mb-3">
                                <Form.Label>Cover Image</Form.Label>
                                <Form.Control 
                                    type="file" 
                                    accept="image/*" 
                                    {...register('image', { required: !isEditMode })} 
                                    isInvalid={!!errors.image}
                                />
                                <Form.Text className="text-muted">Max size: 5MB</Form.Text>
                            </Form.Group>

                            <div className="border rounded bg-light d-flex align-items-center justify-content-center flex-grow-1 overflow-hidden" style={{ minHeight: '250px' }}>
                                {preview ? (
                                    <Image src={preview} fluid style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div className="text-center text-muted">
                                        <p>Image Preview</p>
                                        <small>Upload an image to see it here</small>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit" className="w-100 mt-4 py-2 fw-bold" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Vacation'}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};