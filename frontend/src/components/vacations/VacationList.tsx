import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchVacations } from '../../store/vacationSlice';
import { Card, Button, Row, Col, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaHeart, FaRegHeart } from 'react-icons/fa';
import api from '../../services/apiService';
import { toast } from 'react-toastify';
import { appConfig } from '../../services/config';

export const VacationList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items: vacations, loading } = useAppSelector(state => state.vacations);
    const { user } = useAppSelector(state => state.auth);
    const isAdmin = user?.role === 'admin';
    const navigate = useNavigate();

    const [showFollowingOnly, setShowFollowingOnly] = useState(false);
    const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);
    const [showActiveOnly, setShowActiveOnly] = useState(false);

    useEffect(() => {
        dispatch(fetchVacations());
    }, [dispatch]);

    const handleDelete = async (uuid: string) => {
        if (window.confirm('Delete this vacation?')) {
            await api.delete(`/vacations/${uuid}`);
            toast.success('Deleted successfully');
        }
    };

    const handleFollow = async (uuid: string) => {
        await api.post(`/follows/${uuid}`);
        dispatch(fetchVacations());
    };

    const filteredVacations = vacations.filter(v => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(v.startDate);
        const endDate = new Date(v.endDate);

        if (!isAdmin) {
            if (showFollowingOnly && !v.isFollowing) return false;
            if (showUpcomingOnly && startDate <= today) return false;
            if (showActiveOnly && (today < startDate || today > endDate)) return false;
        }

        return true;
    });

    if (loading && vacations.length === 0) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <Container className="mt-4 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary fw-bold">Current Vacations</h2>
                {isAdmin && (
                    <Button variant="success" className="shadow-sm" onClick={() => navigate('/vacations/add')}>+ Add Vacation</Button>
                )}
            </div>

            {/* Filter checkboxes for regular users only */}
            {!isAdmin && (
                <div className="mb-4 p-3 bg-light rounded shadow-sm">
                    <h6 className="mb-3 fw-bold">Filters:</h6>
                    <div className="d-flex flex-wrap gap-3">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="filterFollowing"
                                checked={showFollowingOnly}
                                onChange={(e) => setShowFollowingOnly(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="filterFollowing">
                                Show only following vacations
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="filterUpcoming"
                                checked={showUpcomingOnly}
                                onChange={(e) => setShowUpcomingOnly(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="filterUpcoming">
                                Only upcoming vacations
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="filterActive"
                                checked={showActiveOnly}
                                onChange={(e) => setShowActiveOnly(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="filterActive">
                                Only vacations active now
                            </label>
                        </div>
                    </div>
                </div>
            )}

            <Row xs={1} md={2} lg={3} className="g-4">
                {filteredVacations.map(v => (
                    <Col key={v.uuid}>
                        <Card className="h-100 shadow-sm border-0 vacation-card overflow-hidden">
                            <div className="position-relative">
                                <Card.Img
                                    variant="top"
                                    src={appConfig.getImageUrl(v.pictureUrl)}
                                    className="vacation-img"
                                />
                                {!isAdmin && (
                                    <Button
                                        variant="light"
                                        className="position-absolute top-0 end-0 m-2 rounded-circle p-2 shadow-sm follow-btn"
                                        onClick={() => handleFollow(v.uuid)}
                                    >
                                        {v.isFollowing ? <FaHeart color="#e63946" /> : <FaRegHeart />}
                                    </Button>
                                )}
                                {/* Display followers count (only for regular users, not admins) */}
                                {!isAdmin && v.followersCount !== undefined && v.followersCount > 0 && (
                                    <div className="position-absolute bottom-0 start-0 m-2 bg-dark bg-opacity-75 text-white px-2 py-1 rounded-pill small">
                                        <FaHeart color="#e63946" size={12} /> {v.followersCount} {v.followersCount === 1 ? 'follower' : 'followers'}
                                    </div>
                                )}
                            </div>
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="fw-bold">{v.destination}</Card.Title>
                                <div className="bg-light p-2 rounded mb-2 text-center text-muted small">
                                    📅 {new Date(v.startDate).toLocaleDateString()} ➜ {new Date(v.endDate).toLocaleDateString()}
                                </div>
                                <Card.Text className="flex-grow-1 text-secondary description-text">
                                    {v.description}
                                </Card.Text>
                                <div className="text-center my-3">
                                    <span className="badge bg-primary fs-5 px-3 py-2">${v.price.toLocaleString()}</span>
                                </div>
                                
                                {isAdmin && (
                                    <div className="d-flex justify-content-center gap-2 mt-auto pt-3 border-top">
                                        <Button variant="outline-primary" size="sm" onClick={() => navigate(`/vacations/edit/${v.uuid}`)}>
                                            <FaEdit /> Edit
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(v.uuid)}>
                                            <FaTrash /> Delete
                                        </Button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};