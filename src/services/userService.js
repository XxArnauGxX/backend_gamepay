import {
  findByEmail,
  createUser,
  findById,
  updateRefreshToken,
} from '../repositories/userRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRES_IN = '5m';
const REFRESH_TOKEN_EXPIRES_IN = '24h';

export async function registerService(data) {
  const exists = await findByEmail(data.email);
  if (exists) {
    const err = new Error('User already exists');
    err.statusCode = 409;
    throw err;
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userData = { ...data, password: hashedPassword };
  const user = await createUser(userData);
  if (!user) {
    const err = new Error('Error creating user');
    err.statusCode = 500;
    throw err;
  }
  return { message: 'User created successfully' };
}

export async function loginService(email, password) {
  const user = await findByEmail(email);
  if (!user) {
    const err = new Error('Credenciales inválidas');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Credenciales inválidas');
    err.statusCode = 401;
    throw err;
  }

  const payload = { userId: user._id };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  await updateRefreshToken(user._id, refreshToken);

  const safeUser = {
    id: user._id,
    email: user.email,
    name: user.name,
    surname: user.surname,
  };

  return { accessToken, refreshToken, user: safeUser };
}

export async function refreshTokenService(refreshFromClient) {
  let payload;
  try {
    payload = jwt.verify(refreshFromClient, process.env.JWT_SECRET);
  } catch {
    const err = new Error('Refresh token inválido o expirado');
    err.statusCode = 401;
    throw err;
  }

  const user = await findById(payload.userId);
  if (!user) {
    const err = new Error('Usuario no existe');
    err.statusCode = 401;
    throw err;
  }

  if (user.refreshToken !== refreshFromClient) {
    const err = new Error('Refresh token no coincide');
    err.statusCode = 401;
    throw err;
  }

  const newAccessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    }
  );
  const newRefreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    }
  );

  await updateRefreshToken(user._id, newRefreshToken);

  const safeUser = {
    id: user._id,
    email: user.email,
    name: user.name,
    surname: user.surname,
  };

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: safeUser,
  };
}

export async function logoutService(refreshFromClient) {
  let payload;
  try {
    payload = jwt.verify(refreshFromClient, process.env.JWT_SECRET);
  } catch {
    const err = new Error('Refresh token inválido');
    err.statusCode = 401;
    throw err;
  }

  await updateRefreshToken(payload.userId, null);
}
