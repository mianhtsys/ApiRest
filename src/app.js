import express from 'express';

const app = express();
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import taskRoutes from './routes/task.router.js';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';
import { authenticatedToken } from './middlewares/authenticated.js';



//middlewares
app.use(morgan('dev')); // logging middleware
app.use(express.json()); // to parse JSON bodies
//import routes
app.use('/api/login', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tasks', authenticatedToken, taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;