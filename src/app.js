import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/baseRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', router);

export default app;
