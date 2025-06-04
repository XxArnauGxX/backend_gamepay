import jwt from 'jsonwebtoken';
import { findById } from '../repositories/userRepository.js';

export default async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ error: 'No se proporcionó token de autorización.' });
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Token inválido o expirado.' });
    }

    const user = await findById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no existe.' });
    }

    req.userId = user._id;
    next();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno en autenticación.' });
  }
}
