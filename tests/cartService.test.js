// tests/cartService.test.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

import User from '../src/models/user.js';
import Product from '../src/models/product.js';

import { removeProductFromCart } from '../src/repositories/cartRepository.js';
import { removeFromCartService } from '../src/services/cartService.js';

const MONGODB_URI = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI;

describe('Cart Service - removeFromCartService', () => {
  let userId;
  let prodId1;
  let prodId2;

  beforeAll(async () => {
    // 1. Connectar a MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // 2. Crear dos productes de prova
    const prod1 = await Product.create({
      title: 'Test Product 1',
      overview: 'Overview 1',
      image: 'img1.jpg',
      releaseDate: '2025-01-01',
      rating: 5,
      price: 10.99,
      tmdbId: 9991,
      genres: ['Test'],
    });
    const prod2 = await Product.create({
      title: 'Test Product 2',
      overview: 'Overview 2',
      image: 'img2.jpg',
      releaseDate: '2025-01-02',
      rating: 6,
      price: 20.99,
      tmdbId: 9992,
      genres: ['Test'],
    });
    prodId1 = prod1._id.toString();
    prodId2 = prod2._id.toString();

    // 3. Crear un usuari amb un cart que contingui els dos productes
    const hashed = await bcrypt.hash('Abcde1', 10);
    const user = await User.create({
      email: 'unit.test@example.com',
      password: hashed,
      name: 'Unit',
      surname: 'Test',
      address: 'Test Address',
      cart: [
        { productId: prodId1, quantity: 2, selected: true },
        { productId: prodId2, quantity: 1, selected: true },
      ],
      refreshToken: null,
    });
    userId = user._id.toString();
  });

  afterAll(async () => {
    // Netejar dades i tancar connexió
    await User.deleteMany({ email: 'unit.test@example.com' });
    await Product.deleteMany({ tmdbId: { $in: [9991, 9992] } });
    await mongoose.connection.close();
  });

  it('debe eliminar correctamente el producto del carrito y retornar el carrito actualizado', async () => {
    // Verificar que inicialment el cart té 2 ítems
    const userBefore = await User.findById(userId);
    expect(userBefore.cart.length).toBe(2);

    // Usar directament el repositori
    const updatedUser = await removeProductFromCart(userId, prodId1);
    expect(updatedUser.cart.length).toBe(1);
    const remainingIds = updatedUser.cart.map((i) => i.productId.toString());
    expect(remainingIds).toContain(prodId2);
    expect(remainingIds).not.toContain(prodId1);

    // Ara provar el servei
    const cartAfterService = await removeFromCartService(userId, prodId2);
    expect(cartAfterService.length).toBe(0);
  });

  it('si el producto no existe en el carrito debe lanzar error 404', async () => {
    await expect(removeFromCartService(userId, prodId1)).rejects.toThrow(
      'Usuario o producto no encontrado en el carrito'
    );
  });
});
