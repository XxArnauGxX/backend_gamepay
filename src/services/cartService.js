import {
  findCartByUserId,
  addProductToCart,
  removeProductFromCart,
  updateCartItemQuantity,
  updateCartItemSelection,
  removeSelectedItemsFromCart,
} from '../repositories/cartRepository.js';

export async function getCartService(userId) {
  const user = await findCartByUserId(userId);
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return user.cart;
}

export async function addToCartService(userId, productId) {
  const user = await addProductToCart(userId, productId);
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return user.cart;
}

export async function removeFromCartService(userId, productId) {
  const user = await removeProductFromCart(userId, productId);
  if (!user) {
    const err = new Error('Usuario o producto no encontrado en el carrito');
    err.statusCode = 404;
    throw err;
  }
  return user.cart;
}

export async function updateCartQuantityService(userId, productId, quantity) {
  if (quantity < 1) {
    const err = new Error('La cantidad debe ser al menos 1');
    err.statusCode = 400;
    throw err;
  }
  const user = await updateCartItemQuantity(userId, productId, quantity);
  if (!user) {
    const err = new Error('Usuario o producto no encontrado en el carrito');
    err.statusCode = 404;
    throw err;
  }
  return user.cart;
}

export async function toggleCartItemSelectionService(
  userId,
  productId,
  selected
) {
  const user = await updateCartItemSelection(userId, productId, selected);
  if (!user) {
    const err = new Error('Usuario o producto no encontrado en el carrito');
    err.statusCode = 404;
    throw err;
  }
  return user.cart;
}

export async function checkoutCartService(userId) {
  const result = await removeSelectedItemsFromCart(userId);
  if (!result) {
    const err = new Error('Usuario no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return result;
}
