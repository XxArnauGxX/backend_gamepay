import { Router } from 'express';
import userRouter from './userRoutes.js';
import productRouter from './productRoutes.js';
import cartRouter from './cartRoutes.js';

const router = Router();

router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/cart', cartRouter);

export default router;
