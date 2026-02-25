import { Router } from 'express';
import { generateRealTimeToken } from './interview.service';

const interviewRoutes = Router();

interviewRoutes.get('/generate-connection-token', generateRealTimeToken);

// TODO: Add interview routes here

export default interviewRoutes;
