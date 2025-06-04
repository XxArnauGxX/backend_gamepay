import { Router } from 'express';
import {
  getProductById,
  listFirstTen,
  searchByName,
  seedProducts,
} from '../controllers/productController.js';

const productRouter = Router();

productRouter.post('/seed', seedProducts);
productRouter.get('/', listFirstTen);
productRouter.get('/search', searchByName);
productRouter.get('/:id', getProductById);

export default productRouter;
