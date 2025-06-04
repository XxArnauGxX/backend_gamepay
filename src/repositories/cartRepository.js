import User from '../models/user.js';

export async function findCartByUserId(userId) {
  return await User.findById(userId).populate('cart.productId');
}

export async function addProductToCart(userId, productId) {
  const user = await User.findById(userId);
  if (!user) return null;

  const existing = user.cart.find(
    (item) => item.productId.toString() === productId
  );
  if (existing) {
    existing.quantity += 1;
  } else {
    user.cart.push({ productId, quantity: 1, selected: true });
  }

  await user.save();
  return user;
}

export async function removeProductFromCart(userId, productId) {
  const user = await User.findById(userId);
  if (!user) return null;

  user.cart = user.cart.filter(
    (item) => item.productId.toString() !== productId
  );
  await user.save();
  return user;
}

export async function updateCartItemQuantity(userId, productId, quantity) {
  const user = await User.findById(userId);
  if (!user) return null;

  const item = user.cart.find((i) => i.productId.toString() === productId);
  if (!item) return null;

  item.quantity = quantity;
  await user.save();
  return user;
}

export async function updateCartItemSelection(userId, productId, selected) {
  const user = await User.findById(userId);
  if (!user) return null;

  const item = user.cart.find((i) => i.productId.toString() === productId);
  if (!item) return null;

  item.selected = selected;
  await user.save();
  return user;
}

export async function removeSelectedItemsFromCart(userId) {
  const user = await User.findById(userId).populate('cart.productId');
  if (!user) return null;

  const removedItems = user.cart.filter((i) => i.selected);
  user.cart = user.cart.filter((i) => !i.selected);

  await user.save();
  return { removedItems, remainingCart: user.cart };
}
