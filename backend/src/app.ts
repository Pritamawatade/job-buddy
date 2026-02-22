import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './modules/auth/auth.routes';
import interviewRoutes from './modules/interview/itnerview.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import ApiError from './utils/ApiError';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/interview', interviewRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

app.use(errorMiddleware);
export default app;
