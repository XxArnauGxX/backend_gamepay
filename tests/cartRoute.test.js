// tests/cartRoute.test.js

import mongoose from 'mongoose';
import request from 'supertest';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

import app from '../src/app.js';
import User from '../src/models/user.js';
import Product from '../src/models/product.js';

const MONGODB_URI = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI;

describe('Cart Routes - DELETE /api/cart/:productId', () => {
  let accessToken;
  let prodId;

  beforeAll(async () => {
    // 1. Connectar a la BD
    await mongoose.connect(MONGODB_URI);

    // 2. Crear un producte de prova
    const product = await Product.create({
      title: 'Route Test Product',
      overview: 'Overview route test',
      image: 'route.jpg',
      releaseDate: '2025-01-10',
      rating: 8,
      price: 15.5,
      tmdbId: 9999,
      genres: ['TestRoute'],
    });
    prodId = product._id.toString();

    // 3. Registrar i loguejar un usuari
    const userData = {
      email: 'route.test@example.com',
      password: 'Abcde1',
      confirmPassword: 'Abcde1',
      name: 'Route',
      surname: 'Tester',
      address: 'Route Address',
    };
    // Registre
    await request(app)
      .post('/api/users/register')
      .send(userData)
      .set('Content-Type', 'application/json');
    // Login
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: userData.email, password: userData.password })
      .set('Content-Type', 'application/json');
    expect(loginRes.status).toBe(200);
    accessToken = loginRes.body.accessToken;

    // 4. Afegir el producte al carrito
    const addRes = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ productId: prodId })
      .set('Content-Type', 'application/json');
    expect(addRes.status).toBe(200);
    const user = await User.findOne({ email: userData.email });
    expect(user.cart.length).toBe(1);
  });

  afterAll(async () => {
    // Netejar BD
    await User.deleteOne({ email: 'route.test@example.com' });
    await Product.deleteOne({ tmdbId: 9999 });
    await mongoose.connection.close();
  });

  it('debe devolver 200 y el carrito vacío tras DELETE', async () => {
    // 1. DELETE /api/cart/:productId
    const deleteRes = await request(app)
      .delete(`/api/cart/${prodId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(deleteRes.status).toBe(200);
    expect(Array.isArray(deleteRes.body)).toBe(true);
    expect(deleteRes.body.length).toBe(0);

    // 2. GET /api/cart para confirmar que está vacío
    const getRes = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(getRes.status).toBe(200);
    expect(Array.isArray(getRes.body)).toBe(true);
    expect(getRes.body.length).toBe(0);
  });

  it('si el producto no está en el carrito debe devolver 404', async () => {
    const deleteRes2 = await request(app)
      .delete(`/api/cart/${prodId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(deleteRes2.status).toBe(404);
    expect(deleteRes2.body).toHaveProperty(
      'error',
      'Usuario o producto no encontrado en el carrito'
    );
  });
});
