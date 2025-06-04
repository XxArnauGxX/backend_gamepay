import { Router } from 'express';
import { seedProducts } from '../controllers/productController.js';

const productRouter = Router();

productRouter.post('/seed', seedProducts);

export default productRouter;
