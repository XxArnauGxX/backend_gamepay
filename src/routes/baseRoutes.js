import { Router } from 'express';
import userRouter from './userRoutes.js';
import productRouter from './productRoutes.js';

const router = Router();

router.use('/users', userRouter);
router.use('/products', productRouter);

export default router;
