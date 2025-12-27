import { Router } from 'express';
import { getAllPositions, getCandidatesByPosition, getInterviewFlowByPosition } from '../presentation/controllers/positionController';

const router = Router();

router.get('/', getAllPositions);
router.get('/:id/candidates', getCandidatesByPosition);
router.get('/:id/interviewflow', getInterviewFlowByPosition);

export default router;
