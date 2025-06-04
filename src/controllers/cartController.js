import {
  getCartService,
  addToCartService,
  removeFromCartService,
  updateCartQuantityService,
  toggleCartItemSelectionService,
  checkoutCartService,
} from '../services/cartService.js';

export async function getCart(req, res) {
  try {
    const cart = await getCartService(req.userId);
    return res.status(200).json(cart);
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    return res.status(status).json({ error: e.message });
  }
}

export async function addToCart(req, res) {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res
        .status(400)
        .json({ error: 'Se requiere productId en el body' });
    }
    const cart = await addToCartService(req.userId, productId);
    return res.status(200).json(cart);
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    return res.status(status).json({ error: e.message });
  }
}

export async function removeFromCart(req, res) {
  try {
    const { productId } = req.params;
    const cart = await removeFromCartService(req.userId, productId);
    return res.status(200).json(cart);
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    return res.status(status).json({ error: e.message });
  }
}

export async function updateCartQuantity(req, res) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined) {
      return res.status(400).json({ error: 'Se requiere quantity en el body' });
    }
    const cart = await updateCartQuantityService(
      req.userId,
      productId,
      quantity
    );
    return res.status(200).json(cart);
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    return res.status(status).json({ error: e.message });
  }
}

export async function toggleCartItemSelection(req, res) {
  try {
    const { productId } = req.params;
    const { selected } = req.body;
    if (selected === undefined) {
      return res.status(400).json({ error: 'Se requiere selected en el body' });
    }
    const cart = await toggleCartItemSelectionService(
      req.userId,
      productId,
      selected
    );
    return res.status(200).json(cart);
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    return res.status(status).json({ error: e.message });
  }
}

export async function checkoutCart(req, res) {
  try {
    const { removedItems, remainingCart } = await checkoutCartService(
      req.userId
    );
    return res
      .status(200)
      .json({ message: 'Compra confirmada', removedItems, remainingCart });
  } catch (e) {
    console.error(e);
    const status = e.statusCode || 500;
    return res.status(status).json({ error: e.message });
  }
}
