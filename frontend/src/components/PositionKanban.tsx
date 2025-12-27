import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Alert, Spinner, Card } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { positionService } from '../services/positionService';
import { updateCandidateStage } from '../services/candidateService';

interface InterviewStep {
    id: number;
    interviewFlowId: number;
    interviewTypeId: number;
    name: string;
    orderIndex: number;
}

interface InterviewFlowData {
    positionName: string;
    interviewFlow: {
        id: number;
        description: string;
        interviewSteps: InterviewStep[];
    };
}

interface Candidate {
    fullName: string;
    currentInterviewStep: string;
    averageScore: number;
    applicationId?: number;
    id?: number; // candidate id
}

const PositionKanban: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [positionName, setPositionName] = useState<string>('');
    const [interviewSteps, setInterviewSteps] = useState<InterviewStep[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [candidatesByStep, setCandidatesByStep] = useState<Record<string, Candidate[]>>({});

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                setError('');

                // Fetch interview flow and candidates in parallel
                const [flowResponse, candidatesData] = await Promise.all([
                    positionService.getPositionInterviewFlow(parseInt(id)),
                    positionService.getPositionCandidates(parseInt(id))
                ]);

                // Backend response structure: { interviewFlow: { positionName, interviewFlow: {...} } }
                const flowData = flowResponse.interviewFlow || flowResponse;
                setPositionName(flowData.positionName);
                
                // Sort interview steps by orderIndex
                // flowData.interviewFlow contains the actual flow with interviewSteps
                const interviewFlowData = flowData.interviewFlow;
                const sortedSteps = (interviewFlowData?.interviewSteps || []).sort(
                    (a, b) => a.orderIndex - b.orderIndex
                );
                setInterviewSteps(sortedSteps);

                // Initialize candidates by step
                const stepMap: Record<string, Candidate[]> = {};
                sortedSteps.forEach(step => {
                    stepMap[step.name] = [];
                });

                // Group candidates by their current interview step
                candidatesData.forEach((candidate: Candidate) => {
                    const stepName = candidate.currentInterviewStep || sortedSteps[0]?.name || '';
                    if (stepMap[stepName]) {
                        stepMap[stepName].push(candidate);
                    } else {
                        // If step doesn't exist, add to first step
                        if (sortedSteps.length > 0) {
                            stepMap[sortedSteps[0].name].push(candidate);
                        }
                    }
                });

                setCandidates(candidatesData);
                setCandidatesByStep(stepMap);
            } catch (err: any) {
                console.error('Error fetching position data:', err);
                setError(err.response?.data?.message || 'Failed to load position data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        // If dropped in the same position, do nothing
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceStepName = source.droppableId;
        const destStepName = destination.droppableId;
        const candidate = candidatesByStep[sourceStepName][source.index];

        // Find the destination step ID
        const destStep = interviewSteps.find(step => step.name === destStepName);
        if (!destStep || !candidate.id || !candidate.applicationId) {
            setError('Unable to update candidate stage. Missing required information.');
            return;
        }

        // Optimistically update UI
        const newCandidatesByStep = { ...candidatesByStep };
        newCandidatesByStep[sourceStepName] = newCandidatesByStep[sourceStepName].filter(
            (_, index) => index !== source.index
        );
        newCandidatesByStep[destStepName] = [
            ...newCandidatesByStep[destStepName].slice(0, destination.index),
            { ...candidate, currentInterviewStep: destStepName },
            ...newCandidatesByStep[destStepName].slice(destination.index)
        ];
        setCandidatesByStep(newCandidatesByStep);

        // Update candidate stage via API
        try {
            await updateCandidateStage(candidate.id, candidate.applicationId, destStep.id);
        } catch (err: any) {
            console.error('Error updating candidate stage:', err);
            setError(err.response?.data?.message || 'Failed to update candidate stage. Please try again.');
            // Revert optimistic update
            setCandidatesByStep(candidatesByStep);
        }
    };

    const renderScore = (score: number) => {
        const maxScore = 5;
        const filledCircles = Math.min(score, maxScore);
        const circles = [];

        for (let i = 0; i < maxScore; i++) {
            circles.push(
                <span
                    key={i}
                    className={`rounded-circle d-inline-block me-1 ${
                        i < filledCircles ? 'bg-success' : 'bg-light border'
                    }`}
                    style={{
                        width: '12px',
                        height: '12px',
                        border: i >= filledCircles ? '1px solid #dee2e6' : 'none'
                    }}
                    aria-label={`Score: ${score}`}
                />
            );
        }
        return <div className="d-flex align-items-center">{circles}</div>;
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

    if (error && !candidatesByStep) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    {error}
                    <div className="mt-2">
                        <button className="btn btn-primary" onClick={() => navigate('/positions')}>
                            Back to Positions
                        </button>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="mt-4 px-3">
            {/* Header with back arrow and position title */}
            <div className="d-flex align-items-center mb-4">
                <button
                    className="btn btn-link p-0 me-2"
                    onClick={() => navigate('/positions')}
                    aria-label="Back to positions"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="mb-0">{positionName}</h2>
            </div>

            {error && (
                <Alert variant="warning" dismissible onClose={() => setError('')} className="mb-3">
                    {error}
                </Alert>
            )}

            {/* Kanban Board */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="d-flex flex-column flex-md-row overflow-auto">
                    {interviewSteps.map((step) => (
                        <div
                            key={step.id}
                            className="flex-fill mb-3 mb-md-0 me-md-3"
                            style={{ minWidth: '250px' }}
                        >
                            <Card className="h-100">
                                <Card.Header className="bg-primary text-white">
                                    <h5 className="mb-0">{step.name}</h5>
                                </Card.Header>
                                <Card.Body className="p-2" style={{ minHeight: '200px', maxHeight: '70vh', overflowY: 'auto' }}>
                                    <Droppable droppableId={step.name}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`h-100 ${snapshot.isDraggingOver ? 'bg-light' : ''}`}
                                                style={{ minHeight: '150px' }}
                                            >
                                                {candidatesByStep[step.name]?.map((candidate, index) => (
                                                    <Draggable
                                                        key={`${candidate.fullName}-${index}`}
                                                        draggableId={`${candidate.fullName}-${index}-${step.id}`}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <Card
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`mb-2 ${snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'}`}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    cursor: 'grab'
                                                                }}
                                                            >
                                                                <Card.Body className="p-3">
                                                                    <div className="d-flex justify-content-between align-items-start">
                                                                        <div className="flex-grow-1">
                                                                            <h6 className="mb-2">{candidate.fullName}</h6>
                                                                            {renderScore(candidate.averageScore)}
                                                                        </div>
                                                                    </div>
                                                                </Card.Body>
                                                            </Card>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                                {candidatesByStep[step.name]?.length === 0 && (
                                                    <div className="text-muted text-center py-4">
                                                        No candidates
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Droppable>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </Container>
    );
};

export default PositionKanban;

