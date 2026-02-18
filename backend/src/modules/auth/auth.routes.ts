import { Router } from 'express';
import { register } from './auth.controller';

const authRoutes = Router();

authRoutes.post('/register', register);
// TODO: Add auth routes here

export default authRoutes;
