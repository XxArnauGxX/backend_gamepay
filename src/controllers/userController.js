import { registerService } from '../services/userService';

export async function register(req, res) {
  try {
    const result = await registerService(req.body);
    res.status(201).json(result);
  } catch (e) {
    if (e.message === 'User already exists') {
      return res.status(400).json({ error: e.message });
    }
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
}
