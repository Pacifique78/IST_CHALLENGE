import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler';
import userRoutes from './routes/userRoutes';
import todoRoutes from './routes/todoRoutes';

dotenv.config();

const app: Express = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API is running' });
});

// Main Routes
app.use('/api', userRoutes);
app.use('/api', todoRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;