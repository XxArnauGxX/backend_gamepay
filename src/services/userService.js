import { findByEmail, createUser } from '../repositories/userRepository.js';
import bcrypt from 'bcryptjs';

export async function registerService(data) {
  const exists = await findByEmail(data.email);
  if (exists) {
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userData = { ...data, password: hashedPassword };
  const user = await createUser(userData);
  if (!user) {
    throw new Error('Error creating user');
  }
  return { message: 'User created successfully' };
}
