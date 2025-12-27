import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { positionService } from '../services/positionService';

type Position = {
    id: number;
    title: string;
    companyName: string;
    status: string;
    location: string;
    applicationDeadline: string | null;
};

const Positions: React.FC = () => {
    const navigate = useNavigate();
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await positionService.getAllPositions();
                setPositions(data);
            } catch (err: any) {
                console.error('Error fetching positions:', err);
                let errorMessage = 'Failed to load positions. Please try again.';
                
                if (err.response) {
                    // Handle HTTP errors
                    if (err.response.data?.message) {
                        errorMessage = err.response.data.message;
                    } else if (err.response.data?.error) {
                        errorMessage = err.response.data.error;
                    } else if (err.response.status === 404) {
                        errorMessage = 'Positions endpoint not found. Please check if the backend server is running.';
                    } else if (err.response.status >= 500) {
                        errorMessage = 'Server error. Please try again later.';
                    }
                } else if (err.message) {
                    errorMessage = err.message;
                } else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
                    errorMessage = 'Cannot connect to the server. Please make sure the backend is running on port 3010.';
                }
                
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchPositions();
    }, []);

    const handleViewProcess = (positionId: number) => {
        navigate(`/positions/${positionId}`);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return dateString;
        }
    };

    const getStatusBadgeClass = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower === 'open' || statusLower === 'abierto') return 'bg-warning';
        if (statusLower === 'filled' || statusLower === 'contratado') return 'bg-success';
        if (statusLower === 'draft' || statusLower === 'borrador') return 'bg-secondary';
        if (statusLower === 'closed' || statusLower === 'cerrado') return 'bg-dark';
        return 'bg-info';
    };

    const getStatusLabel = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower === 'open') return 'Abierto';
        if (statusLower === 'filled') return 'Contratado';
        if (statusLower === 'draft') return 'Borrador';
        if (statusLower === 'closed') return 'Cerrado';
        return status;
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Posiciones</h2>
            <Row className="mb-4">
                <Col md={3}>
                    <Form.Control type="text" placeholder="Buscar por título" />
                </Col>
                <Col md={3}>
                    <Form.Control type="date" placeholder="Buscar por fecha" />
                </Col>
                <Col md={3}>
                    <Form.Control as="select">
                        <option value="">Estado</option>
                        <option value="open">Abierto</option>
                        <option value="filled">Contratado</option>
                        <option value="closed">Cerrado</option>
                        <option value="draft">Borrador</option>
                    </Form.Control>
                </Col>
                <Col md={3}>
                    <Form.Control as="select">
                        <option value="">Manager</option>
                        <option value="john_doe">John Doe</option>
                        <option value="jane_smith">Jane Smith</option>
                        <option value="alex_jones">Alex Jones</option>
                    </Form.Control>
                </Col>
            </Row>
            {positions.length === 0 ? (
                <Alert variant="info" className="text-center">
                    No hay posiciones disponibles.
                </Alert>
            ) : (
                <Row>
                    {positions.map((position) => (
                        <Col md={4} key={position.id} className="mb-4">
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>{position.title}</Card.Title>
                                    <Card.Text>
                                        <strong>Empresa:</strong> {position.companyName}<br />
                                        <strong>Ubicación:</strong> {position.location}<br />
                                        <strong>Deadline:</strong> {formatDate(position.applicationDeadline)}
                                    </Card.Text>
                                    <span className={`badge ${getStatusBadgeClass(position.status)} text-white`}>
                                        {getStatusLabel(position.status)}
                                    </span>
                                    <div className="d-flex justify-content-between mt-3">
                                        <Button variant="primary" onClick={() => handleViewProcess(position.id)}>
                                            Ver proceso
                                        </Button>
                                        <Button variant="secondary">Editar</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Positions;