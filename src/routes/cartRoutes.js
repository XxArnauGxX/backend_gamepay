import { Router } from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  toggleCartItemSelection,
  checkoutCart,
} from '../controllers/cartController.js';

const cartRouter = Router();

cartRouter.use(authMiddleware);

cartRouter.get('/', getCart);

cartRouter.post('/', addToCart);

cartRouter.delete('/:productId', removeFromCart);

cartRouter.patch('/:productId', updateCartQuantity);

cartRouter.patch('/:productId/select', toggleCartItemSelection);

cartRouter.post('/checkout', checkoutCart);

export default cartRouter;
